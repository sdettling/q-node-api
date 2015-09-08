// Load required packages
var Question = require('../models/question');
var crypto = require('crypto');
var _us = require("underscore");

// Create endpoint /api/questions for POST
exports.postQuestion = function(req, res) {
	// Create a new instance of the Question model
	var question = new Question();
	var token = crypto.randomBytes(3).toString('hex');
	var date = new Date();

	question.description = req.body.description;
	question.minSelections = req.body.minSelections;
	question.maxSelections = req.body.maxSelections;
	question.ranked = req.body.ranked;
	question.published = req.body.published;
	question.createdDate = date;
	if (question.published) {
		question.publishedDate = date;
	}
	else {
		question.published = null;
	}
	question.modifiedDate = date;
	question.token = token;
	question.choices = req.body.choices;

	question.save(function(err) {
		//console.log(err)
		if (err && ('ValidationError' === err.name || 'Validation failed' === err.message)) {
			res.status(400).json({ status: 'error', data: question, message : err.errors });
		}
		else if (err) { 
			res.status(400).json({ status: 'error', data: question, message : err.message });
		}
		else {
			res.json({ status: 'success', data: question, message: 'Question added.' });
		}
	});
};

// Create endpoint /api/questions for GET
exports.getQuestions = function(req, res) {
	// Use the Question model to find all question
	Question.find(function(err, questions) {
		if (err)
			res.send(err);

		res.json(questions);
	});
};

// Create endpoint /api/questions/:question_id for GET
exports.getQuestion = function(req, res) {
	// Use the Question model to find a specific question
	Question.find({ _id: req.params.question_id }, function(err, question) {
		if (err)
			res.send(err);

		res.json(question);
	});
};

// Create endpoint /api/questions/:question_id for PUT
exports.putQuestion = function(req, res) {
	// If published don't allow changes
	Question.findById(req.params.question_id, function(err, question) {
		if (!question) {
			return next(new Error('Could not find question'));
		}
		else {
			var date = new Date();
			question.description = req.body.description;
			question.minSelections = req.body.minSelections;
			question.maxSelections = req.body.maxSelections;
			question.ranked = req.body.ranked;
			question.published = req.body.published;
			if (question.published) {
				question.publishedDate = date;
			}
			else {
				question.published = null;
			}
			question.modifiedDate = date;
			question.choices = req.body.choices;

			//console.log(req.body);

			question.save(function(err) {
				//console.log(err)
				if (err && ('ValidationError' === err.name || 'Validation failed' === err.message)) {
					res.status(400).json({ status: 'error', data: question, message : err.errors });
					//console.log(err.errors);
				}
				else if (err) { 
					res.status(400).json({ status: 'error', data: question, message : err.message });
				}
				else {
					res.json({ status: 'success', data: question, message: 'Question added.' });
				}
			});
		}
	});
};

// Create endpoint /api/questions/:question_id for DELETE
exports.deleteQuestion = function(req, res) {
	// Use the Question model to find a specific question and remove it
	Question.remove({ _id: req.params.question_id }, function(err) {
		if (err) {
			res.json({ status: 'error', data: question, message : err.message });
		}
		else {
			res.json({ status: 'success', data: {}, message: 'Question deleted' });
		}
	});
};