var Election = artifacts.require("./Election.sol");

contract("Election", function(accounts) {
	var electionInstance;
	
	it("initializes with two candidates", function(){
		return Election.deployed()
		.then(function(instance){
			return instance.candidatesCount();
		})
		.then(function(count){
			assert.equal(count, 2);
		});
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
