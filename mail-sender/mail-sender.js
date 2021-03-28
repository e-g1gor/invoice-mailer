"use strict"

import { Worker, QueueEvents } from "bullmq"
import nodemailer from "nodemailer"
import mg from "nodemailer-mailgun-transport"

import { mailgunAuth } from "../config/mail.js"
import {
  REDIS_CONNECTION_OPTION,
  MAIL_SEND_QUEUE_NAME
} from "../config/bullmq-connection.js"

// TODO: remove after worker separation to service
export const mailQueueEvents = new QueueEvents(
  MAIL_SEND_QUEUE_NAME,
  REDIS_CONNECTION_OPTION
)

// Configure mailer
const nodemailerMailgun = nodemailer.createTransport(mg(mailgunAuth))

// Mail sending worker
export const pdfRenderWorker = new Worker(
  MAIL_SEND_QUEUE_NAME,
  async (job) => {
    const { id, mailContent } = job.data
    const mailStatus = await nodemailerMailgun.sendMail(mailContent)
    return { id, mailStatus }
  },
  REDIS_CONNECTION_OPTION
)
