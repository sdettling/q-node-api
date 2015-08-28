var chai = require('chai');
var request = require('supertest');
var express = require('express');

var app = require('../server.js');

var assert = chai.assert,
	expect = chai.expect,
	should = chai.should(); // Note that should has to be executed

describe('Questions', function () {
	var testQuestionId = null;
	describe('GET /api/questions', function(){
		it('responds with json', function(done){
			request(app)
			.get('/api/questions')
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(200)
			done();
		})
	});
	describe('POST /api/questions', function(){
		it('responds with json on success', function(done){
			var question = { description : 'My question?', email : 'test@quiry.com', minSelections : 1, maxSelections: 4, ranked: false, published: false, choices: [ {description: 'choice 1'}, {description: 'choice 2'}, {description: 'choice 3'}, {description: 'choice 4'}]};
			request(app)
			.post('/api/questions')
			.set('Accept', 'application/json')
			.send(question)
			.expect('Content-Type', /json/)
			.expect(200)
			.end(function(err, res){
				expect(res.body.status).to.equal("success");
				expect(res.body.data._id).not.to.be.null;
				testQuestionId = res.body.data._id;
				done();
			});
		})
		it('should not have less than 2 choices', function(done){
			var question = { description : 'My question?', email : 'test@quiry.com', minSelections : 1, maxSelections: 1, ranked: false, published: false, choices: [ {description: 'choice 1'}]};
			request(app)
			.post('/api/questions')
			.set('Accept', 'application/json')
			.send(question)
			.expect('Content-Type', /json/)
			.expect(200)
			.end(function(err, res){
				expect(res.body.status).to.equal("error");
				expect(res.body.message.choices.message).to.equal("Total number of `choices` is less than 2");
				done();
			});
		})
		it('min selections should be greater than 0', function(done){
			var question = { description : 'My question?', email : 'test@quiry.com', minSelections : 0, maxSelections: 1, ranked: false, published: false, choices: [ {description: 'choice 1'}, {description: 'choice 2'}]};
			request(app)
			.post('/api/questions')
			.set('Accept', 'application/json')
			.send(question)
			.expect('Content-Type', /json/)
			.expect(200)
			.end(function(err, res){
				expect(res.body.status).to.equal("error");
				expect(res.body.message.minSelections.message).to.equal("Path `minSelections` (0) is less than minimum allowed value (1).");
				done();
			});
		})
		it('max selections should be greater than 0', function(done){
			var question = { description : 'My question?', email : 'test@quiry.com', minSelections : 2, maxSelections: 0, ranked: false, published: false, choices: [ {description: 'choice 1'}, {description: 'choice 2'}]};
			request(app)
			.post('/api/questions')
			.set('Accept', 'application/json')
			.send(question)
			.expect('Content-Type', /json/)
			.expect(200)
			.end(function(err, res){
				expect(res.body.status).to.equal("error");
				expect(res.body.message.maxSelections.message).to.equal("Path `maxSelections` (0) is less than minimum allowed value (1).");
				done();
			});
		})
		it('max selections should be less than total choices', function(done){
			var question = { description : 'My question?', email : 'test@quiry.com', minSelections : 2, maxSelections: 3, ranked: false, published: false, choices: [ {description: 'choice 1'}, {description: 'choice 2'}]};
			request(app)
			.post('/api/questions')
			.set('Accept', 'application/json')
			.send(question)
			.expect('Content-Type', /json/)
			.expect(200)
			.end(function(err, res){
				expect(res.body.status).to.equal("error");
				expect(res.body.message.maxSelections.message).to.equal("Path `maxSelections` is greater than total choices");
				done();
			});
		})
		it('min selections should be less than or equal to max selections', function(done){
			var question = { description : 'My question?', email : 'test@quiry.com', minSelections : 3, maxSelections: 2, ranked: false, published: false, choices: [ {description: 'choice 1'}, {description: 'choice 2'}, {description: 'choice 3'}]};
			request(app)
			.post('/api/questions')
			.set('Accept', 'application/json')
			.send(question)
			.expect('Content-Type', /json/)
			.expect(200)
			.end(function(err, res){
				expect(res.body.status).to.equal("error");
				expect(res.body.message.minSelections.message).to.equal("Path `minSelections` is greater than Path `maxSelections`");
				done();
			});
		})
		it('min and max selections should be equal when question type is ranked', function(done){
			var question = { description : 'My question?', email : 'test@quiry.com', minSelections : 1, maxSelections: 2, ranked: true, published: false, choices: [ {description: 'choice 1'}, {description: 'choice 2'}]};
			request(app)
			.post('/api/questions')
			.set('Accept', 'application/json')
			.send(question)
			.expect('Content-Type', /json/)
			.expect(200)
			.end(function(err, res){
				expect(res.body.status).to.equal("error");
				expect(res.body.message.ranked.message).to.equal("Path `minSelections` must equal `maxSelections` when ranked is true");
				done();
			});
		})
		it('should have a description less than 300 characters', function(done){
			var question = { description : 'My question?', email : 'test@quiry.com', minSelections : 1, maxSelections: 2, ranked: false, published: false, choices: [ {description: 'choice 1 lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum'}, {description: 'choice 2'}]};
			request(app)
			.post('/api/questions')
			.set('Accept', 'application/json')
			.send(question)
			.expect('Content-Type', /json/)
			.expect(200)
			.end(function(err, res){
				expect(res.body.status).to.equal("error");
				expect(res.body.message['choices.0.description'].message).to.equal("Character count of `description` must be 300 or less");
				done();
			});
		})
		it('should have unique choices', function(done){
			var question = { description : 'My question?', email : 'test@quiry.com', minSelections : 1, maxSelections: 2, ranked: false, published: false, choices: [ {description: 'choice'}, {description: 'choice'}]};
			request(app)
			.post('/api/questions')
			.set('Accept', 'application/json')
			.send(question)
			.expect('Content-Type', /json/)
			.expect(200)
			.end(function(err, res){
				expect(res.body.status).to.equal("error");
				expect(res.body.message.choices.message).to.equal("Choices must be unique");
				done();
			});
		})
		/*
		it('should belong to a user', function(done){})
		it('should return unauthorized if user not logged in', function(done){})
		it('should use user account with matching email')
		it('should create new user if user with that email does not exist')
		*/
	});
	describe('GET /api/question', function(){
		it('responds with json', function(done){
			request(app)
			.get('/api/question/' + testQuestionId)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(200)
			done();
		})
	});
	describe('PUT /api/questions', function(){
		it('responds with json', function(done){
			var question = { description : 'My question?', email : 'test@quiry.com', minSelections : 1, maxSelections: 4, ranked: false, published: false, choices: [ {description: 'choice 5'}, {description: 'choice 6'}, {description: 'choice 7'}, {description: 'choice 8'}]};
			request(app)
			.put('/api/questions/' + testQuestionId)
			.set('Accept', 'application/json')
			.send(question)
			.expect('Content-Type', /json/)
			.expect(200)
			.end(function(err, res){
				expect(res.body.status).to.equal("success");
				expect(res.body.data._id).not.to.be.null;
				done();
			});
		})
		//it('should not replace identical choices', function(done){})
	});
	describe('DELETE /api/questions', function(){
		//it('responds with json', function(done){done();})
		it('deletes the specified question', function(done){
			request(app)
			.delete('/api/questions/' + testQuestionId)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(200)
			.end(function(err, res){
				expect(res.body.status).to.equal("success");
				expect(res.body.message).to.equal("Question deleted");
				done();
			});
		})
	});
});

describe('Answers', function () {
	var testQuestionId = null;
	var testAnswerId = null;
	describe('POST /api/answers', function(){
		it('responds with json on success', function(done){
			var question = { description : 'My question?', email : 'test@quiry.com', minSelections : 1, maxSelections: 4, ranked: false, published: false, choices: [ {description: 'choice 1'}, {description: 'choice 2'}, {description: 'choice 3'}, {description: 'choice 4'}]};
			var answer = { displayName: 'My answer.', votes: [] };
			var application = request(app);
			application.post('/api/questions')
			.set('Accept', 'application/json')
			.send(question)
			.expect('Content-Type', /json/)
			.expect(200)
			.end(function(err, res){
				testQuestionId = res.body.data._id;
				answer.votes.push({value: 1, choiceId: res.body.data.choices[0]._id})
				application.post('/api/questions/' + testQuestionId + '/answers')
				.set('Accept', 'application/json')
				.send(answer)
				.expect('Content-Type', /json/)
				.expect(200)
				.end(function(err, res){
					testAnswerId = res.body.data._id;
					expect(res.body.data._id).not.to.be.null;
					done();
				});
			});
		})
	});
	describe('DELETE /api/answers', function(){
		it('deletes the specified question', function(done){
			var application = request(app);
			application.delete('/api/questions/' + testQuestionId + '/answers/' + testAnswerId)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(200)
			.end(function(err, res){
				expect(res.body.status).to.equal("success");
				expect(res.body.message).to.equal("Answer deleted");
				application.delete('/api/questions/' + testQuestionId)
				.set('Accept', 'application/json')
				.expect('Content-Type', /json/)
				.expect(200)
				.end(function(err, res){
					expect(res.body.status).to.equal("success");
					expect(res.body.message).to.equal("Question deleted");
					done();
				});
			});
		})
	});
});