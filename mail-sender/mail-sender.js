"use strict"

import { Worker, QueueEvents } from "bullmq"
import nodemailer from "nodemailer"
import mg from "nodemailer-mailgun-transport"

import { mailgunAuth } from "../config/mail.js"
import {
  REDIS_CONNECTION_OPTION,
  MAIL_SEND_QUEUE_NAME
} from "../config/bullmq-connection.js"


// Configure mailer
const nodemailerMailgun = nodemailer.createTransport(mg(mailgunAuth))

// Mail sending worker
const worker = new Worker(
  MAIL_SEND_QUEUE_NAME,
  async (job) => {
    console.log("Mailing in progress")
    const { id, mailContent } = job.data
    const mailStatus = await nodemailerMailgun.sendMail(mailContent)
    return { id, mailStatus }
  },
  REDIS_CONNECTION_OPTION
)

worker.on("completed", (job) => {
  console.log("Mail sending completed.")
  console.log(job.returnvalue)
})

worker.on("failed", (job) => {
  console.log("Mail sending failed.")
  console.log(job.failedReason)
})
