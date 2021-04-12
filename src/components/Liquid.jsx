import React, {useState, useEffect} from 'react';

import NavBar from './NavBar';

import {Redirect} from "react-router-dom";

// Boostrap CSS
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form'

import axios from 'axios';
import Web3 from 'web3';


const compiledContract = require('./config.json');

function App (props) {

    const [metamaskConnected, setMetamaskConnected] = useState(false);
    const [web3, setWeb3] = useState();
    const [token, setToken] = useState();
    const [contractAddress, setContractAddress] = useState();
    const [statusMessage, setStatusMessage] = useState();
    const [withdrawMessage, setWithdrawMessage] = useState();



    useEffect(() => {
        const repoId = props.match.params.repo_id;
        console.log(repoId);

        axios.get(`https://storageapi.fleek.co/shreykeny-team-bucket/${repoId}`)
        .then(response => {
            console.log(response.data);
            setContractAddress(response.data);

        } )
        .catch(error => {
            console.log(error);
            setStatusMessage("Sorry, something went wrong. This Repo is not registered.");
        });
    }, [])



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
    

    const approve = async () => {
        const accounts = await web3.eth.getAccounts();

        const contract = new web3.eth.Contract(compiledContract.abi, contractAddress);

          const transaction = await contract.methods.approve(accounts[0],token).send({ from : "0xbbbaaD77908e7143B6b4D5922fd201cd08568f63"})
          .once('receipt', (receipt) => {
            // console.log(receipt);
          })

        console.log(transaction);
    }

    const withdrawFunds = async () => {
        console.log(token);

        const accounts = await web3.eth.getAccounts();

        const contract = new web3.eth.Contract(compiledContract.abi, contractAddress);

          const transaction = await contract.methods.sponsorWithdrawsFunds(token).send({ from : "0xbbbaaD77908e7143B6b4D5922fd201cd08568f63"})
          .once('receipt', (receipt) => {
            // console.log(receipt);
          })

        console.log(transaction);
        if(transaction.status == true) {
            // setLink(`https://rinkeby.etherscan.io/${transaction.transactionHash}`);
            setWithdrawMessage(`Transaction successful!`);

            // console.log(message, link);
        }
    }

    return(
        <div> 
        <NavBar active="liquid" />
        <div className="container"> 


            <div> 
            <h2> Step 1</h2> 
            <p> Connect to Metamask </p>
            <Button variant="primary" onClick={signInWithMetamask}> Connect </Button>
            </div>



            <div> 
                <h2> Step 2 </h2>
                <p> Approve the withdrawal of funds </p> 

                <label> Amount of tokens to exchange</label>
                <input type="text" onChange={(data) => setToken(data.target.value)}/>

                <Button variant="primary" onClick={approve}> Approve</Button>
                <div> {statusMessage} </div> 
            </div>

            <div> 
                <h2> Step 3 </h2>
                <p> Withdraw </p> 

                <label> Amount of tokens to exchange</label>
                <input type="text" onChange={(data) => setToken(data.target.value)}/>

                <Button variant="primary" onClick={withdrawFunds}> Withdraw</Button>
                <p> {withdrawMessage}</p>
            </div>

             

            
        </div>
        </div>
    )
}

export default App;