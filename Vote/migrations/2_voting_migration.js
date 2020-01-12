const Migrations = artifacts.require("Voting");
var Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545")); 
module.exports = function(deployer) {
  var value = web3.utils.toHex("62375284786945301023650546621286202401143299641012502162989525763860433832169");
  
  //string memory _vT, uint _vID, uint _sT, uint _eT, uint E, uint N, string[] memory _can
  deployer.deploy(Migrations, "Test", 123, 1578700800000, 1578754800000, 
  65537, value
  , ["TIW63731", "HGY62517"]);
};