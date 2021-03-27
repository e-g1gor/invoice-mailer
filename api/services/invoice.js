"use strict"

import fs from "fs-extra"
import path from "path"
import glob from "glob"
import pug from "pug"
import htmlToPdf from "html-pdf-node"

import DAO from "./dao.js"

/**
 * Invoice service
 */
const invoiceService = {
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
   * Render pdf
   * @param {String} html generated invoice html
   * @param {*} options pdf render options
   * @returns buffer with rendered pdf
   */
  async renderHTMLToPDF(html, options) {
    // Merge default and provided options
    const renderOptions = Object.assign(
      {
        printBackground: true,
        width: "600px"
      },
      options
    )
    // Render pdf
    return await htmlToPdf.generatePdf({ content: html }, renderOptions)
  }
}

export default invoiceService
