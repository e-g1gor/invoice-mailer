import createError from "http-errors"
import express, { json, urlencoded } from "express"
import cookieParser from "cookie-parser"
import logger from "morgan"
import cors from "cors"

import invoiceRouter from "./api/routes/invoice.js"

const app = express()

console.log("Server started.")

if (process.env.NODE_ENV === "development") {
  app.use(cors())
  console.log("CORS enabled for debug purposes.")
}

app.use(logger("dev"))
app.use(json())
app.use(urlencoded({ extended: false }))
app.use(cookieParser())

// Routes
app.use("/invoice", invoiceRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get("env") === "development" ? err : {}

  // send error data
  res.status(err.status || 500)
  res.send({ error: err })
})

export default app
