// Load required packages
var mongoose = require('mongoose');
var _us = require("underscore");
var Quiry = require('../models/quiry');

var SelectionSchema = new mongoose.Schema({
	preference: Number,
	candidateId: String
});

// Define our answer schema
var BallotSchema = new mongoose.Schema({
	respondant: String,
	createdDate: Date,
	modifiedDate: Date,
	quiryId: String,
	selections: [SelectionSchema]
});

//Custom validations
BallotSchema.path('selections').validate(function (value) {
	return value.length > 0;
}, 'Ballot has no selections');
BallotSchema.path('selections').validate(function (value) {
	return undefined != _us.findWhere(value, {preference: 1});
}, 'Selection ranking must start at 1');
BallotSchema.path('selections').validate(function (value) {
	var rankings = _us.uniq(_us.pluck(_us.sortBy(value, 'preference'), 'preference'));
	var sequence = true;
	_us.each(rankings, function(rank, i) {
		if ((i+1) != rank) { sequence = false; }
	})
	return sequence;
}, 'Rankings must be sequential');

// respondant should prob be email address or something later

// Export the Mongoose model
module.exports = mongoose.model('Ballot', BallotSchema);