"use strict"

import fs from "fs-extra"
import path from "path"
import glob from "glob"
import pug from "pug"

import DAO from "./dao.js"

import {
  PdfRenderQueue as pdfQueue,
  pdfQueueEvents,
  mailQueueEvents
} from "../../config/bullmq-connection.js"

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
    // Shedule pdf rendering
    pdfQueue.add("render", { invoiceData, html })
  }
}

// Log invoice processing results
mailQueueEvents.on("completed", async (job) => {
  const { id } = job.returnvalue
  invoiceService.updateInvoiceStatus(id, "complete")
})
// TODO: process failures
pdfQueueEvents.on("failed", async (job) => {
  console.log(job.failedReason)
  const {id} = job.data.invoiceData.id
  invoiceService.updateInvoiceStatus(id, "failed")
})
mailQueueEvents.on("failed", async (job) => {
  console.log(job.failedReason)
  const {id} = job.data.invoiceData.id
  invoiceService.updateInvoiceStatus(id, "failed")
})
