pragma solidity >=0.4.25;
pragma experimental ABIEncoderV2;

contract Voting {
    struct Voter {
        uint id; // voter's id
        bool voted; // whether the voter has voted or not
        uint candidate; // the candidate that the voter votes for
    }

    struct Candidate {
        uint count;
        string name;
        uint id;
    }
    address public owner;
    string votingTitle;
    uint votingID;
    uint startTime;
    uint endTime;
    uint publicKeyE;
    bytes32 publicKeyN;
    mapping (address => Voter) voters; // eligible voters
    Candidate[] candidates; // eligible candidates
    uint public value = 0;
    bytes32 msgHash;
    bytes32 verifyHash;
    event ValueSet(uint val);
    function setValue(uint val) public {
        value += val;
        emit ValueSet(value);
    }
    function getValue() public view returns (uint) {
        return value;
    }
    function getTime() public view returns (uint, uint) {
        return (startTime, endTime);
    }
    function getKey() public view returns (uint, bytes32) {
        return (publicKeyE, publicKeyN);
    }
    function getHash() public view returns(bytes32, bytes32){
        return (msgHash, verifyHash);
    }

    constructor (string memory _vT, uint _vID, uint _sT, uint _eT, uint E, bytes32 N, string[] memory _can) public {
        votingTitle = _vT;
        votingID = _vID;
        startTime = _sT;
        endTime = _eT;
        publicKeyE = E;
        publicKeyN = N;
        for (uint j = 0; j < _can.length; j++) {
            candidates.push(Candidate({
                count: 0,
                name: _can[j],
                id: j
            }));
        }
        owner = msg.sender;
    }

    function vote (uint candidate) public {
        Voter storage sender = voters[msg.sender];
        //require(verify(), "Signature is wrong.");
        //require(!sender.voted, "Sender has been voted.");
        //sender.voted = true;
        //sender.candidate = candidate;
        candidates[candidate].count += 1;

    }

    function verify (string memory message, string memory signedMessage) public returns (bool eligible) {
        msgHash = sha256(message);
        //rsaverify(msgHash, publicKeyN, publicKeyE, );
        uint result = mulmod(uint(msgHash), publicKeyE, uint(publicKeyN));
        verifyHash = bytes32(result);
        if (bytes32(result) == msgHash) eligible = true;
        else eligible = false;
    }

    function checkTime () private view returns (bool) {
        if (now > endTime || now < startTime) return false;
        else return true;
    }

    function checkVotingID (uint ballotID) private view returns (bool) {
        if (ballotID != votingID) return false;
        else return true;
    }

    function collectVotes () public view returns (string memory winningCandidates) {
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
