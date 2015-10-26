// Load required packages
var mongoose = require('mongoose');
var _us = require("underscore");
mongoose.Error.messages.Number.min  = "{PATH} must be at least {MIN}";

var ChoiceSchema = new mongoose.Schema({
	description: {type: String, required: true},
	totalValue: {type: Number, min: 0}
});

// Define our question schema
var QuestionSchema = new mongoose.Schema({
	description: {type: String, required: true},
	minSelections: {type: Number, required: true, min: 1},
	maxSelections: {type: Number, required: true, min: 1},
	ranked: {type: Boolean},
	published: {type: Boolean},
	token: {type: String, required: true, unique: true},
	createdDate: {type: Date, required: true},
	modifiedDate: {type: Date},
	publishedDate: {type: Date},
	choices: [ChoiceSchema]
});

//Validations
QuestionSchema.path('minSelections').validate(function (value) {
	return value <= this.maxSelections;
}, 'Minimum selections must be less than maximum selections');
QuestionSchema.path('maxSelections').validate(function (value) {
	return value <= this.choices.length;
}, 'Maximum selections must be less than or equal to total choices');
QuestionSchema.path('ranked').validate(function (value) {
	return (value) ? this.maxSelections == this.minSelections : true;
}, 'Minimum and maximum selections must be equal for ranked questions');
QuestionSchema.path('choices').validate(function (value) {
	return value.length > 1;
}, 'Total number of choices must be greater than 2');
QuestionSchema.path('choices').validate(function (value) {
	return value.length == _us.uniq(_us.pluck(value, 'description')).length;
}, 'Two or more of your choices are the same, all choices must be unique');
ChoiceSchema.path('description').validate(function (value) {
	return value.length <= 300;
}, 'Choices must be 300 characters or less');


// Export the Mongoose model
module.exports = mongoose.model('Question', QuestionSchema);