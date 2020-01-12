const Migrations = artifacts.require("Voting");
var Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545")); 
module.exports = function(deployer) {
  var value = web3.utils.toBN("9329694209030060123952578306093403470595131331860404578571044101280156889105987465605249790349324169908137528087586893036887596468611171848385797423358031");
  
  //string memory _vT, uint _vID, uint _sT, uint _eT, uint E, uint N, string[] memory _can
  deployer.deploy(Migrations, "Test", 123, 1578700800000, 1578754800000, 
  65537, value
  , ['1','2']);
};