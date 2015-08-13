// Load required packages
var mongoose = require('mongoose');

function minLessThanMax (value) {
	console.log(this.choices)
	return value <= this.maxSelections;
}

//Choices > 2
//maxSelections <= choices.length
//if ranked, minseleciton != maxselections

var minSelec = [minLessThanMax, 'Path `{PATH}` is greater than Path `maxSelections`'];

var ChoiceSchema = new mongoose.Schema({
	description: {type: String, required: true},
	totalVotes: {type: Number, min: 0}
});

// Define our question schema
var QuestionSchema = new mongoose.Schema({
	description: {type: String, required: true},
	minSelections: {type: Number, required: true, min: 1, validate: minSelec},
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

// QuestionSchema.path('minSelections').validate(function (value) {
// 	return value <= this.maxSelections;
// }, 'validation of `{PATH}` failed with value `{VALUE}`');

// Export the Mongoose model
module.exports = mongoose.model('Question', QuestionSchema);