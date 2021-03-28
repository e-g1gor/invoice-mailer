'use strict'

import {Queue} from 'bullmq'

// BullMQ configuration
export const REDIS_CONNECTION_OPTION = {
  connection: {
    host: process.env.REDIS_HOST || "localhost"
  }
}

export const RENDER_PDF_QUEUE_NAME = "RenderPdf"
export const MAIL_SEND_QUEUE_NAME = "SendMail"

export const PdfRenderQueue = new Queue(RENDER_PDF_QUEUE_NAME, REDIS_CONNECTION_OPTION)
export const MailSendQueue = new Queue(MAIL_SEND_QUEUE_NAME, REDIS_CONNECTION_OPTION)
