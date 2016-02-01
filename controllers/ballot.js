// Load required packages
var Ballot = require('../models/ballot');

// Create endpoint /api/quiries/:quiry_id/ballots for POST
exports.postBallot = function(req, res) {
	var ballot = new Ballot();

	var date = new Date();
	ballot.respondant = req.body.respondant;
	ballot.createdDate = date;
	ballot.modifiedDate = date;
	ballot.quiryId = req.params.quiry_id;
	ballot.selections = req.body.selections;

	ballot.save(function(err) {
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
			res.json({ status: 'success', data: ballot });
		}
	});
};

// Create endpoint /api/quiries/:quiry_id/ballots for GET
exports.getBallots = function(req, res) {
	Ballot.find({ quiryId: req.params.quiry_id }, function(err, ballots) {
		if (ballots.length == 0) {
			res.status(404).send({ status: 'error', data: {'message': 'No ballots have been submitted for this quiry'} });
		}
		else if (err) {
			res.status(400).send({ status: 'error', data: err });
		}
		else {
			res.json({ status: 'success', data: ballots });
		}
	});	
};

// Create endpoint /api/ballots/:ballot_id for GET
exports.getBallot = function(req, res) {
	Ballot.findById(req.params.ballot_id, function(err, ballot) {
		if (!ballot) {
			res.status(404).send({ status: 'error', data: {'message': 'Could not find ballot with this id'} });
		}
		else if (err) {
			res.status(400).send({ status: 'error', data: err });
		}
		else {
			res.json({ status: 'success', data: ballot });
		}
	});	
};
// Create endpoint /api/ballots/:ballot_id for PUT
exports.putBallot = function(req, res) {
	Ballot.findById(req.params.ballot_id, function(err, ballot) {
		if (!ballot) {
			res.status(404).send({ status: 'error', data: {'message': 'Could not find ballot with that id'} });
		}
		else {
			var date = new Date();
			ballot.respondant = req.body.respondant;
			ballot.modifiedDate = date;
			ballot.quiryId = req.params.quiry_id;
			ballot.selections = req.body.selections;

			ballot.save(function(err) {
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
					res.json({ status: 'success', data: ballot });
				}
			});
		}
	});
};
// Create endpoint /api/ballots/:ballot_id for DELETE
exports.deleteBallot = function(req, res) {
	Ballot.remove({ _id: req.params.ballot_id }, function(err, ballot) {
		if (err) {
			res.status(400).json({ status: 'error', data: err });
		}
		else {
			res.json({ status: 'success', data: {} });
		}
	});
};

// Create endpoint /api/questions for GET
// exports.getAnswers = function(req, res) {
//   // Use the Answer model to find all answers
//   Answer.find({ userId: req.user._id }, function(err, answers) {
//     if (err)
//       res.send(err);

//     res.json(answers);
//   });
// };
/*
// Create endpoint /api/quiries/:quiry_id/ballots/:ballot_id for GET
exports.getBallot = function(req, res) {
	// Use the Ballot model to find a specific ballot
	Ballot.find({ _id: req.params.ballot_id }, function(err, ballot) {
		if (err)
			res.send(err);

		res.json(ballot);
	});
};

// Create endpoint /api/quiries/:quiry_id/ballot for GET
exports.getBallot = function(req, res) {
	// Use the Answer model to find a specific answer
	Ballot.find({ quiryId: req.params.quiry_id }, function(err, ballot) {
		if (err)
			res.send(err);

		res.json(ballot);
	});
};

// Create endpoint /api/questions/:ballot_id for PUT
exports.putBallot = function(req, res) {
	// Use the Answer model to find a specific answer
	Ballot.update({ userId: req.user._id, _id: req.params.ballot_id }, req.body, function(err, num, raw) {
		if (err)
			res.send(err);

		res.json({ message: 'updated', data: raw });
	});
};

// Create endpoint /api/questions/:question_id for DELETE
exports.deleteAnswer = function(req, res) {
	// Use the Answer model to find a specific answer and remove it
	Answer.remove({ _id: req.params.answer_id }, function(err) {
		if (err) {
			res.json({ status: 'error', data: answer, message : err.message });
		}
		else {
			res.json({ status: 'success', data: {}, message: 'Answer deleted' });
		}
	});
};*/