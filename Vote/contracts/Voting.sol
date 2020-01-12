pragma solidity >=0.4.25;
pragma experimental ABIEncoderV2;

contract Voting {

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
    Candidate[] candidates; // eligible candidates
    uint public value = 0;
    bytes32 msgHash;
    bytes32 verifyHash;
    uint testString;
    uint testmsg;
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
    function getTest() public view returns (uint, uint) {
        return (testString, testmsg);
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

    function vote (string memory message, bytes memory signedMessage) public {
        if (verify(message, signedMessage) && checkTime()){
            for (uint i = 0; i < candidates.length; i++) {
                if (keccak256(abi.encodePacked((message))) == keccak256(abi.encodePacked((candidates[i].name)))) {
                    candidates[i].count += 1;
                }
            }
        }
    }
    function modPow(uint _base, uint _exponent, uint _modulus) public pure returns(uint) {
        uint result;
        result = 1;
        while(_exponent > 0){
            if((_exponent & 1) == 1) result = mulmod(result, _base, _modulus);
            _exponent = _exponent >> 1;
            _base = mulmod(_base, _base, _modulus);
        }
        return result;
    }
    function sliceUint(bytes memory bs, uint start) internal pure returns (uint) {
        uint x;
        assembly {
            x := mload(add(bs, add(0x20, start)))
        }
        return x;
    }

    function verify (string memory message, bytes memory signedMessage) public returns (bool eligible) {
        msgHash = sha256(bytes(message));
        uint result = modPow(sliceUint(signedMessage,0), publicKeyE, uint(publicKeyN));
        verifyHash = bytes32(result);
        if (bytes32(result) == msgHash) eligible = true;
        else eligible = false;
        return eligible;
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
        return winningCandidates;
    }
}
