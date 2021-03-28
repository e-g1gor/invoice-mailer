"use strict"

import htmlToPdf from "html-pdf-node"
import { Worker } from "bullmq"

import { myEmail } from "../config/mail.js"
import {
  REDIS_CONNECTION_OPTION,
  RENDER_PDF_QUEUE_NAME,
  MailSendQueue,
  pdfQueueEvents
} from "../config/bullmq-connection.js"

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
    const pdf = await htmlToPdf.generatePdf({ content: html }, renderOptions)
    return {
      id: invoiceData.id,
      customerEmail: invoiceData.customerEmail,
      pdf: { data: pdf.toString("base64"), encoding: "base64" },
      html
    }
  },
  REDIS_CONNECTION_OPTION
)

// Configure related BullMQ jobs
pdfQueueEvents.on("completed", async (job) => {
  const { id, customerEmail, pdf, html } = job.returnvalue
  const mailContent = {
    from: myEmail,
    to: customerEmail,
    subject: `(Test email. No opt-out required) Invoice #${id} from Brick and Willow Design`,
    "h:Reply-To": myEmail,
    html,
    text: "See your invoice in attachment.",
    attachments: [
      {
        cid: `invoice_${id}.pdf`,
        content: pdf.data,
        encoding: pdf.encoding
      }
    ]
  }
  MailSendQueue.add(
    "SendMail",
    { id, mailContent },
    {
      attempts: 5,
      backoff: {
        type: "exponential",
        delay: 500
      }
    }
  )
})
