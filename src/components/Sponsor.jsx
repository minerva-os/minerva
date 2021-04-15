import React, {useEffect, useState} from "react";
import NavBar from './NavBar';

import axios from 'axios';

import Web3 from 'web3';


// Boostrap CSS
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

//Contract Data
const compiledContract = require('./config.json');

function App(props) {

    const [metamaskConnected, setMetamaskConnected] = useState(false);
    const [web3, setWeb3] = useState();
    const [contractAddress, setContractAddress] = useState();
    const [message, setMessage] = useState();
    const [statusMessage, setStatusMessage] = useState();
    const [sponsorAmount, setSponsorAmount] = useState();
    const [link, setLink] = useState();



    useEffect(() => {


        const repoId = props.match.params.repo_id;

        axios.get(`https://storageapi.fleek.co/shreykeny-team-bucket/${repoId}`)
        .then(response => {
            console.log(response.data);
            setContractAddress(response.data);

        } )
        .catch(error => {
            console.log(error);
            setStatusMessage("Sorry, something went wrong. This Repo is not registered.");
        });
    }) 
        



    const signInWithMetamask = async () => {
        const web3 = new Web3(window.ethereum);

        window.ethereum.enable().then((data) => {
            console.log(data);
            setMetamaskConnected(true);
            setWeb3(web3);
        })
        .catch(error => {
            // User denied account access
            console.log(error)
        })
    }

    const sponsorFunds = async () => {
        const accounts = await web3.eth.getAccounts();

        const contract = new web3.eth.Contract(compiledContract.abi, contractAddress);

          const transaction = await contract.methods.sponsorFundsRepo().send({ from : accounts[0], value: (sponsorAmount * (Math.pow(10, 18)))})
          .once('receipt', (receipt) => {
            // console.log(receipt);
          })

        console.log(transaction);

        if(transaction.status == true) {
            // setLink(`https://rinkeby.etherscan.io/${transaction.transactionHash}`);
            setMessage(`Transaction successful!`);

            // console.log(message, link);
        }
    }

    const setData = (e) => {
    //   console.log(e.target.value);

      setSponsorAmount(e.target.value);
    }

    return(
        <div> 
            <NavBar active="sponsor" metamaskStatus={metamaskConnected}/>
            <div className="sponsor-container">
            <h5 style={{color : "red"}}> {statusMessage} </h5>
            <div> 
            <h2> Step 1</h2>
            <p> Connect to Metamask </p>
            <Button variant="warning" onClick={signInWithMetamask}> Connect </Button>
            </div>


            <div> 

            <h2> Step 2 </h2>

            Add the amount

            <Form>

            <Form.Group controlId="owner-address" name="sponsor-amount" type="text" onChange={(e) => setData(e)}>
              <Form.Label>Amount (in ETH)</Form.Label>
              <Form.Control required type="number" placeholder="0.1Ξ"/>
            </Form.Group>

            <Button variant="primary" id="sponsor-submit" onClick={(event) => sponsorFunds(event)}> Send Ξ</Button>
            </Form>

            </div>

            <div> {message} </div>

            <div> 
                <h2> Step 3</h2>

                <p> Add tokens to your Metamask </p> 

                <li> Copy this address : {contractAddress}</li>
                <li> Open Metamask, Go to "Assets"</li>
                <li> Scroll down & click "Add Token"</li>
                <li> Go to "Custom Tokens" and paste the contract address you copied</li>
                <li> Click "Next" and then "Add Tokens"</li>
                <li>  🎉 Hooray! You should now see your tokens in your wallet! </li>





            </div> 
            </div>
        </div>
    )
}

export default App;