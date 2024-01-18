// Requires assertion libraries
const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);
// Suite of 10 functional unit tests
suite('Functional Tests', function() {
  suite("10 functional tests", function () {

    test("Creating a new thread: POST request to /api/threads/{board}", function (done) {
      // Starts application
      chai.request(server)
        // Sends POST HTTP post request to the requested route
        .post("/api/threads/general")
        // Sets content-type HTTP header to application/json
        .set("content-type", "application/json")
        // Declares test's user inputs
        .send({ text: "test text", delete_password: "test" })
        // Declares the HTTP responses for the test to be successful
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.text, "test text");
          assert.equal(res.body.delete_password, "test");
          assert.equal(res.body.reported, false);
          testThread_id = res.body._id;
          done();
        });
    });

    test("Viewing the 10 most recent threads with 3 replies each: GET request to /api/threads/{board}", function (done) {
      chai.request(server)
        // Sends GET HTTP request to the requested route
        .get("/api/threads/general")
        // Declares expected HTTP responses
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.exists(res.body[0], "There is a thread");
          assert.equal(res.body[0].text, "test text");
          done();
        });
    });

    test("Deleting a thread with the incorrect password: DELETE request to /api/threads/{board} with an invalid delete_password", function (done) {
      chai.request(server)
        // Sends DELETE HTTP request to the requested route
        .delete("/api/threads/general")
        // Sets content type HTTP header
        .set("content-type", "application/json")
        // Declares test's user inputs
        .send({ thread_id: testThread_id, delete_password: "incorrect" })
        // Declares expected HTTP responses
        .end(function (err, res) {
          assert.equal(res.status, 401);
          assert.equal(res.text, "incorrect password");
          done();
        });
    });

    test("Reporting a thread: PUT request to /api/threads/{board}", function (done) {
      console.log("testThread_id", testThread_id);
      chai.request(server)
        // Sends PUT HTTP request to the requested route
        .put("/api/threads/general")
        // Sets content type HTTP header
        .set("content-type", "application/json")
        // Sets test's user inputs
        .send({ report_id: testThread_id })
        // Declares expected HTTP responses
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, "Thread reported successfully.");
          done();
        });
    });

    test("Creating a new reply: POST request to /api/replies/{board}", function (done) {
      chai.request(server)
        // Sends POST HTTP request to the requested route
        .post("/api/replies/general")
        // Sets content-type HTTP header
        .set("content-type", "application/json")
        // Sets test's user inputs
        .send({
          thread_id: testThread_id,
          text: "test reply",
          delete_password: "testreply",
        })
        // Declares expected HTTP responses
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.replies[0].text, "test reply");
          testReply_id = res.body.replies[0]._id;
          console.log(res.body)
          done();
        });
    });

    test("Viewing a single thread with all replies: GET request to /api/replies/{board}", function (done) {
      chai.request(server)
        // Sends GET HTTP request to the requested route
        .get("/api/replies/general")
        // Sets content-type HTTP header
        .set("content-type", "application/json")
        // Gets the requested thread with its replies
        .query({
          thread_id: testThread_id,
        })
        // Declares expected HTTP responses
        .end(function (err, res) {
          assert.equal(res.status, 200);
          console.log("test get whole thread body", res.body);
          assert.equal(res.body._id, testThread_id);
          assert.equal(res.body.text, "test text");
          assert.equal(res.body.replies[0].text, "test reply");
          done();
        });
    });

    test("Deleting a reply with the incorrect password: DELETE request to /api/replies/{board} with an invalid delete_password", function (done) {
      chai.request(server)
        // Sends DELETE HTTP request to the requested route
        .delete("/api/replies/general")
        // Sets content-type HTTP header
        .set("content-type", "application/json")
        // Declares test's user inputs
        .send({
          thread_id: testThread_id,
          reply_id: testReply_id,
          delete_password: "Incorrect",
        })
        // Declares expected HTTP responses
        .end(function (err, res) {
          assert.equal(res.status, 401);
          assert.equal(res.text, "incorrect password");
          done();
        });
    });

    test("Reporting a reply: PUT request to /api/replies/{board}", function (done) {
      chai.request(server)
        // Sends PUT HTTP request to the expected route
        .put("/api/replies/general")
        // Sets content-type HTTP header
        .set("content-type", "application/json")
        // Declares test's user inputs
        .send({
          thread_id: testThread_id,
          reply_id: testReply_id,
        })
        // Declares expected HTTP responses
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, "Success");
          done();
        });
    });

    test("Deleting a reply with the correct password: DELETE request to /api/replies/{board} with a valid delete_password", function (done) {
      chai.request(server)
        // Sends DELETE HTTP request to the requested route
        .delete("/api/replies/general")
        // Sets content-type HTTP header
        .set("content-type", "application/json")
        // Declares test's user inputs
        .send({
          thread_id: testThread_id,
          reply_id: testReply_id,
          delete_password: "testreply",
        })
        // Declares expected HTTP responses
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, "success");
          done();
        });
    });

    test("Deleting a thread with the correct password: DELETE request to /api/threads/{board} with a valid delete_password", function (done) {
      chai.request(server)
        // Sends DELETE HTTP request to the requested route
        .delete("/api/threads/general")
        // Sets content-type HTTP header
        .set("content-type", "application/json")
        // Sets test's user inputs
        .send({ thread_id: testThread_id, delete_password: "test" })
        // Declares expected HTTP responses
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, "success");
          done();
        });
    });
  });
});
