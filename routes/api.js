// API Link: https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/<symbol>/quote
'use strict';

// Requires StockModel and node-fetch
const StockModel = require('../models').Stock;
const fetch = require('node-fetch');

// Creates new stock queries that will be added in the DB
async function createStock(stock, like, ip) {
  let likes_value = [];
  if (like == true){
    likes_value = [ip];
  }
  const newStock = new StockModel({
    symbol: stock,
    likes: likes_value,
  });
  // Saves the new query in the DB
  const savedNew = await newStock.save();
  return savedNew;
}

// Checks if there is a stock with the name (stock) in the DB
async function findStock(stock) {
  // .findOne checks for the most matched result (if any) and .exec executes a regular expression search 
  return await StockModel.findOne({ symbol: stock }).exec();
}

// Saves information fetched from the API in the database
async function saveStock(stock, like, ip) {
  let saved = {};
  // Checks if the stock is found through findstock function
  const foundStock = await findStock(stock);
  // If it wasn't found it creates a new stock model through createStock function
  if (!foundStock) {
    const createsaved = await createStock(stock, like, ip);
    saved = createsaved;
    return saved;
  }
  else {
    // If there is already a (stock) query in the DB, it checks if our IP is in the likes of it and if not, it adds it (push)
    if (like && foundStock.likes.indexOf(ip) === -1) {
      foundStock.likes.push(ip);
    }
    // Saves the new query in the DB
    saved = await foundStock.save();
    return saved;
  }
}

// Async function (because of fetch) that gets Information from a stock through the API
async function getStock(stock) {
  // Fetches response from API
  const response = await fetch(
    // Used backticks(`) instead of single quotes (') for the stock value to be replaced
    `https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${stock}/quote`
  );
  // Stores only desired information in an object as json
  const { symbol, latestPrice } = await response.json();
  // Returns information
  return { symbol, latestPrice };
}

module.exports = function (app) {
  // Converted function to async because getStock is async
  app.route('/api/stock-prices').get(async function (req, res){
      // req.query is an Express.js object containing a set of key-value pairs representing the query parameters of the URL. We store these info in a JS object
      const { stock, like } = req.query;

      // Checks if the user submitted the 2nd form by checking if the stock value is an array
      if (Array.isArray(stock)) {
        console.log("stocks", stock)
        // Fetches info about the 2 stocks from the API through getStock function
        const { symbol: symbol1, latestPrice: latestPrice1 } = await getStock(stock[0]);
        const { symbol: symbol2, latestPrice: latestPrice2 } = await getStock(stock[1]);
        // Saves the 2 stocks in the DB
        const firststock = await saveStock(stock[0], like, req.ip);
        const secondstock = await saveStock(stock[1], like, req.ip);
        // Creates an array that will store the stockdata to be displayed
        let stockData = [];
        // Checks if the first stock symbol exists
        if (!symbol1) {
          stockData.push({
            rel_likes: firststock.likes.length - secondstock.likes.length,
          });
        }
        else {
          stockData.push({
            stock: symbol1,
            price: latestPrice1,
            rel_likes: firststock.likes.length - secondstock.likes.length,
          });
        }
        // Checks if second symbol exists
        if (!symbol2) {
          stockData.push({
            rel_likes: secondstock.likes.length - firststock.likes.length,
          });
        }
        else {
          stockData.push({
            stock: symbol2,
            price: latestPrice2,
            rel_likes: secondstock.likes.length - firststock.likes.length,
          });
        }
        res.json({
          stockData,
        });
        return;
      }
      // User submitted the first form
      const { symbol, latestPrice } = await getStock(stock);
      // If there is no such symbol name the only stockData will be the like 
      if (!symbol){
        res.json({ stockData: { likes: like ? 1 : 0 }});
        return;
      }

      // Passes data that saveStock function will use 
      const oneStockData = await saveStock(symbol, like, req.ip);
      console.log('One Stock Data', oneStockData);

      // JSON data that the functions above need from the API as well as the unit tests to run
      res.json({
        stockData: {
          stock: symbol,
          price: latestPrice,
          likes: oneStockData.likes.length,
        },
      });  
  });    
};
