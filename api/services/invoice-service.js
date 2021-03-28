"use strict"

import fs from "fs-extra"
import path from "path"
import glob from "glob"
import pug from "pug"
import { Queue } from "bullmq"
import nodemailer from "nodemailer"
import mg from "nodemailer-mailgun-transport"

import DAO from "./dao.js"

import mailConfig from "../../config/mail.js"
import {
  REDIS_CONNECTION_OPTION,
  RENDER_PDF_QUEUE_NAME
} from "../../config/bullmq-connection.js"

// TODO: separate worker to service
import { pdfQueueEvents } from "../../pdf-renderer/pdf-renderer.js"

// Configure mailer
const { mailgunAuth, myEmail } = mailConfig
const nodemailerMailgun = nodemailer.createTransport(mg(mailgunAuth))

// Configure BullMQ
const pdfQueue = new Queue(RENDER_PDF_QUEUE_NAME, REDIS_CONNECTION_OPTION)

/**
 * Request validation
 */
export const invoiceValidate = {
  requestInvoiceBody(data) {
    // Verify fields
    const missingFieldsTest = [
      "dueDate",
      "completeDate",
      "customerEmail",
      "services"
    ].every((field) => Object.keys(data).includes(field))
    if (!missingFieldsTest)
      return {
        status: 400,
        message: "Malformed request: " + JSON.stringify(data)
      }
  }
}

/**
 * Invoice service
 */
export const invoiceService = {
  /**
   * Load customer data by email
   * @param {String} email customer email
   * @returns query result
   */
  async getCustomerByEmail(email) {
    return await DAO.query(`SELECT * FROM customers WHERE email = $1`, [email])
  },

  /**
   * Log invoice request to db
   * @param {*} invoiceData invoice request body
   * @param {"created"|"complete"|"failed"} status invoice request status
   * @returns query result
   */
  async logInvoiceRequestToDB(invoiceData, status = "created") {
    return await DAO.query(
      `INSERT INTO invoices (invoice_data, status) VALUES($1, $2) RETURNING *`,
      [JSON.stringify(invoiceData), status]
    )
  },

  /**
   * Update invoice status
   * @param {Number} id invoice id
   * @param {"created"|"complete"|"failed"} status invoice request status
   */
  async updateInvoiceStatus(id, status) {
    return await DAO.query(`UPDATE invoices SET status = $1 WHERE id = $2`, [
      status,
      id
    ])
  },

  /**
   *
   * @param {String} invoiceTemplateDir path to directory with invoice template
   * @param {*} invoiceData
   */
  async RenderPugTemplate(invoiceTemplateDir, invoiceData) {
    // Load all images from template folder
    const img = {}
    glob.sync(invoiceTemplateDir + "/*.webp").map((image) => {
      const name = path.basename(image, path.extname(image))
      img[name] = Buffer.from(fs.readFileSync(image)).toString("base64")
    })
    // Render HTML
    return pug.renderFile(invoiceTemplateDir + "/invoice.pug", {
      img,
      invoiceData
    })
  },

  /**
   * Add invoice data to queue for rendering and sending
   * @param {*} invoiceData
   */
  async sheduleInvoiceProcessing(invoiceData) {
    // Render html
    const html = await this.RenderPugTemplate(
      "./api/views/invoice",
      invoiceData
    )

    // Render pdf
    pdfQueue.add("render", { invoiceData, html })
  }
}

// Configure related BullMQ jobs
// TODO: separate to worker
pdfQueueEvents.on("completed", async (job) => {
  const { invoiceData, pdfBuffer, html } = job.returnvalue
  const mailContent = {
    from: myEmail,
    to: invoiceData.customerEmail,
    subject: `(Test email. No opt-out required) Invoice #${invoiceData.id} from Brick and Willow Design`,
    "h:Reply-To": myEmail,
    html,
    text: "See your invoice in attachment.",
    attachments: [
      {
        cid: "invoice.pdf",
        content: pdfBuffer.toString("base64"),
        encoding: "base64"
      }
    ]
  }
  try {
    await nodemailerMailgun.sendMail(mailContent)
    invoiceService.updateInvoiceStatus(invoiceData.id, "complete")
  } catch (err) {
    invoiceService.updateInvoiceStatus(invoiceData.id, "failed")
    console.log("Mail sending error: " + err)
  }
})
