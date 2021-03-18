"use strict";
const fs = require("fs-extra");
const invoiceService = require("../services/invoice");
class invoiceController {
  /**

   * @param {*} req 
   * @param {*} res 
   */
  static async requestInvoice(req, res) {
    // TODO: use some task sheduling
    try {
      const invoiceData = req.body
      // TODO: validate body
      // TODO: log request to db
      const newInvoiceRecord = {id:666}
      // Load customer data
      const customerDataQuery = await invoiceService.getCustomerByEmail(invoiceData.customerEmail)
      const customerData = customerDataQuery.rows[0]
      // Format invoice data
      Object.assign(invoiceData, {
        id: newInvoiceRecord.id,
        customerFullName: customerData.firstname + " " + customerData.lastname,
        company: customerData.company,
        completeDate: new Date(invoiceData.completeDate),
        dueDate: new Date(invoiceData.dueDate),
        tax: invoiceData.tax || 0
      })
      console.log(invoiceData);
      // Render html
      const html = await invoiceService.RenderPugTemplate(
        "./api/views/invoice",
        invoiceData
      );
      // Render pdf
      const pdfBuffer = await invoiceService.renderHTMLToPDF(html);
      res.send(`OK. Invoice #${newInvoiceRecord.id} sent to  + <${invoiceData.customerEmail}>`)
    } catch (err) {
      res.status(500).send(err)
    }
  }
}

module.exports = invoiceController;
