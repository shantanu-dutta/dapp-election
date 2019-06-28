var Election = artifacts.require("./Election.sol");

contract("Election", function(accounts) {
	
	var electionInstance;
	
	it("initializes with two candidates", function(){
		return Election.deployed()
		.then(function(instance) {
			return instance.candidatesCount();
		})
		.then(function(count) {
			assert.equal(count, 2);
		});
	});

	it("initializes candidates with correct value", function() {
		return Election.deployed()
		.then(function(instance) {
			electionInstance = instance;
			return electionInstance.candidates(1);
		})
		.then(function(candidate) {
			assert(candidate[0], 1, "contains the correct ID");
			assert(candidate[1], "Candidate 1", "contains the correct name");
			assert(candidate[2], 0, "contains the correct vote count");

			return electionInstance.candidates(2);
		}).then(function(candidate) {
			assert(candidate[0], 2, "contains the correct ID");
			assert(candidate[1], "Candidate 2", "contains the correct name");
			assert(candidate[2], 0, "contains the correct vote count");
		});
	});

	it("allows a voter to cast a vote", function(){
		var candidateId;
		return Election.deployed()
		.then(function(instance) {
			electionInstance = instance;
			candidateId = 1;
			return electionInstance.vote(candidateId, {from:accounts[0]});
		})
		.then(function(receipt) {
			return electionInstance.voters(accounts[0]);
		})
		.then(function(voted) {
			assert(voted, "the voter was marked as voted");
			return electionInstance.candidates(candidateId);
		})
		.then(function(candidate) {
			var voteCount = candidate[2];
			assert.equal(voteCount, 1, "increments the candidate's vote count");
		});
	});

	it("throws an exception for invalid candidates", function(){
		return Election.deployed()
		.then(function(instance) {
			electionInstance = instance;
			return electionInstance.vote(99, { from: accounts[1] });
		})
		.then(assert.fail)
		.catch(function(error) {
			assert(error.message.includes('revert'), "error message must contain revert");
			return electionInstance.candidates(1);
		})
		.then(function(candidate1) {
			var voteCount = candidate1[2];
			assert.equal(voteCount, 1, "candidate 1 did not receive any votes");
			return electionInstance.candidates(2);
		})
		.then(function(candidate2) {
			var voteCount = candidate2[2];
			assert.equal(voteCount, 0, "candidate 2 did not receive any votes");
		});
	});

	it("throws an exception for double voting", function() {
		var candidateID;
		return Election.deployed()
		.then(function(instance) {
			electionInstance = instance;
			candidateID = 2;
			electionInstance.vote(candidateID, { from: accounts[1] });
			return electionInstance.candidates(candidateID);
		})
		.then(function(candidate){
			var voteCount = candidate[2];
			assert(voteCount, 1, "accepts first vote");
			// try to vote again
			return electionInstance.vote(candidateID, {from: accounts[1]});
		})
		.catch(function(error) {
			assert(error.message.includes('revert'), "error message must contain revert");
			return electionInstance.candidates(1);
		})
		.then(function(candidate) {
			var voteCount = candidate[2];
			assert.equal(voteCount, 1, "candidate 1 did not receive any votes");
			return electionInstance.candidates(2);
		})
		.then(function(candidate) {
			var voteCount = candidate[2];
			assert.equal(voteCount, 1, "candidate 2 did not receive any votes");
		});
	});

});


