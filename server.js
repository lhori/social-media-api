// File         : server.js
// Project      : Backend Programming Assignment
// Programmer   : Luka Horiuchi
// First Version: 03/25/2023
// Description  : This file contains the all the setting for the server to run including the mongodb connection, router setting.

require("dotenv").config(); //loading the configuration file
const express = require("express");
const app = express();

const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE_URL, {
  dbName: "social-media",
  useNewUrlParser: true,
});

const db = mongoose.connection;
db.on("error", (error) => console.log(error));
db.once("open", () => console.log("Connected to Database"));

app.use(express.json());

const userRouter = require("./routes/user");
app.use("/user", userRouter);

const postRouter = require("./routes/post");
app.use("/post", postRouter);

const likeRouter = require("./routes/like");
app.use("/like", likeRouter);

app.listen(3000, () => console.log("Server started"));

module.exports = app;