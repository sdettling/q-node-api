// Load required packages
var Answer = require('../models/answer');

// Create endpoint /api/questions for POST
exports.postAnswer = function(req, res) {
	// Create a new instance of the Question model
	var answer = new Answer();

	// Set the answer properties that came from the POST data
	var date = new Date();
	answer.displayName = req.body.displayName;
	answer.createdDate = date;
	answer.modifiedDate = date;
	//answer.userId = req.user._id;
	answer.questionId = req.params.question_id;
	answer.votes = req.body.votes;

	// console.log(req.body);
	// console.log("answer controller");
	// Save the answer and check for errors
	answer.save(function(err) {
		if (err) {
			res.json({ status: 'error', data: answer, message : err.message });
		}
		else {
			res.json({ status: 'success', data: answer, message: 'Answer added' });
			//update choice total value
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

// Create endpoint /api/questions/:question_id/answers/:answer_id for GET
exports.getAnswer = function(req, res) {
	// Use the Answer model to find a specific answer
	Answer.find({ _id: req.params.answer_id }, function(err, answer) {
		if (err)
			res.send(err);

		res.json(answer);
	});
};

// Create endpoint /api/questions/:question_id/answers for GET
exports.getAnswers = function(req, res) {
	// Use the Answer model to find a specific answer
	Answer.find({ questionId: req.params.question_id }, function(err, answers) {
		if (err)
			res.send(err);

		res.json(answers);
	});
};

// Create endpoint /api/questions/:answer_id for PUT
exports.putAnswer = function(req, res) {
	// Use the Answer model to find a specific answer
	Answer.update({ userId: req.user._id, _id: req.params.answer_id }, req.body, function(err, num, raw) {
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
};