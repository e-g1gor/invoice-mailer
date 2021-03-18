var express = require("express");
var router = express.Router();
const invoiceController = require("../controllers/invoice");

/* Generate invoice */
router.post("/", invoiceController.requestInvoice);

module.exports = router;
