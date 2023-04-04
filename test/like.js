// File         : like.js
// Project      : Backend Programming Assignment
// Programmer   : Luka Horiuchi
// First Version: 03/25/2023
// Description  : This file contains the API testing for Like module.
// It will test listing of all likes, like of the certain post, creating new likes, and deleting likes.

const mongoose = require("mongoose");
const Post = require("../models/post");
const User = require("../models/user");
const Like = require("../models/like");

const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../server");
const should = chai.should();

chai.use(chaiHttp);

describe("Like API", () => {
  let testPost;
  let testUser;
  let testLike1;

  //each test will be creating the test data
  beforeEach(async () => {
    // Create test user
    testUser = new User({
      username: "testUser",
    });
    await testUser.save();

    // Create test post
    testPost = new Post({
      content: "This is a test post",
      userId: testUser._id,
    });
    await testPost.save();

    // Create test likes
    testLike1 = new Like({
      userId: testUser._id,
      targetPost: testPost._id,
    });
    await testLike1.save();

    testLike2 = new Like({
      userId: testUser._id,
      targetPost: testPost._id,
    });
    await testLike2.save();
  });

  //after test, it will delete test data from DB
  afterEach(async () => {
    // delete all the data from db
    await Like.deleteMany();
    await Post.deleteMany();
    await User.deleteMany();
  });

  /* Test GET route to get all likes */
  describe("GET /like", () => {
    it("should get all likes", (done) => {
      chai
        .request(server)
        .get("/like")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an("array");
          res.body.length.should.be.eql(2);
          done();
        });
    });
  });

  /* Test GET route that will get all the likes of the post */
  describe("GET like/:id/likes", () => {
    it("should get all likes of a post", (done) => {
      chai
        .request(server)
        .get(`/like/${testPost._id}/likes`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an("array");
          res.body.length.should.be.eql(2);
          done();
        });
    });
  });

  /* Test POST to create new like */
  describe("POST /like/:id", () => {
    it("should like a post", (done) => {
      chai
        .request(server)
        .post(`/like/${testPost._id}`)
        .send({ userId: testUser._id })
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.an("object");
          res.body.should.have.property("userId").eql(testUser._id.toString());
          res.body.should.have
            .property("targetPost")
            .eql(testPost._id.toString());
          done();
        });
    });
  });

  /* Test DELETE to delete like */
  describe("DELETE /like/:id", () => {
    it("should unlike a post", (done) => {
      chai
        .request(server)
        .delete(`/like/${testPost._id}`)
        .send({ userId: testUser._id })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an("object");
          res.body.should.have.property("message").eql("Post unliked");
          done();
        });
    });
  });
});
