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

    function verify (string memory message, string memory signedMessage) public returns (bool eligible) {
        msgHash = sha256(message);
        //rsaverify(msgHash, publicKeyN, publicKeyE, );
        uint result = mulmod(uint(msgHash), publicKeyE, uint(publicKeyN));
        verifyHash = bytes32(result);
        if (bytes32(result) == msgHash) eligible = true;
        else eligible = false;
        return eligible;
    }
    // function uintToAscii(uint number) public view returns(byte) {
    // if (number < 10) {
    //     return byte(48 + number);
    // } else if (number < 16) {
    //     return byte(87 + number);
    // } else {
    //     revert();
    // }
    // }
    // function asciiToUint(byte char) public view returns (uint) {
    //     uint asciiNum = uint(char);
    //     if (asciiNum > 47 && asciiNum < 58) {
    //         return asciiNum - 48;
    //     } else if (asciiNum > 96 && asciiNum < 103) {
    //         return asciiNum - 87;
    //     } else {
    //         revert();
    //     }
    // }
    // function bytes32ToString (bytes32 data) public view returns (string memory) {
    //     bytes memory bytesString = new bytes(64);
    //     for (uint j = 0; j < 32; j++) {
    //         byte char = byte(bytes32(uint(data) * 2 ** (8 * j)));
    //         bytesString[j*2+0] = uintToAscii(uint(char) / 16);
    //         bytesString[j*2+1] = uintToAscii(uint(char) % 16);
    //     }
    //         return string(bytesString);
    // }
    // function stringToBytes32(string memory str) public view returns (bytes32) {
    //     bytes memory bString = bytes(str);
    //     uint uintString;
    //     if (bString.length != 64) { revert(); }
    //     for (uint i = 0; i < 64; i++) {
    //         uintString = uintString*16 + uint(asciiToUint(bString[i]));
    //     }
    //     return bytes32(uintString);
    // }
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
