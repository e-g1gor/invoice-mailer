'use strict'

import express from "express"
import invoiceController from "../controllers/invoice-controller.js"

export const router = express.Router()

/* Generate invoice */
router.post("/", invoiceController.requestInvoice)

export default router
