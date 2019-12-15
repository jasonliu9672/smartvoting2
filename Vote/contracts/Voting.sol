pragma solidity >=0.4.21;

contract Voting {
    struct Voter {
        uint id; // voter's id
        bool voted; // whether the voter has voted or not
        uint candidate; // the candidate that the voter votes for
    }

    struct Candidate {
        uint count;
        bytes32 name;
        uint id;
    }
    address public owner;
    string votingTitle;
    uint votingID;
    uint startTime;
    uint endTime;
    bytes32 publicKey;
    mapping (address => Voter) voters; // eligible voters
    Candidate[] candidates; // eligible candidates

    function create(string memory _vT, uint _vID, uint _sT, uint _eT, bytes32 _pK, address[] memory _vAddr, bytes32[] memory _can) public {
        votingTitle = _vT;
        votingID = _vID;
        startTime = _sT;
        endTime = _eT;
        publicKey = _pK;
        for (uint i = 0; i<_vAddr.length; i++) {
            voters[_vAddr[i]].id = i;
            voters[_vAddr[i]].voted = false;
        }

        for (uint i = 0; i < _can.length; i++) {
            candidates.push(Candidate({
                count: 0,
                name: _can[i],
                id: i
            }));
        }
        owner = msg.sender;
    }

    function vote (uint candidate) public {
        Voter storage sender = voters[msg.sender];
        require(verify(), "Signature is wrong.");
        require(!sender.voted, "Sender has been voted.");
        sender.voted = true;
        sender.candidate = candidate;
        candidates[candidate].count += 1;

    }

    function verify () private returns (bool eligible) {
        eligible = true;
    }

    function collectVotes () public view returns (bytes32 winningCandidates) {
        //require(now > endTime );
        uint winningCount = 0;
        for (uint i = 0; i < candidates.length; i++) {
            if (candidates[i].count > winningCount) {
                winningCount = candidates[i].count;
                winningCandidates = candidates[i].name;
            }
        }
    }
}