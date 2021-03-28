'use strict'

// BullMQ configuration
export const REDIS_CONNECTION_OPTION = {
  connection: {
    host: process.env.REDIS_HOST || "localhost"
  }
}


export const RENDER_PDF_QUEUE_NAME = "RenderPdf"
