//Load required packages
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var quiryController = require('./controllers/quiry');
var ballotController = require('./controllers/ballot');

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

// Create endpoint handlers for /quiries
router.route('/quiries')
	.post(quiryController.postQuiry)
	.get(quiryController.getQuiries);

// Create endpoint handlers for /quiries/:quiry_id
router.route('/quiries/:quiry_id')
	.get(quiryController.getQuiry)
	.put(quiryController.putQuiry)
	.delete(quiryController.deleteQuiry);

router.route('/quiries/:quiry_id/ballots')
	.post(ballotController.postBallot)
	.get(ballotController.getBallots);

router.route('/ballots/:ballot_id')
	.get(ballotController.getBallot)
	.put(ballotController.putBallot)
	.delete(ballotController.deleteBallot);

/*  .get(authController.isAuthenticated, answerController.getAnswers);
router.route('/questions/:question_id/answers/:answer_id')
  .get(authController.isAuthenticated, answerController.getAnswer)
  .put(authController.isAuthenticated, answerController.putAnswer)
  .delete(authController.isAuthenticated, answerController.deleteAnswer);*/

// Register all our routes with /api
app.use('/api', router);

// Start the server
app.listen(3000);