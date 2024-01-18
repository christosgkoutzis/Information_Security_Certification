// Requires mongoose dependency
const mongoose = require('mongoose');
// Connects to the DB through .env connection string
const db = mongoose.connect(process.env.DB);
module.exports = db;