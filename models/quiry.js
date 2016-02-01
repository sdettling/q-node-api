// Load required packages
var mongoose = require('mongoose');
var _us = require("underscore");

var CandidateSchema = new mongoose.Schema({
	description: {type: String, required: true}
});

// Define our question schema
var QuirySchema = new mongoose.Schema({
	description: {type: String, required: true},
	published: {type: Boolean},
	token: {type: String, required: true, unique: true},
	createdDate: {type: Date, required: true},
	modifiedDate: {type: Date},
	publishedDate: {type: Date},
	candidates: [CandidateSchema]
});

//Validations
QuirySchema.path('description').validate(function (value) {
	return value.length <= 300;
}, 'Quiry descriptions must be 300 characters or less');
QuirySchema.path('candidates').validate(function (value) {
	return value.length > 1;
}, 'Total number of candidates must be at least 2');
QuirySchema.path('candidates').validate(function (value) {
	return value.length == _us.uniq(_us.pluck(value, 'description')).length;
}, 'Two or more of your candidates are the same, all candidates must be unique');
CandidateSchema.path('description').validate(function (value) {
	return value.length <= 300;
}, 'Candidate descriptions must be 300 characters or less');


// Export the Mongoose model
module.exports = mongoose.model('Quiry', QuirySchema);