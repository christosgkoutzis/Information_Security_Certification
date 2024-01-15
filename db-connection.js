// Requires mongoose library
const mongoose = require('mongoose');
// Imports connection string from .env file
const db = mongoose.connect(process.env.DB,{});

module.exports = db;