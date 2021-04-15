import React, { useState } from "react";
import NavBar from './NavBar'

import Web3 from 'web3';

// React Router
import { Redirect } from "react-router-dom";

// Boostrap CSS
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form'

import axios from 'axios';

const compiledContract = require('./config.json');


function App(props) {

    // console.log(props);

    const [metamaskConnected, setMetamaskConnected] = useState(false);
    const [web3, setWeb3] = useState();
    const [url, setUrl] = useState();
    const [repo, setRepo] = useState();
    const [contractAddress, setContractAddress] = useState();
    const [statusMessage, setStatusMessage] = useState();
    const [userAddress, setUserAddress] = useState(); 
    const [username, setUsername] = useState();

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

    const getData = (inputUrl) => {

        console.log(inputUrl)

        const url = new URL(`${inputUrl}`);

        console.log(url.pathname);

        axios.get(`https://api.github.com/repos${url.pathname}`)
            .then(response => {
                console.log(response.data);
                setRepo(response.data);
                checkIfRepoExists(response.data.id);
            })
            .catch(err => {
                console.log(err.response.status);
                setStatusMessage("Repo is not found. Please check URL")
            })

    }

    const checkIfRepoExists = (repo_id) => {
        axios.get(`https://storageapi.fleek.co/shreykeny-team-bucket/${repo_id}`)
            .then(response => {
                console.log(response.data);
                setContractAddress(response.data);
            })
            .catch(error => {
                console.log(error);
                setStatusMessage("Sorry, something went wrong. This Repo is not registered.");
            });

        setTimeout(() => {
            if(contractAddress != undefined) {
                setStatusMessage(`Contract Address : ${contractAddress}`);
            }
        }, 1500)

    }

    // const contributorFunds = async () => {
    //     const accounts = await web3.eth.getAccounts();

    //     const contract = new web3.eth.Contract(compiledContract.abi, contractAddress);

    //       const transaction = await contract.methods.sponsorFundsRepo().send({ from : "0xbbbaaD77908e7143B6b4D5922fd201cd08568f63", value: (sponsorAmount * (Math.pow(10, 18)))})
    //       .once('receipt', (receipt) => {
    //         // console.log(receipt);
    //       })
    // }

    const ascii = (m) => {

        // console.log(web3);
        console.log(m);

        const str = m.toString();
        function toHex(str) {
            var result = '';
            for (var i=0; i<str.length; i++) {
              result += str.charCodeAt(i).toString(16);
            }
            console.log(result);
            return result;
          }

        const final = "0x" + web3.utils.padRight(toHex(str), 64);

        console.log(final);

        callContract(final);

    }

    const getUserId = async (data) => 
    {
        console.log(data);
        const id = data;

        axios.get(`https://api.github.com/users/${id}`).
        then(response => {
            ascii(response.data.id);
        })
        .catch(err => console.log(err));

    }

    const transferTokens = () => {
        console.log(username, userAddress);

        getUserId(username);
    }

    const  callContract = async (userid) => {
        const accounts = await web3.eth.getAccounts();

        const contract = new web3.eth.Contract(compiledContract.abi, contractAddress);

          const transaction = await contract.methods.sendContributorTokens(userid, userAddress).send({ from : accounts[0]})
          .once('receipt', (receipt) => {
            // console.log(receipt);
          })

        console.log(transaction);
    }

    return(
        <div> 
            <NavBar active="contributor" metamaskStatus={metamaskConnected}/>
            <h5 style={{color : "red"}}> {statusMessage} </h5>
            <div className="container">
            {
                props.state.owner ? 
                <div> 
                    <h2>  Hi, {props.state.userData.login}  </h2>

                    <ul> 
                    <div>
                        <li> 
                            <h2> Step 1 </h2>
                             <p> Connect to <a target="_blank" href="https://metamask.io/download.html"> Metamask </a> </p>
                            <Button variant="primary" onClick={signInWithMetamask}> Connect </Button>
                        </li>


                    <Form>
                        <li> 
                            <h2> Step 2 </h2>
                            <p> Add the repo URL and check if the project is on Minerva</p>
                    <Form.Group >
                        <Form.Label> Repo URL : </Form.Label>

                        <Form.Control required type="url" id="repo-url" placeholder="https://github.com/minerva-os/github-auth" onChange={(e) => setUrl(e.target.value)}/>
                        <Button onClick={() => getData(url)}> Check </Button> 

                      </Form.Group>
                      </li>
                      <li> 
                          <h2> Step 3 </h2>
                          <p> Add your Github username and wallet address to transfer tokens to your account. You will have to wait 2-3 mins after your PR gets merged.</p> 
                      <Form.Group>
                        <Form.Label> Username : </Form.Label>

                        <Form.Control required type="username" placeholder="minerva-os" onChange={(data) => setUsername(data.target.value)}/>

                      </Form.Group>

                      <Form.Group >
                        <Form.Label> Address : </Form.Label>

                        <Form.Control required type="text" placeholder="0xbgsgaaD77908e5353B6b4D5922fd201cs985663" onChange={(data) => setUserAddress(data.target.value)}/>

                      </Form.Group>
                      
                      <Button variant="primary" onClick={transferTokens}> Transfer tokens </Button>
                      </li>
                      </Form>

                      <li> 
                          <h2> Step 4 </h2>
                          <p> Wait for some time. Once transaction is done, follow these steps to make the tokens visible on Metamask wallet</p>
                            <p> Copy this address : {contractAddress}</p>
                            <p> Open Metamask, Go to "Assets"</p>
                            <p> Scroll down & click "Add Token"</p>
                            <p> Go to "Custom Tokens" and paste the contract address you copied</p>
                            <p> Click "Next" and then "Add Tokens"</p>
                            <p>  🎉 Hooray! You should now see your tokens in your wallet! </p>



                      </li>
                    </div> 
                    </ul>
                </div> : 
                <Redirect to="/home" />
            }
            </div>
            <br />
        </div>
    )
}

export default App;