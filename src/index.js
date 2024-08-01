import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import 'dotenv/config'
const app = express();


app.use(bodyParser.json());

app.use(cookieParser());

const PORT = process.env.PORT || 4444;

app.use(express.json({limit:"1mb"}));
app.use(express.urlencoded({ extended: true ,limit:"1mb" }));

import Userouter from "../router/user.router.js";

app.use("/api/auth", Userouter);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    sucess: false,
    statusCode: statusCode,
    message: message,
  });
});

mongoose
  .connect("mongodb://127.0.0.1:27017/auth-2-prac")
  .then(() => {
    app.listen(PORT, () => {
      console.log("http://localhost:" + PORT);
    });
  })

  .catch((error) => {
    console.log(error);
  });
