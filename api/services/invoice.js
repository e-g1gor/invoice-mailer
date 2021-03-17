'use strict'

const mailConfig = require('../../config/mail')
const DAO = require("./dao")
DAO.test()

// TODO: implement invoice related logic
class invoiceService {

  logInvoiceRequestToDB() {}

  renderPDF() {}

  mailInvoice() {}
}

module.exports = invoiceService
