// Load required packages
var mongoose = require('mongoose');
var Question = require('../models/question');

var Votes = new mongoose.Schema({
	value: Number,
	choiceId: String
});

// Define our answer schema
var AnswerSchema = new mongoose.Schema({
	displayName: String,
	createdDate: Date,
	modifiedDate: Date,
	//userId: String,
	questionId: String,
	votes: [Votes]
});

//Custom validations
AnswerSchema.path('votes').validate(function (value, respond) {
	Question.findById(this.questionId, function(err, question) {
		//console.log((value.length <= question.maxSelections)&&(value.length >= question.minSelections));
		respond((value.length <= question.maxSelections)&&(value.length >= question.minSelections));
	});
	//return value.length > 0;
}, 'Total votes must fall between min and max');

// Export the Mongoose model
module.exports = mongoose.model('Answer', AnswerSchema);