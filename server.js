//Load required packages
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var questionController = require('./controllers/question');
var answerController = require('./controllers/answer');

// Connect to database
mongoose.connect('mongodb://localhost:27017/quiryapi');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {

});

// Create express application
var app = express();
module.exports = app;

// Use the body-parser package
app.use(bodyParser.json());

// Create express router
var router = express.Router();

// Create endpoint handlers for /questions
router.route('/questions')
	.post(questionController.postQuestion)
	.get(questionController.getQuestions);

// Create endpoint handlers for /questions/:question_id
router.route('/questions/:question_id')
	.get(questionController.getQuestion)
	.put(questionController.putQuestion)
	.delete(questionController.deleteQuestion);

router.route('/questions/:question_id/answers')
	.get(answerController.getAnswers)
	.post(answerController.postAnswer);

router.route('/questions/:question_id/answers/:answer_id')
	.get(answerController.getAnswer)
	.delete(answerController.deleteAnswer);

/*  .get(authController.isAuthenticated, answerController.getAnswers);
router.route('/questions/:question_id/answers/:answer_id')
  .get(authController.isAuthenticated, answerController.getAnswer)
  .put(authController.isAuthenticated, answerController.putAnswer)
  .delete(authController.isAuthenticated, answerController.deleteAnswer);*/

// Register all our routes with /api
app.use('/api', router);

// Start the server
app.listen(3000);