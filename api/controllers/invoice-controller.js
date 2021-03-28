"use strict"

import { invoiceService, invoiceValidate } from "../services/invoice-service.js"


export class invoiceController {
  /**
   * Create invoice with provided data and send pdf on customer email
   * @param {*} req
   * @param {*} res
   */
  static async requestInvoice(req, res) {
    // TODO: use some task sheduling
    try {
      // Validate
      const bodyCheck = invoiceValidate.requestInvoiceBody(req.body)
      if (bodyCheck)
        return res.status(bodyCheck.status).send(bodyCheck.message)
      const invoiceData = req.body
      // Create log record in db
      const newInvoiceQuery = await invoiceService.logInvoiceRequestToDB(
        invoiceData
      )
      const newInvoice = newInvoiceQuery.rows[0]
      // Load customer data
      const customerDataQuery = await invoiceService.getCustomerByEmail(
        invoiceData.customerEmail
      )
      const customerData = customerDataQuery.rows[0]
      if (customerDataQuery.rows.length === 0)
        return res
          .status(404)
          .send(
            `Can't find customer with email: <${invoiceData.customerEmail}>`
          )
      // Format invoice data
      Object.assign(invoiceData, {
        id: newInvoice.id,
        customerFullName: customerData.firstname + " " + customerData.lastname,
        company: customerData.company,
        completeDate: new Date(invoiceData.completeDate),
        dueDate: new Date(invoiceData.dueDate),
        tax: invoiceData.tax || 0
      })
      // Shedule further invoice processing
      invoiceService.sheduleInvoiceProcessing(invoiceData)
      res.send(
        `OK. Invoice #${newInvoice.id} is sheduled for rendering and sending.`
      )
    } catch (err) {
      let error
      try {
        error = JSON.stringify(err)
      } catch (_) {
        error = "No error data available."
      }
      res.status(500).send()
      // Update invoice log record (or delete?)
      await invoiceService.updateInvoiceStatus({ error, req }, "failed")
    }
  }
}

export default invoiceController
