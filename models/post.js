// File         : post.js
// Project      : Backend Programming Assignment
// Programmer   : Luka Horiuchi
// First Version: 03/25/2023
// Description  : This file contains the model for post module.

const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  targetPost: {
    //used for creating a reply
    type: mongoose.Schema.Types.ObjectId,
    ref: "Posts",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Sets the createdAt parameter equal to the current time
postSchema.pre("save", (next) => {
  now = new Date();
  if (!this.createdAt) {
    this.createdAt = now;
  }
  next();
});

module.exports = mongoose.model("Post", postSchema);
