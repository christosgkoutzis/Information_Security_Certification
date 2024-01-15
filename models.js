const mongoose = require("mongoose");
const { Schema } = mongoose;
// StockSchema includes symbol which is a string and likes which is an array of strings that contains the IP address that liked
const StockSchema = new Schema({
  symbol: { type: String, required: true},
  likes: { type: [String], default: [] },
});
// Declares the database model
const Stock = mongoose.model("Stock", StockSchema);
// Exports the database model
exports.Stock = Stock;