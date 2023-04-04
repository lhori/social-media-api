// File         : post.js
// Project      : Backend Programming Assignment
// Programmer   : Luka Horiuchi
// First Version: 03/25/2023
// Description  : This file contains the API test for post module.
// It includes testing for listing of all post, get one post, get post's replies, create a new post, update post, delete post, and create reply post to certain post.

const mongoose = require("mongoose");
const Post = require("../models/post");
const User = require("../models/user");

const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../server");
const should = chai.should();

chai.use(chaiHttp);

describe("Posts API", () => {
  let testPost;
  let postTestUser;
  let replyPost1;
  let replyPost2;

  //before test, create data needed.
  beforeEach(async () => {
    // Create test user
    postTestUser = new User({
      username: "postTester",
    });
    await postTestUser.save();

    // Create test post
    testPost = new Post({
      content: "This is a parent test post",
      userId: postTestUser._id,
    });
    await testPost.save();

    // Create reply post
    replyPost1 = new Post({
      content: "This is a reply to the parent post #1",
      userId: postTestUser._id,
      targetPost: testPost._id,
    });
    await replyPost1.save();

    replyPost2 = new Post({
      content: "This is a reply to the parent post #2",
      userId: postTestUser._id,
      targetPost: testPost._id,
    });
    await replyPost2.save();
  });

  afterEach(async () => {
    // delete all the data from db
    await Post.deleteMany();
    await User.deleteMany();
  });

  /* Test GET route */
  describe("GET all /posts", () => {
    it("should return all posts", (done) => {
      chai
        .request(server)
        .get("/post")
        .end((error, res) => {
          res.should.have.status(200);
          res.body.should.be.an("array");
          res.body.length.should.be.eql(3); //3 including the reply posts
          res.body[0].content.should.be.eql(testPost.content);
          res.body[0].userId.should.be.eql(testPost.userId.toString());
          done();
        });
    });
  });

  /* Test GET route by ID (single post) */
  describe("GET /post/:id", () => {
    it("should return a single post", (done) => {
      chai
        .request(server)
        .get(`/post/${testPost._id}`)
        .end((error, res) => {
          res.should.have.status(200);
          res.body.should.be.an("object");
          res.body.content.should.be.eql(testPost.content);
          res.body.userId.should.be.eql(testPost.userId.toString());
          done();
        });
    });
  });

  /* Test POST to create new post */
  describe("POST /post/create", () => {
    it("should create a new post", (done) => {
      const newPost = {
        content: "This is a new post",
        userId: postTestUser._id.toString(),
      };
      chai
        .request(server)
        .post("/post/create")
        .send(newPost)
        .end((error, res) => {
          res.should.have.status(201);
          res.body.should.be.an("object");
          res.body.content.should.be.eql(newPost.content);
          res.body.userId.should.be.eql(newPost.userId.toString());
          done();
        });
    });
  });

  /* Test PATCH to update post */
  describe("PATCH /posts/:id", () => {
    it("should update a post", (done) => {
      const updatedPost = {
        content: "This post has been updated",
        targetPost: testPost._id,
      };
      chai
        .request(server)
        .patch(`/post/${testPost._id}`)
        .send(updatedPost)
        .end((error, res) => {
          res.should.have.status(200);
          res.body.should.be.an("object");
          res.body.content.should.be.eql(updatedPost.content);
          if (res.body.targetPost != null) {
            res.body.targetPost.should.be.eql(
              updatedPost.targetPost.toString()
            );
          }
          res.body._id.should.be.eql(testPost._id.toString());
          done();
        });
    });
  });

  /* Test DELETE to delete post */
  describe("DELETE /posts/:id", () => {
    it("should delete a post", (done) => {
      chai
        .request(server)
        .delete(`/post/${testPost._id}`)
        .end((error, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("message").eq("Post deleted");
          done();
        });
    });
  });

  /* Test GET route to get all the replies */
  describe("GET /:id/replies", () => {
    it("should get a post with replies", (done) => {
      chai
        .request(server)
        .get(`/post/${testPost._id}/replies`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property("post").to.be.an("object");
          res.body.post.should.have
            .property("_id")
            .eql(testPost._id.toString());
          res.body.post.should.have.property("content").eql(testPost.content);
          res.body.post.should.have
            .property("userId")
            .eql(testPost.userId.toString());

          res.body.should.have.property("replies").to.be.an("array");
          res.body.replies.length.should.be.eql(2);

          res.body.replies[0].should.have
            .property("_id")
            .eql(replyPost1._id.toString());
          res.body.replies[0].should.have
            .property("content")
            .eql(replyPost1.content);
          res.body.replies[0].should.have
            .property("targetPost")
            .eql(replyPost1.targetPost.toString());
          res.body.replies[0].should.have.property("userId").to.be.an("object");
          res.body.replies[0].userId.should.have
            .property("_id")
            .eql(replyPost1.userId.toString());

          res.body.replies[1].should.have
            .property("_id")
            .eql(replyPost2._id.toString());
          res.body.replies[1].should.have
            .property("content")
            .eql(replyPost2.content);
          res.body.replies[1].should.have
            .property("targetPost")
            .eql(replyPost2.targetPost.toString());
          res.body.replies[1].should.have.property("userId").to.be.an("object");
          res.body.replies[1].userId.should.have
            .property("_id")
            .eql(replyPost2.userId.toString());

          done();
        });
    });
  });

  /* Test POST route to create a reply to a post */
  describe("POST /post/create", () => {
    it("should create a reply post", (done) => {
      const replyPost = {
        content: "This is a reply post test",
        userId: postTestUser._id,
        targetPost: testPost._id,
      };
      chai
        .request(server)
        .post("/post/create")
        .send(replyPost)
        .end((error, res) => {
          res.should.have.status(201);
          res.body.should.be.an("object");
          res.body.content.should.be.eql(replyPost.content);
          res.body.userId.should.be.eql(replyPost.userId.toString());
          res.body.targetPost.should.be.eql(replyPost.targetPost.toString());
          done();
        });
    });
  });
});
