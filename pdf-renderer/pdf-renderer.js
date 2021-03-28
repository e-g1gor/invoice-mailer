"use strict"

import htmlToPdf from "html-pdf-node"
import { Worker, QueueEvents } from "bullmq"
import {
  REDIS_CONNECTION_OPTION,
  RENDER_PDF_QUEUE_NAME
} from "../config/bullmq-connection.js"
// TODO: remove after worker separation to service
export const pdfQueueEvents = new QueueEvents(
  RENDER_PDF_QUEUE_NAME,
  REDIS_CONNECTION_OPTION
)

// PDF rendering worker
export const pdfRenderWorker = new Worker(
  RENDER_PDF_QUEUE_NAME,
  async (job) => {
    const { invoiceData, html, options } = job.data
    // Merge default and provided options
    const renderOptions = Object.assign(
      {
        printBackground: true,
        width: "600px"
      },
      options
    )
    // Render pdf
    const pdfBuffer = await htmlToPdf.generatePdf(
      { content: html },
      renderOptions
    )
    return { invoiceData, pdfBuffer, html }
  },
  REDIS_CONNECTION_OPTION
)
