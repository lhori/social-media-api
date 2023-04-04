// File         : like.js
// Project      : Backend Programming Assignment
// Programmer   : Luka Horiuchi
// First Version: 03/25/2023
// Description  : This file contains the API for Like module.
// It will test listing of all likes, like of the certain post, creating new likes, and deleting likes.

const express = require("express");
const router = express.Router();
const Like = require("../models/like");

// GET all likes
router.get("/", async (req, res) => {
  try {
    const like = await Like.find();
    res.json(like);
  } catch (error) {
    res.status(500).json({ message: err.message });
  }
});

// GET all likes of a post
router.get("/:id/likes", async (req, res) => {
  try {
    const likes = await Like.find({ targetPost: req.params.id });
    res.json(likes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST like to a post
router.post("/:id", async (req, res) => {
  const like = new Like({
    userId: req.body.userId,
    targetPost: req.params.id,
  });

  try {
    const newLike = await like.save();
    res.status(201).json(newLike);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE(unlike) like from a post
router.delete("/:id", async (req, res) => {
  try {
    await Like.deleteOne({
      userId: req.body.userId,
      targetPost: req.params.id,
    });
    res.json({ message: "Post unliked" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
