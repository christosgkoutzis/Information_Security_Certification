// Requires mongoose and creates schema for the DB
const mongoose = require("mongoose");
const { Schema } = mongoose;
// Default date value is date() which returns current date in a string
const date = new Date();

const ReplySchema = new Schema({
  text: { type: String },
  delete_password: { type: String },
  created_on: { type: Date, default: date },
  bumped_on: { type: Date, default: date },
  reported: { type: Boolean, default: false },
});
const Reply = mongoose.model("Reply", ReplySchema);

const ThreadSchema = new Schema({
  text: { type: String },
  delete_password: { type: String },
  reported: { type: Boolean, default: false },
  created_on: { type: Date, default: date },
  bumped_on: { type: Date, default: date },
  // Nests a ReplySchema inside the ThreadSchema for thread's replies
  replies: { type: [ReplySchema] },
});
const Thread = mongoose.model("Thread", ThreadSchema);

const BoardSchema = new Schema({
  name: { type: String },
  // Nests board's threads in a ThreadSchema
  threads: { type: [ThreadSchema] },
});
const Board = mongoose.model("Board", BoardSchema);

// Exports database models
exports.Board = Board;
exports.Thread = Thread;
exports.Reply = Reply;