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
      /** Mock invoice data */
      // TODO: load data from db
      const invoiceData = require("../mocks/invoice");
      // TODO: log request to db
      const html = await invoiceService.RenderPugTemplate(
        "./api/views/invoice",
        invoiceData
      );
      const pdfBuffer = await invoiceService.renderHTMLToPDF(html);
      fs.outputFileSync("./data/test.pdf", pdfBuffer);
      res.send(html);
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = invoiceController;
