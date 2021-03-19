const createError = require("http-errors");
const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const invoiceRouter = require("./api/routes/invoice");

const app = express();

console.log("Server started.");

if (process.env.NODE_ENV === "development") {
  const cors = require("cors");
  app.use(cors());
  console.log("CORS enabled for debug purposes.");
}

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Routes
app.use("/invoice", invoiceRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // send error data
  res.status(err.status || 500);
  res.send({ error: err });
});

module.exports = app;
