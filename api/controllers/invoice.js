"use strict";

const invoiceService = require("../services/invoice");
const nodemailer = require("nodemailer");
const mg = require("nodemailer-mailgun-transport");
const mailConfig = require("../../config/mail");
const { mailgunAuth, myEmail } = mailConfig;
const nodemailerMailgun = nodemailer.createTransport(mg(mailgunAuth));

/**
 * Request validation
 */
const validate = {
  requestInvoiceBody(data) {
    // Verify fields
    const missingFieldsTest = [
      "dueDate",
      "completeDate",
      "customerEmail",
      "services",
    ].every((field) => Object.keys(data).includes(field));
    if (!missingFieldsTest)
      return {
        status: 400,
        message: "Malformed request: " + JSON.stringify(data),
      };
  },
};

class invoiceController {
  /**
   * Create invoice with provided data and send pdf on customer email
   * @param {*} req
   * @param {*} res
   */
  static async requestInvoice(req, res) {
    // TODO: use some task sheduling
    try {
      const bodyCheck = validate.requestInvoiceBody(req.body);
      if (bodyCheck)
        return res.status(bodyCheck.status).send(bodyCheck.message);
      const invoiceData = req.body; // Create log record
      const newInvoiceQuery = await invoiceService.logInvoiceRequestToDB(
        invoiceData
      );
      const newInvoiceRecord = newInvoiceQuery.rows[0];
      // Load customer data
      const customerDataQuery = await invoiceService.getCustomerByEmail(
        invoiceData.customerEmail
      );
      const customerData = customerDataQuery.rows[0];
      if (customerDataQuery.rows.length === 0)
        return res
          .status(404)
          .send(
            `Can't find customer with email: <${invoiceData.customerEmail}>`
          );
      // Format invoice data
      Object.assign(invoiceData, {
        id: newInvoiceRecord.id,
        customerFullName: customerData.firstname + " " + customerData.lastname,
        company: customerData.company,
        completeDate: new Date(invoiceData.completeDate),
        dueDate: new Date(invoiceData.dueDate),
        tax: invoiceData.tax || 0,
      });
      // Render html
      const html = await invoiceService.RenderPugTemplate(
        "./api/views/invoice",
        invoiceData
      );
      // Render pdf
      const pdfBuffer = await invoiceService.renderHTMLToPDF(html);
      // Send invoice to customer
      let mailContent = {
        from: myEmail,
        to: invoiceData.customerEmail,
        subject: `(Test email. No opt-out required) Invoice #${newInvoiceRecord.id} from Brick and Willow Design`,
        "h:Reply-To": myEmail,
        html,
        text: "See your invoice in attachment.",
        attachments: [
          {
            cid: "invoice.pdf",
            content: pdfBuffer.toString("base64"),
            encoding: "base64",
          },
        ],
      };
      const mailStatus = await nodemailerMailgun.sendMail(mailContent);
      // Update invoice log record
      await invoiceService.updateInvoiceStatus(invoiceData.id, "complete");
      res.send(
        `OK. Invoice #${newInvoiceRecord.id} sent to ${invoiceData.customerEmail}`
      );
    } catch (err) {
      let error;
      try {
        error = JSON.stringify(err);
      } catch (_) {
        error = "No error data available.";
      }
      res.status(500).send();
      // Update invoice log record (or delete?)
      await invoiceService.updateInvoiceStatus({ error, req }, "failed");
    }
  }
}

module.exports = invoiceController;
