// File         : post.js
// Project      : Backend Programming Assignment
// Programmer   : Luka Horiuchi
// First Version: 03/25/2023
// Description  : This file contains the API for post module.
// It includes listing of all post, get post's replies, create a new post, update post, and delete post.


const express = require("express");
const router = express.Router();
const Post = require("../models/post");
const User = require("../models/user");

// GET all posts
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET single post
router.get("/:id", getPost, (req, res) => {
  res.json(res.post);
});

// GET post with related replies
router.get("/:id/replies", getPost, async (req, res) => {
  try {
    const replies = await Post.find({ targetPost: req.params.id }).populate(
      "userId"
    );
    res.json({ post: res.post, replies: replies });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CREATE a post
router.post("/create", async (req, res) => {
  const post = new Post({
    content: req.body.content,
    userId: req.body.userId,
    targetPost: req.body.targetPost, //used upon creating a reply
  });
  try {
    const newPost = await post.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// UPDATE a post
router.patch("/:id", getPost, async (req, res) => {
  if (req.body.content != null) {
    res.post.content = req.body.content;
  }

  if (req.body.targetPost != null) {
    res.post.targetPost = req.body.targetPost;
  }

  try {
    const updatedPost = await res.post.save();
    res.json(updatedPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE a post
router.delete("/:id", getPost, async (req, res) => {
  try {
    await res.post.deleteOne();
    res.json({ message: "Post deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Function   : getPost
// Description: This function is a middleware to get all the posts from the db and store in the responce object.
// Parameters : req = request from the user
//              res = response
//              next = a function to pass control to the next middleware function in the request-response cycle.
// Returns    : none
async function getPost(req, res, next) {
  let post;
  try {
    post = await Post.findById(req.params.id);
    if (post == null) {
      return res.status(404).json({ message: "Cannot find any posts" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }

  res.post = post;
  next();
}

module.exports = router;
