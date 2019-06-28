pragma solidity ^0.5.0;

contract Election {
	struct Candidate {
		uint id;
		string name;
		uint voteCount; 
	}

	mapping(address => bool) public voters;
	mapping(uint => Candidate) public candidates;
	uint public candidatesCount;

	constructor () public  {
		addCandidate("Candidate 1");
		addCandidate("Candidate 2");
	}

	function addCandidate (string memory _name) private {
		candidatesCount = candidatesCount+1;
		candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
	}

	function vote (uint _candidateID) public {
		// require that they haven't voted yet
		require(voters[msg.sender] == false);
		// require a valid candidate
		require(_candidateID>0 && _candidateID <= candidatesCount);

		voters[msg.sender] = true;
		candidates[_candidateID].voteCount = candidates[_candidateID].voteCount + 1;
	}
}
