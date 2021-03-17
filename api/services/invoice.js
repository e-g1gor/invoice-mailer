"use strict";

const fs = require("fs-extra");
const path = require("path");
const glob = require("glob");
const pug = require("pug");
const htmlToPdf = require("html-pdf-node");

const DAO = require("./dao");

// TODO: implement invoice related logic
/**
 * Invoice service
 */
const invoiceService = {
  /**
   *
   * @param {String} email customer email
   */
  async getCustomerByEmail(email) {
    return await DAO.query(
      `SELECT * FROM ${DEFAULT_SCHEMA}.customers WHERE email = $1`,
      [email]
    );
  },

  /**
   *
   * @param {*} invoiceData
   */
  async logInvoiceRequestToDB(invoiceData) {},

  /**
   *
   * @param {String} invoiceTemplateDir path to directory with invoice template
   * @param {*} invoiceData
   */
  async RenderPugTemplate(invoiceTemplateDir, invoiceData) {
    // Load all images from template folder
    const img = {};
    glob.sync(invoiceTemplateDir + "/*.webp").map((image) => {
      const name = path.basename(image, path.extname(image));
      img[name] = Buffer.from(fs.readFileSync(image)).toString("base64");
    });
    // Render HTML
    return pug.renderFile(invoiceTemplateDir + "/invoice.pug", {
      img,
      invoiceData,
    });
  },

  /**
   *
   * @param {String} html
   * @param {*} options
   */
  async renderHTMLToPDF(html, options) {
    // Merge default and provided options
    const renderOptions = Object.assign(
      {
        printBackground: true,
        width: "600px",
      },
      options
    );
    // Render pdf
    return await htmlToPdf.generatePdf({ content: html }, renderOptions);
  },
};

module.exports = invoiceService;
