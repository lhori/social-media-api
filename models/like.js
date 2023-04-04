// File         : like.js
// Project      : Backend Programming Assignment
// Programmer   : Luka Horiuchi
// First Version: 03/25/2023
// Description  : This file contains the model for Like module.

const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  targetPost: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Posts",
    required: true,
  },
});

module.exports = mongoose.model("Like", likeSchema);
