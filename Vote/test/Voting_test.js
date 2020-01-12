const Voting = artifacts.require("Voting");

contract("Voting", async accounts => {
    it ("Test 1", async () => {
        let voting = await Voting.deployed();
    })
    it ("Test Create Function", async () => {
        const title = 'test';
        const id = 1;
        const a = 2;
        let voting = await Voting.deployed();
        
    })
})