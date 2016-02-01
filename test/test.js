var chai = require('chai');
var request = require('supertest');
var express = require('express');
var _us = require('underscore');

var app = require('../server.js');

var assert = chai.assert,
	expect = chai.expect,
	should = chai.should();

/////---- Quiry Tests ----/////
// 1. Quiry POST tests
//   a. successful post request
//   b. fails when too few candidates
//   c. fails when there are duplicate candidates
//   d. fails when quiry description is too long
//   e. fails when candidate descripition is too long
// 2. Quriy GET tests
//   a. successful get request
// 3. Quiry PUT tests
//   a. successful put request
//   b. fails to put when published is true
// 4. Quiry DELETE tests
//   a. successful delete request

var goodQuiry1 = {
	description : 'My quiry',
	email : 'test@quiry.com',
	published: false,
	candidates: [
		{description: 'choice 1'},
		{description: 'choice 2'},
		{description: 'choice 3'},
		{description: 'choice 4'}
	]
};

var goodQuiry2 = {
	description : 'My quiry updated',
	email : 'test@quiry.com',
	published: true,
	candidates: [
		{description: 'choice 1'},
		{description: 'choice 2'},
		{description: 'choice 3'},
		{description: 'choice 4'}
	]
};

var failQuiry1 = {
	description : 'My quiry',
	email : 'test@quiry.com',
	published: false,
	candidates: [
		{description: 'choice 1'}
	]
};

var failQuiry2 = {
	description : 'My quiry',
	email : 'test@quiry.com',
	published: false,
	candidates: [
		{description: 'choice'},
		{description: 'choice'}
	]
};

var failQuiry3 = {
	description : 'My quiry lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum',
	email : 'test@quiry.com',
	published: false,
	candidates: [
		{description: 'choice 1'},
		{description: 'choice 2'}
	]
};

var failQuiry4 = {
	description : 'My quiry',
	email : 'test@quiry.com',
	published: false,
	candidates: [
		{description: 'choice 1'},
		{description: 'choice  lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum'}
	]
};

describe('Quiries', function () {
	var testQuiryId = null;
	describe('POST /api/quiries', function(){
		it('adds a new quiry to the database and responds with resulting json object', function(done){
			request(app)
			.post('/api/quiries')
			.set('Accept', 'application/json')
			.send(goodQuiry1)
			.expect('Content-Type', 'application/json')
			.expect(200)
			.end(function(err, res){
				expect(res.body.status).to.equal("success");
				expect(res.body.data._id).not.to.be.null;
				expect(res.body.data.description).to.equal("My quiry");
				expect(res.body.data.candidates.length).to.equal(4);
				testQuiryId = res.body.data._id;
				done();
			});
		})
		it('should fail to validate when quiry has less than 2 candidates', function(done){
			request(app)
			.post('/api/quiries')
			.set('Accept', 'application/json')
			.send(failQuiry1)
			.expect('Content-Type', 'application/json')
			.expect(200)
			.end(function(err, res){
				expect(res.body.status).to.equal("fail");
				expect(res.body.data.candidates).to.equal("Total number of candidates must be at least 2");
				done();
			});
		})
		it('should fail to validate when quiry contains multiple identical candidates', function(done){
			request(app)
			.post('/api/quiries')
			.set('Accept', 'application/json')
			.send(failQuiry2)
			.expect('Content-Type', 'application/json')
			.expect(200)
			.end(function(err, res){
				expect(res.body.status).to.equal("fail");
				expect(res.body.data.candidates).to.equal("Two or more of your candidates are the same, all candidates must be unique");
				done();
			});
		})
		it('should fail to validate when quiry description is more than 300 characters long', function(done){
			request(app)
			.post('/api/quiries')
			.set('Accept', 'application/json')
			.send(failQuiry3)
			.expect('Content-Type', 'application/json')
			.expect(200)
			.end(function(err, res){
				expect(res.body.status).to.equal("fail");
				expect(res.body.data.description).to.equal("Quiry descriptions must be 300 characters or less");
				done();
			});
		})
		it('should fail to validate when a cantidate description is more than 300 characters long', function(done){
			request(app)
			.post('/api/quiries')
			.set('Accept', 'application/json')
			.send(failQuiry4)
			.expect('Content-Type', 'application/json')
			.expect(200)
			.end(function(err, res){
				expect(res.body.status).to.equal("fail");
				expect(res.body.data['candidates.1.description']).to.equal("Candidate descriptions must be 300 characters or less");
				done();
			});
		})
	});
	describe('GET /api/quiries/:quiry_id', function(){
		it('returns a json object of a single quiry', function(done){
			request(app)
			.get('/api/quiries/' + testQuiryId)
			.set('Accept', 'application/json')
			.expect('Content-Type', 'application/json')
			.expect(200)
			.end(function(err, res){
				expect(res.body.status).to.equal("success");
				expect(res.body.data.description).to.equal("My quiry");
				expect(res.body.data.candidates.length).to.equal(4);
				done();
			});
		})
		it('returns error when quiry cannot be found', function(done){
			request(app)
			.get('/api/quiries/56a7c1f4661d8f88f2adbc9e')
			.set('Accept', 'application/json')
			.expect('Content-Type', 'application/json')
			.expect(200)
			.end(function(err, res){
				expect(res.body.status).to.equal("error");
				expect(res.body.data.message).to.equal("Could not find quiry with that id");
				done();
			});
		})
	});
	describe('GET /api/quiries', function(){
		it('returns a json object of all quiries', function(done){
			request(app)
			.get('/api/quiries')
			.set('Accept', 'application/json')
			.expect('Content-Type', 'application/json')
			.expect(200)
			.end(function(err, res){
				expect(res.body.status).to.equal("success");
				expect(res.body.data.length).to.be.above(0);
				done();
			});
		})
	});
	describe('PUT /api/quiries/:quiry_id', function(){
		it('updates a specified quiry', function(done){
			request(app)
			.put('/api/quiries/' + testQuiryId)
			.set('Accept', 'application/json')
			.send(goodQuiry2)
			.expect('Content-Type', 'application/json')
			.expect(200)
			.end(function(err, res){
				expect(res.body.status).to.equal("success");
				expect(res.body.data.description).to.equal("My quiry updated");
				expect(res.body.data._id).not.to.be.null;
				done();
			});
		})
		it('fails to update a quiry that has been published', function(done){
			request(app)
			.put('/api/quiries/' + testQuiryId)
			.set('Accept', 'application/json')
			.send(goodQuiry1)
			.expect('Content-Type', 'application/json')
			.expect(200)
			.end(function(err, res){
				expect(res.body.status).to.equal("error");
				expect(res.body.data.message).to.equal("Cannot update quiry that has been published");
				done();
			});
		})
	});
	describe('DELETE /api/quiries/:quiry_id', function(){
		it('deletes the specified quiry', function(done){
			request(app)
			.delete('/api/quiries/' + testQuiryId)
			.set('Accept', 'application/json')
			.expect('Content-Type', 'application/json')
			.expect(200)
			.end(function(err, res){
				expect(res.body.status).to.equal("success");
				done();
			});
		})
	});
});

/////---- Ballot Tests ----/////
// 1. Ballot POST tests
//   a. successful post request
//   b. fails validation when ranking does not start at 1
//   c. fails validation when ranking is not sequential
// 2. Ballot GET tests
//   a. gets all the ballots for a quiry
//   b. gets a single ballot
// 3. Ballot PUT tests
//   a. updates a single ballot
// 4. Ballot DELETE tests
//   a. delete a single ballot
//   b. make sure deleting a quiry also deletes its ballots

var goodQuiry1 = {
	description : 'My quiry',
	email : 'test@quiry.com',
	published: false,
	candidates: [
		{description: 'choice 1'},
		{description: 'choice 2'},
		{description: 'choice 3'},
		{description: 'choice 4'}
	]
};
var goodBallot1 = { 
	respondant: 'Steve', 
	selections: [] 
};
var failBallot1 = { 
	respondant: 'Steve', 
	selections: [] 
};
var failBallot2 = { 
	respondant: 'Steve', 
	selections: [] 
};

describe('Ballots', function () {
	var testQuiryBallotId = null;
	var testBallotId1 = null;
	var testBallotId2 = null;
	describe('POST /api/quiries/:quiry_id/ballots', function(){
		it('adds a new ballot for a certain quiry to the database and responds with resulting json object', function(done){
			var application = request(app);
			application.post('/api/quiries')
			.set('Accept', 'application/json')
			.send(goodQuiry1)
			.expect('Content-Type', 'application/json')
			.expect(200)
			.end(function(err, res){
				expect(res.body.status).to.equal("success");
				testQuiryBallotId = res.body.data._id;
				
				goodBallot1.selections.push({preference: 1, candidateId: res.body.data.candidates[0]._id})
				goodBallot1.selections.push({preference: 2, candidateId: res.body.data.candidates[1]._id})

				failBallot1.selections.push({preference: 2, candidateId: res.body.data.candidates[0]._id})
				failBallot1.selections.push({preference: 2, candidateId: res.body.data.candidates[1]._id})

				failBallot2.selections.push({preference: 1, candidateId: res.body.data.candidates[0]._id})
				failBallot2.selections.push({preference: 3, candidateId: res.body.data.candidates[1]._id})


				application.post('/api/quiries/' + testQuiryBallotId + "/ballots")
				.set('Accept', 'application/json')
				.send(goodBallot1)
				.expect('Content-Type', 'application/json')
				.expect(200)
				.end(function(err, res){
					expect(res.body.status).to.equal("success");
					expect(res.body.data._id).not.to.be.null;
					expect(res.body.data.respondant).to.equal("Steve");
					expect(res.body.data.selections.length).to.equal(2);
					testBallotId1 = res.body.data._id;
					done();
				});
			});
		})
		it('fails to validate when selections do not start at 1', function(done){
			request(app).post('/api/quiries/' + testQuiryBallotId + "/ballots")
			.set('Accept', 'application/json')
			.send(failBallot1)
			.expect('Content-Type', 'application/json')
			.expect(200)
			.end(function(err, res){
				expect(res.body.status).to.equal("fail");
				expect(res.body.data.selections).to.equal("Selection ranking must start at 1");
				done();
			});
		})
		it('fails to validate when selection rankigns are not sequential', function(done){
			request(app).post('/api/quiries/' + testQuiryBallotId + "/ballots")
			.set('Accept', 'application/json')
			.send(failBallot2)
			.expect('Content-Type', 'application/json')
			.expect(200)
			.end(function(err, res){
				expect(res.body.status).to.equal("fail");
				expect(res.body.data.selections).to.equal("Rankings must be sequential");
				done();
			});
		})
	});
	describe('GET /api/quiries/:quiry_id/ballots', function(){
		it('gets all the ballots for a certain quiry', function(done){
			var application = request(app);
			application.post('/api/quiries/' + testQuiryBallotId + "/ballots")
			.set('Accept', 'application/json')
			.send(goodBallot1)
			.expect('Content-Type', 'application/json')
			.expect(200)
			.end(function(err, res){
				expect(res.body.status).to.equal("success");
				testBallotId2 = res.body.data._id;
				
				application.get('/api/quiries/' + testQuiryBallotId + "/ballots")
				.set('Accept', 'application/json')
				.expect('Content-Type', 'application/json')
				.expect(200)
				.end(function(err, res){
					expect(res.body.status).to.equal("success");
					expect(res.body.data.length).to.equal(2);
					done();
				});
			});
		})
	});
	describe('GET /api/ballots/:ballot_id', function(){
		it('gets a single ballot', function(done){
			request(app)
			.get('/api/ballots/' + testBallotId1)
			.set('Accept', 'application/json')
			.expect('Content-Type', 'application/json')
			.expect(200)
			.end(function(err, res){
				expect(res.body.status).to.equal("success");
				expect(res.body.data.respondant).to.equal("Steve");
				expect(res.body.data.selections.length).to.equal(2);
				done();
			});
		})
	});
	describe('PUT /api/ballots/:ballot_id', function(){
		it('updates a single ballot', function(done){

			goodBallot1.respondant = "Sir";

			request(app)
			.put('/api/ballots/' + testBallotId1)
			.set('Accept', 'application/json')
			.send(goodBallot1)
			.expect('Content-Type', 'application/json')
			.expect(200)
			.end(function(err, res){
				expect(res.body.status).to.equal("success");
				expect(res.body.data.respondant).to.equal("Sir");
				expect(res.body.data._id).not.to.be.null;
				done();
			});
		});
	})
	describe('DELETE /api/ballots/:ballot_id', function(){
		it('deletes a single ballot', function(done){
			request(app)
			.delete('/api/ballots/' + testBallotId1)
			.set('Accept', 'application/json')
			.expect('Content-Type', 'application/json')
			.expect(200)
			.end(function(err, res){
				expect(res.body.status).to.equal("success");
				done();
			});
		});
	})
	describe('DELETE /api/quiries/:quiry_id', function(){
		it('deletes a quiry and all of its ballots', function(done){
			var application = request(app);
			application.delete('/api/quiries/' + testQuiryBallotId)
			.set('Accept', 'application/json')
			.expect('Content-Type', 'application/json')
			.expect(200)
			.end(function(err, res){
				expect(res.body.status).to.equal("success");
				
				application.get('/api/quiries/' + testQuiryBallotId + "/ballots")
				.set('Accept', 'application/json')
				.expect('Content-Type', 'application/json')
				.expect(200)
				.end(function(err, res){
					expect(res.body.status).to.equal("error");
					expect(res.body.data.message).to.equal("No ballots have been submitted for this quiry");
					done();
				});
			});
		});
	})
});