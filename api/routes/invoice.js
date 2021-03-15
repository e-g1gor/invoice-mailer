var express = require('express');
var router = express.Router();
const invoiceController = require('../controllers/invoice')

/* GET users listing. */
router.get('/', async (req, res) => {
  // TODO: use invoice controller
  res.send('Try to send invoice and respond with status');
});

module.exports = router;
