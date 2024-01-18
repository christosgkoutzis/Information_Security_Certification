'use strict';

// Imports DB models
const BoardModel = require("../models").Board;
const ThreadModel = require("../models").Thread;
const ReplyModel = require("../models").Reply;

module.exports = async function (app) {
  // Threads route
  app.route('/api/threads/:board')
  // POST HTTP request (ability to post new threads to the DB)
  .post(async (req, res) => {
    try {
      // Gets text and delete_password from user's inputs
      const { text, delete_password } = req.body;
      // Gets board of the thread from the body if it exists
      let board = req.body.board;
      // If the board doesn't exist, gets the board from :board parameter of the route
      if (!board) {
        board = req.params.board;
      }
      console.log("post", req.body);
      // Creates a new ThreadModel with the information above
      const newThread = new ThreadModel({
        text: text,
        delete_password: delete_password,
        replies: [],
      });
      console.log("newThread", newThread);
      // Checks if we already have the declared above board in the DB
      const Boarddata = await BoardModel.findOne({ name: board }); 
      //  If there is no such board, it creates a new board model in the DB
      if (!Boarddata) {
        const newBoard = new BoardModel({
          name: board,
          threads: [newThread],
        });
        console.log("newBoard", newBoard);
        // Appends the new board model in the db
        await newBoard.save();
        res.json(newThread);
      }
      else {
        // If findOne finds a board in the DB, the thread gets appended to it
        Boarddata.threads.push(newThread);
        await Boarddata.save();
        res.json(newThread);
      }
    }
    // Checks if there is an error saving board data
    catch (err) {
      console.log(err); 
      res.status(500).send("There was an error saving in post");
    }
  })
  // GET HTTP request (ability to retrieve boards/threads from the DB)
  .get(async (req, res) => {
    // Retrieves the board from URL's parameters
    const board = req.params.board;
    // Searches the DB for the board
    const data = await BoardModel.findOne({ name: board }); 
    if (!data) {
      console.log("No board with this name");
      res.json({ error: "No board with this name" });
    } 
    else {
      console.log("data", data);
      // Uses map function to determnine replycount and return the result to threads variable
      const threads = data.threads.map((thread) => {
        const {_id, text, created_on, bumped_on, reported, delete_password, replies,} = thread;
        return {_id, text, created_on, bumped_on, reported, delete_password, replies, replycount: thread.replies.length,};
      });
      res.json(threads);
    }
  })
  // PUT HTTP request (update a record in the DB)
  .put (async (req, res) => {
    console.log("put", req.body);
    // Stores in variables the thread's id from the body and the board from the parameters
    const { report_id } = req.body;
    const board = req.params.board;
    // Checks if the board can be found in the DB
      const boardData = await BoardModel.findOne({ name: board }); 
      if (!boardData) {
        res.json("error", "Board not found");
      }
      // If the board is found, it updates its reported thread on the respective DB record 
      else {
        const date = new Date();
        let reportedThread = boardData.threads.id(report_id);
        reportedThread.reported = true;
        reportedThread.bumped_on = date;
        boardData.save()
        .then(updatedData => {
          res.send("Thread reported successfully.");
        })
        .catch(err => {
          // Handle the error
          console.error(err);
          res.send("Error saving data.");
        });
      }
    })
  // DELETE HTTP request
  .delete(async (req, res) => {
    try {
      console.log("delete", req.body);
      // Gets thread id and delete_password user's input from the body
      const { thread_id, delete_password } = req.body;
      const board = req.params.board;
      // Checks if the board is in the DB
      const boardData = await BoardModel.findOne({ name: board });

      if (!boardData) {
        res.status(404).json({ error: "Board not found" });
      } else {
        let threadToDelete = boardData.threads.id(thread_id);

        // Checks if the delete password is correct to delete the thread
        if (threadToDelete.delete_password === delete_password) {
          boardData.threads.pull(threadToDelete);
          await boardData.save();
          res.send("Thread deleted successfully.");
        } else {
          res.status(401).send('Incorrect Password.');
        }
      }
    } catch (err) {
      // Handle the error
      console.error(err);
      res.status(500).send("Error deleting.");
    }
  });


  app.route('/api/replies/:board')
  // POST HTTP request
  .post(async (req, res) => {
    try {
      console.log("thread", req.body);
      // Stores in an object thread's info from the body
      const { thread_id, text, delete_password } = req.body;
      // Stores in a variable board's name from URL parameters
      const board = req.params.board;
      // Creates new DB model for the reply
      const newReply = new ReplyModel({
        text: text,
        delete_password: delete_password,
      });
        // Checks if the board is in the DB
      const boardData = await BoardModel.findOne({ name: board });
      if (!boardData) {
        res.status(404).json({ error: "Board not found" });
      } 
      else {
        const date = new Date();
        const threadToAddReply = boardData.threads.id(thread_id);
        if (threadToAddReply) {
          threadToAddReply.bumped_on = date;
          threadToAddReply.replies.push(newReply);
          await boardData.save();
          res.json(threadToAddReply);
        } else {
          res.status(404).json({ error: "Thread not found" });
        }
      }
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  })  
  // GET HTTP request
  .get(async (req, res) => {
    // Gets board name from URL's parameters
    const board = req.params.board;
    // Checks if the board is in the DB
    const data = await BoardModel.findOne({ name: board }); 
    if (!data) {
      console.log("No board with this name");
      res.json({ error: "No board with this name" });
    }
    // If the board is in the DB, it gets the thread through id function and returns it as json
    else {
      console.log("data", data);
      const thread = data.threads.id(req.query.thread_id);
      res.json(thread);
    }
  })
  // PUT HTTP request (report a reply)
  .put(async (req, res) => {
    try {
      // Declares information about the reply
      const { thread_id, reply_id } = req.body;
      const board = req.params.board;
      // Checks if the board is in the DB
      const data = await BoardModel.findOne({ name: board });

      if (!data) {
        res.status(404).json({ error: "No board with this name" });
      } else {
        console.log("data", data);
        let thread = data.threads.id(thread_id);
        let reply = thread.replies.id(reply_id);
        reply.reported = true;
        reply.bumped_on = new Date();

        await data.save();
        res.send("Success");
      }
    } catch (err) {
      console.log("There was an error.", err);
      res.status(500).send("There was an error.");
    }
  })
  // DELETE HTTP request (deletes a  reply)
  .delete(async (req, res) => {
    try {
      const { thread_id, reply_id, delete_password } = req.body;
      console.log("delete reply body", req.body);
      const board = req.params.board;
      const data = await BoardModel.findOne({ name: board });

      if (!data) {
        console.log("No board with this name");
        res.status(404).json({ error: "No board with this name" });
      } else {
        console.log("data", data);
        let thread = data.threads.id(thread_id);
        let reply = thread.replies.id(reply_id);

        // Checks if delete_password is correct
        if (reply.delete_password === delete_password) {
          thread.replies.pull(reply);
          await data.save();
          res.send("Reply deleted.");
        } else {
          res.status(401).send("Incorrect Password");
        }
      }
    } catch (err) {
      // Handle the error
      console.error(err);
      res.status(500).send("There was an error.");
    }
  });
};