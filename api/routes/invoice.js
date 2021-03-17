var express = require("express");
var router = express.Router();
const invoiceController = require("../controllers/invoice");

/* Generate invoice */
router.get("/", invoiceController.requestInvoice);

module.exports = router;
