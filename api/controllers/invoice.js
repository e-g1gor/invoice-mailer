'use strict'
const pug = require('pug')
const fs = require('fs-extra')
const path = require('path')
const invoiceService = require('../services/invoice')

class invoiceController {

  /**

   * @param {*} req 
   * @param {*} res 
   */
  static async requestInvoice(req,res) {
    // TODO: log request to db
    // TODO: shedule pdf generation
    // TODO: shedule mail
    try {
      const html = pug.renderFile('./api/views/invoice/invoice.pug', {
        logo: Buffer.from(fs.readFileSync('./api/views/invoice/logo.webp')).toString('base64'),
      })
      res.send(html);
    } catch (err) { 
      console.log(err); 
    }
  }
}



module.exports = invoiceController;
