// Load required packages
var Quiry = require('../models/quiry');
var Ballot = require('../models/ballot');
var crypto = require('crypto');
var _us = require("underscore");

// Create endpoint /api/quiries for POST
exports.postQuiry = function(req, res) {
	var quiry = new Quiry();
	var token = crypto.randomBytes(3).toString('hex');
	var date = new Date();

	quiry.description = req.body.description;
	quiry.published = req.body.published;
	quiry.createdDate = date;
	if (quiry.published) {
		quiry.publishedDate = date;
	}
	else {
		quiry.publishedDate = null;
	}
	quiry.modifiedDate = date;
	quiry.token = token;
	quiry.candidates = req.body.candidates;

	quiry.save(function(err) {
		if (err && ('ValidationError' === err.name)) {
			var errors = {};
			var er = err.errors
			for (var key in er) {
				if (er.hasOwnProperty(key)) {
					errors[key] = er[key].message;
				}
			}
			res.status(400).json({ status: 'fail', data: errors });
		}
		else if (err) { 
			res.status(400).json({ status: 'error', data: err });
		}
		else {
			res.json({ status: 'success', data: quiry });
		}
	});
};

// Create endpoint /api/quiries for GET
exports.getQuiries = function(req, res) {
	Quiry.find(function(err, quiries) {
		if (quiries.length == 0) {
			res.status(404).send({ status: 'error', data: {'message': 'There are no quiries in the database'} });
		}
		else if (err) {
			res.status(400).send({ status: 'error', data: err });
		}
		else {
			res.json({ status: 'success', data: quiries });
		}
	});
};

// Create endpoint /api/quiries/:quiry_id for GET
exports.getQuiry = function(req, res) {
	Quiry.findById(req.params.quiry_id, function(err, quiry) {
		if (!quiry) {
			res.status(404).send({ status: 'error', data: {'message': 'Could not find quiry with that id'} });
		}
		else if (err) {
			res.status(400).send({ status: 'error', data: err });
		}
		else {
			res.json({ status: 'success', data: quiry });
		}
	});
};

// Create endpoint /api/quiries/:quiry_id for PUT
exports.putQuiry = function(req, res) {
	// If published don't allow changes
	Quiry.findById(req.params.quiry_id, function(err, quiry) {
		if (!quiry) {
			res.status(404).send({ status: 'error', data: {'message': 'Could not find quiry with that id'} });
		}
		else {
			if (quiry.published) {
				res.status(400).send({ status: 'error', data: {'message': 'Cannot update quiry that has been published'} });
			}
			else {
				var date = new Date();
				quiry.description = req.body.description;
				quiry.published = req.body.published;
				if (quiry.published) {
					quiry.publishedDate = date;
				}
				else {
					quiry.publishedDate = null;
				}
				quiry.modifiedDate = date;
				quiry.choices = req.body.candidates;


				quiry.save(function(err) {
					if (err && ('ValidationError' === err.name)) {
						var errors = {};
						var er = err.errors
						for (var key in er) {
							if (er.hasOwnProperty(key)) {
								errors[key] = er[key].message;
							}
						}
						res.status(400).json({ status: 'fail', data: errors });
					}
					else if (err) { 
						res.status(400).json({ status: 'error', data: err });
					}
					else {
						res.json({ status: 'success', data: quiry });
					}
				});
			}
		}
	});
};

// Create endpoint /api/quiries/:quiry_id for DELETE
exports.deleteQuiry = function(req, res) {
	Quiry.remove({ _id: req.params.quiry_id }, function(err, quiry) {
		if (err) {
			res.status(400).json({ status: 'error', data: err });
		}
		else {
			//also delete its ballots
			Ballot.remove({ quiryId: req.params.quiry_id }, function(err, ballot) {
				if (err) {
					res.status(400).json({ status: 'error', data: err });
				}
				else {
					res.json({ status: 'success', data: {} });
				}
			});
		}
	});
	
};