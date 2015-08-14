// Load required packages
var mongoose = require('mongoose');

var ChoiceSchema = new mongoose.Schema({
	description: {type: String, required: true},
	totalVotes: {type: Number, min: 0}
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
	//userId: {type: String, required: true},
	choices: [ChoiceSchema]
});

//Custom validations
QuestionSchema.path('minSelections').validate(function (value) {
	return value <= this.maxSelections;
}, 'Path `{PATH}` is greater than Path `maxSelections`');
QuestionSchema.path('maxSelections').validate(function (value) {
	return value <= this.choices.length;
}, 'Path `{PATH}` is greater than total choices');
QuestionSchema.path('ranked').validate(function (value) {
	return (value) ? this.maxSelections == this.minSelections : true;
}, 'Path `minSelections` must equal `maxSelections` when ranked is true');
QuestionSchema.path('choices').validate(function (value) {
	return value.length > 1;
}, 'Total number of `{PATH}` is less than 2');

// Export the Mongoose model
module.exports = mongoose.model('Question', QuestionSchema);