// Imports assertion libraries (provided code)
const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);
// Suite of 5 unit tests using Chai assertion library
suite('Functional Tests', function() {
  suite("5 functional get request tests", function () {
    test("Viewing one stock: GET request to /api/stock-prices/", function (done) {
      chai
        // Opens server.js for incoming requests
        .request(server)
        // Sends a GET request to the parameter's route
        .get("/api/stock-prices/")
        // Sets content-type HTTP header for the request
        .set("content-type", "application/json")
        // Sets query parameters for an HTTP request (attached to the URL)
        .query({ stock: "AAPL" })
        // Finalizes and executes the HTTP request expecting the behavior below
        .end(function (err, res) {
          // Expects the first parameter to be equal with the second
          assert.equal(res.status, 200);
          assert.equal(res.body.stockData.stock, "AAPL");
          assert.exists(res.body.stockData.price, "AAPL has a price");
          done();
        });
    });
    test("Viewing one stock and liking it: GET request to /api/stock-prices/", function (done) {
      chai
        .request(server)
        .get("/api/stock-prices/")
        .set("content-type", "application/json")
        .query({ stock: "NFLX", like: true })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.stockData.stock, "NFLX");
          assert.equal(res.body.stockData.likes, 1);
          assert.exists(res.body.stockData.price, "NFLX has a price");
          done();
        });
    });
    test("Viewing the same stock and liking it again: GET request to /api/stock-prices/", function (done) {
      chai
        .request(server)
        .get("/api/stock-prices/")
        .set("content-type", "application/json")
        .query({ stock: "NFLX", like: true })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.stockData.stock, "NFLX");
          assert.equal(res.body.stockData.likes, 1);
          assert.exists(res.body.stockData.price, "NFLX has a price");
          done();
        });
    });
    test("Viewing two stocks: GET request to /api/stock-prices/", function (done) {
      chai
        .request(server)
        .get("/api/stock-prices/")
        .set("content-type", "application/json")
        .query({ stock: ["GOOG", "MSFT"] })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.stockData[0].stock, "GOOG");
          assert.equal(res.body.stockData[1].stock, "MSFT");
          assert.exists(res.body.stockData[0].price, "GOOG has a price");
          assert.exists(res.body.stockData[1].price, "MSFT has a price");
          done();
        });
    });
    test("Viewing two stocks and liking them: GET request to /api/stock-prices/", function (done) {
      chai
        .request(server)
        .get("/api/stock-prices/")
        .set("content-type", "application/json")
        .query({ stock: ["GOOG", "MSFT"], like: true })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.stockData[0].stock, "GOOG");
          assert.equal(res.body.stockData[1].stock, "MSFT");
          assert.exists(res.body.stockData[0].price, "GOOG has a price");
          assert.exists(res.body.stockData[1].price, "MSFT has a price");
          assert.exists(res.body.stockData[0].rel_likes, "has rel_likes");
          assert.exists(res.body.stockData[1].rel_likes, "has rel_likes");
          done();
        });
    });
  });
});
