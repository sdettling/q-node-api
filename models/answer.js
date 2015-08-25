// Load required packages
var mongoose = require('mongoose');

var Votes = new mongoose.Schema({
  value: Number,
  choiceId: String
});

// Define our answer schema
var AnswerSchema = new mongoose.Schema({
  displayName: String,
  createdDate: Date,
  modifiedDate: Date,
  userId: String,
  questionId: String,
  votes: [Votes]
});

// Export the Mongoose model
module.exports = mongoose.model('Answer', AnswerSchema);