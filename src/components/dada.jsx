import React, { useState } from "react";
import { Redirect } from "react-router-dom";

// React components 
import NavBar from './NavBar'

//Web3
import Web3 from 'web3';

// Axios
import axios from 'axios';

// Boostrap CSS
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form'

//Contract Data
const compiledContract = require('./config.json');



function Owner(props) {

  const [web3, setWeb3] = useState();
  const [repoId, setRepoId] = useState();
  const [address, setAddress] = useState();
  const [tokenName, setTokenName] = useState();
  const [tokenSymbol, setTokenSymbol] = useState();
  const [message, setMessage] = useState();
  const [repoMessage, setRepoMessage] = useState();
  const [repoExists, setRepoExists] = useState(false);



  let signInWithMetamask = async () => {
    const web3 = new Web3(window.ethereum);
    window.ethereum.enable().then((data) => {
      console.log(data);
      setWeb3(web3);
    })
      .catch(error => {
        console.log(error)
      })
  }

  let deployContract = async (event) => {

    event.preventDefault();

    const accounts = await web3.eth.getAccounts();

    const deployedContract = await new web3.eth.Contract(compiledContract.abi)
      .deploy({
        data: compiledContract.bytecode,
        arguments: [address, `${repoId}`, "1000000000000000000000", "Keny Token", "KENY"]
      })
      .send({
        from: accounts[0]
      });

    console.log(`Contract deployed at address: ${deployedContract.options.address}`);

    setContractAddress(repoId, deployedContract.options.address);
  }

  const setData = (type, event) => {
    console.log(event.target.value);

    switch (type) {
      case "repo":
        setRepoId(event.target.value);
        checkRepoId(event.target.value);
        break;

      case "address":
        setAddress(event.target.value);
        break;

      case "token-name":
        setTokenName(event.target.value);
        break;

      case "token-symbol":
        setTokenSymbol(event.target.value);
        break;
    }
  }


  const setContractAddress = async (repo_id, contract_address) => {
    console.log("Set contract address called");
    axios.get(`http://localhost:9014/setdb?repo_id=${repo_id}&contract_address=${contract_address}`)
      .then(function (response) {
        // handle success
        console.log(response);
        setMessage(`Your Contract Address is : ${contract_address} & Your sponsor URL is http://localhost:3000/sponsor/${repo_id}`)
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
  }

  const checkRepoId = async (repo_id) => {

    const button = document.querySelector('#create-token');
    button.disabled = true;

    axios.get(`http://localhost:9014/getdb`)
      .then((response) => {
        console.log(response.data.data);

        response.data.data.forEach((repo) => {
          if (repo.key == repo_id) {
            console.log("It EXISTS");
            functionRepoMessage();
            repoExists(true);
          }
        });

        setTimeout(() => {
          if (repoExists == true) {
            button.disabled = true;
          }
          else {
            button.disabled = false;
          }
        }, 1500)
      })
      .catch(function (error) {
        // handle error
      })

  }

  const functionRepoMessage = () => {
    setRepoMessage("Repo exists already, please choose another one!");

    setTimeout(() => {
      setRepoMessage(" ");
    }, 1500)
  }

  return (
    <div>
      <NavBar active="owner" />
      <div className="container">
        {
          props.state.owner ?
            
              // {/*<div className="row">
              //   <div className="col">
                  
              //     */}
              //     {/* <div className="col-10"> */}
                  <div>
                  <ul>
                    <br />
                    <li>
                      <h2> Step 1 </h2>
                      <p> Connect to Metamask </p>
                      <Button variant="warning" onClick={signInWithMetamask}>Connect</Button>{' '}
                      
                    </li>
                   
                    <li>
                      <h2>Step 2</h2>
                      <p> Choose a repository to mint tokens for! </p>


                      {/* <input id="token-name" name="token-name" type="text" onChange={(e) => setData("token-name", e)}/>
                        <input id="token-symbol" name="token-symbol" type="text" onChange={(e) => setData("token-symbol", e)}/> */}

                      <Form>
                        <Form.Group controlId="chooseRepo">
                          <h4> {repoMessage} </h4>

                          <Form.Label>Repo</Form.Label>

                          <Form.Control as="select" onChange={(e) => setData("repo", e)} required custom>
                            <option value=""> </option>
                            {props.state.repoData.map(element => {
                              return (
                                <option value={element.id} key={element.id}>{element.name}</option>
                              )
                            })}
                          </Form.Control>

                        </Form.Group>

                        <Form.Group controlId="owner-address" name="owner-address" type="text" onChange={(e) => setData("address", e)}>
                          <Form.Label>Your wallet Address</Form.Label>
                          <Form.Control required type="text" placeholder="0xbgsgaaD77908e5353B6b4D5922fd201cs985663" />
                        </Form.Group>

                        <Button className="orange-btn" id="create-token" onClick={(event) => deployContract(event)}> Create Token </Button>

                      </Form>
                    </li>
  
                    <li>
                      <h2> Step 3</h2>
                      <br />
                      <p> Share the link with your supporters! And, tell your contributors about their rewards for #OSS contributions</p>

                      <p> {message} </p>

                    </li>
                  </ul>
                  {/* </div> */}
                  {/* <div className="col"></div>
                </div> */}
              </div>
            
            :<Redirect to="/home" /> }



      </div>
      <br/>
      <br/>
    </div>
  )
}

export default Owner;