Process Flow
1. CA(certified authority) initialize a new ballot with title, candidates, number of district joined, start time and end time. 
2. CA gerenates key, including public key (n,e) and private key (d) for this new ballot.
3. Then, the CA deploy the smart contract "Ballot" with title, candidate, number of district joined, start and end time and generated public key (n,e). The Ballot will have the status "created"
4. Eligible voters login with their accounts and fill out voting form. The choices will be output as a voting string (m) along with PID. 
5. Before sending vote to CA for signature, voting string will be blinded with ranmdom generated (r) which will be stored in vue localstorage. The voting string is denoted as B(m).
6. After CA checkes sender's credential, CA signed the voting string with (n,d) generating S(B(m)) , and send it back to the voter.
7. Then, the voters can unblind S(B(m)) with r that previously stored in local storage to get S(m).
8. Then, the voters can send their m and s(m) to the DistrictBallot contract.
9. The DistrictBallot contract will verify m and s(m) using the public key (n,e) and count it as a valid vote to the state variable.
10. By the deadline of the ballot, CA will calculate all votes form different district and 

To start, Run npm start for both app and server