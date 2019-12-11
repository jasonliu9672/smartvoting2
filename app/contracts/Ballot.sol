pragma solidity ^0.5.0;
contract Ballot{
    address[] public districtBallots;
    address public lastDistrictBallot;
    uint[] candidates;
    mapping(uint => string) candidateName;
    constructor() public{

    }
    function getDistrictBallotCount() public view returns(uint count){
        return districtBallots.length;
    }
    function newDistrictBallot() public returns(address newballot){
        
    }
    function collectCandidateVotes(uint candidate) public{
        for(uint i = 0; i < districtBallots.length; i++){
            DistrictBallot district = DistrictBallot(i);
            district.getTotalVotes(candidate);
        }
    }
}
contract DistrictBallot{
    enum State {Created,Voting,Ended}
    uint[] candidates;
    mapping(uint => uint) private candidateVotes;
    constructor(uint[] memory _candidates) public{
        candidates = _candidates;
    }
    function getTotalVotes(uint candidate) public view returns(uint){
        return candidateVotes[candidate];
    }

}