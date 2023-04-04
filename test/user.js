// File         : user.js
// Project      : Backend Programming Assignment
// Programmer   : Luka Horiuchi
// First Version: 03/25/2023
// Description  : This file contains the API test for post module.
// It will include test for listing of all users, getting certain user, creating new user, updating user information, and deleting user.

process.env.NODE_ENV = "test";

const mongoose = require("mongoose");
const User = require("../models/user");

const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../server");
const should = chai.should();

chai.use(chaiHttp);

describe("User API", () => {
  //delete all the user from the DB
  beforeEach(async () => {
    await User.deleteMany({});
  });
  
  /* Test GET route */
  describe("GET all users", () => {
    it("It should GET all the users", (done) => {
      chai
        .request(server)
        .get("/user")
        .end((error, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          res.body.length.should.be.eql(0);
          done();
        });
    });
  });

  /* Test GET route by ID */
  describe("GET user by ID", () => {
    it("It should GET a user by ID", async () => {
      const user = new User({
        username: "testuser",
      });
      await user.save();

      chai
        .request(server)
        .get("/user/" + user.id)
        .end((error, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("username").eq("testuser");
          res.body.should.have.property("_id").eq(user._id.toString());
          res.body.should.have.property("createdAt");
        });
    });
  });

  /* Test POST route */
  describe("POST create user", () => {
    it("It should create a new user", (done) => {
      const user = {
        username: "testuser",
      };
      chai
        .request(server)
        .post("/user/create")
        .send(user)
        .end((error, res) => {
          res.should.have.status(201);
          res.body.should.be.a("object");
          res.body.should.have.property("username").eq("testuser");
          res.body.should.have.property("createdAt");
          done();
        });
    });
  });

  /* Test PATCH route */
  describe("PATCH update user", () => {
    it("It should update a user", async () => {
      const user = new User({
        username: "testuser",
      });
      await user.save();

      const updatedUser = {
        username: "newusername",
      };

      chai
        .request(server)
        .patch("/user/" + user.id)
        .send(updatedUser)
        .end((error, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("username").eq("newusername");
          res.body.should.have.property("_id").eq(user._id.toString());
          res.body.should.have.property("createdAt");
        });
    });
  });

  /* Test DELETE route */
  describe("DELETE user", () => {
    it("It should delete a user", () => {
      const user = new User({
        username: "testuser",
      });
      user.save((error, user) => {
        chai
          .request(server)
          .delete("/user/" + user.id)
          .end((error, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("message").eq("Deleted User");
            done();
          });
      });
    });
  });
});
