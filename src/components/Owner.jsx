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
  const [metamaskConnected, setMetamaskConnected] = useState(false);
  const [repoOwner, setRepoOwner] = useState();
  const [repoName, setRepoName] = useState();
  const [conAdd, setConAdd] = useState();
  const [mes, setMes] = useState();



    let signInWithMetamask = async () => {
        const web3 = new Web3(window.ethereum);
        window.ethereum.enable().then((data) => {
            console.log(data);
            setWeb3(web3);
            setMetamaskConnected(true);
        })
        .catch(error => {
            console.log(error)
        })
    }

  let deployContract = async (event) => {

    event.preventDefault();

    const accounts = await web3.eth.getAccounts();

    // const deployedContract = await new web3.eth.Contract(compiledContract.abi)
    //   .deploy({
    //     data: compiledContract.bytecode,
    //     arguments: [address, `${repoId}`, "1000000000000000000000", "Keny Token", "KENY", `?user=${}&repo=${}`]
    //   })
    //   .send({
    //     from: accounts[0]
    //   });

        const deployedContract = await new web3.eth.Contract(compiledContract.abi)
        .deploy({
            data : compiledContract.bytecode,
            arguments: [address, `${repoId}`, "1000000000000000000000", tokenName, tokenSymbol, `?user=${repoOwner}&repo=${repoName}`]
        })
        .send({
          from: accounts[0]
          });
    
        console.log(`Contract deployed at address: ${deployedContract.options.address}`);

    setContractAddress(repoId, deployedContract.options.address);
  }

    const findRepo = (e) => {
      props.state.repoData.forEach((element) => {
        if(element.id == e) {
          setRepoName(element.name);
          setRepoOwner(element.owner.login);
          console.log(element.name, element.owner.login);
        }
      })

    }

    const setData = (type, event) => {
        console.log(event.target.value);

        switch (type) {
            case "repo":
                setRepoId(event.target.value);
                findRepo(event.target.value);
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
                console.log(repoOwner, repoName);
                break;
        }
    }
  
    const ens = () => {
       
      let k = document.getElementById('owner-address').value;

       console.log(k);

       let m = web3.eth.ens.getAddress(k)
       .then(response => {
        document.getElementById('owner-address').value = response;
        console.log(response)
       });


       console.log(m);

       
    }


  const setContractAddress = async (repo_id, contract_address) => {
    console.log("Set contract address called");
    axios.get(`https://github-auth.recurshawn.repl.co/setdb?repo_id=${repo_id}&contract_address=${contract_address}`)
    .then(function (response) {
      // handle success
      console.log(response);
      setMessage(`Your Contract Address is : ${contract_address} & Your sponsor URL is https://minerva.on.fleek.co/sponsor/${repo_id}`)
      setConAdd(contract_address);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    }
    
    const checkRepoId = async (repo_id) => {

    const button = document.querySelector('#create-token');
    button.disabled = true;

    axios.get(`https://github-auth.recurshawn.repl.co/getdb`)
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
  }

    const yoyo = () => {
      console.log("sup sup");
    }

    const intialiseContract = async  () => {

      const accounts = await web3.eth.getAccounts();

      const contract = new web3.eth.Contract(compiledContract.abi, conAdd);

        const transaction = await contract.methods.setPrCheck().send({ from : "0xbbbaaD77908e7143B6b4D5922fd201cd08568f63"})
        .once('receipt', (receipt) => {
          // console.log(receipt);
        })

      console.log(transaction);

      if(transaction.status == true) {
        // setLink(`https://rinkeby.etherscan.io/${transaction.transactionHash}`);
        setMes(`Transaction successful!`);

        // console.log(message, link);
    }

    setTimeout(() => {
      setRepoMessage(" ");
    }, 1500)
    }
   

  return (
    <div>
      <NavBar active="owner" />
      <div className="container padding">
        {
          props.state.owner ?
            
              // {/*<div className="row">
              //   <div className="col">
                  
              //     */}
              //     {/* <div className="col-10"> */}
                  <div>
                     <ul>
       
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
                              <option value={element.id} key={element.id}> {element.name} </option>
                            )

                          
                          })}

                          </Form.Control>

                        </Form.Group>

                        <Form.Group controlId="owner-address" name="owner-address" type="text" onChange={(e) => setData("address", e)}>
                          <Form.Label>Your wallet Address</Form.Label>
                          <Form.Control required type="text" placeholder="0xbgsgaaD77908e5353B6b4D5922fd201cs985663" />
                          <p> If you're using ENS domains, click ENS after adding your domain name <Button onClick={ens}> ENS </Button> We ❤️ ENS but unfortunately, it doesn't support Kovan. You can change your metamask netowrk and try it though. </p>
                        </Form.Group>

                      <Form.Group controlId="token-name" name="token-name" type="text" onChange={(e) => setData("token-name", e)}>
                        <Form.Label>Token Name :</Form.Label>
                        <Form.Control required type="text" placeholder="Minerva Token"/>
                      </Form.Group>

                      <Form.Group controlId="token-symbol" name="token-symbol" type="text" onChange={(e) => setData("token-symbol", e)}>
                        <Form.Label>Token Symbol : </Form.Label>
                        <Form.Control required type="text" placeholder="MIN"/>
                      </Form.Group>

                      <Button className="orange-btn" id="create-token" onClick={(event) => deployContract(event)}> Create Token </Button>
                    
                    </Form>
                    </li>

                    <li> 

                    <h2> Step 3 </h2>
                      <p> Send 10 LINK token to your contract address {conAdd} </p>

                    </li>

                    <li>
                    <h2> Step 4 </h2>
                      <p> Initialise your contract </p>
                      <Button className="orange-btn" id="intialise-contract" onClick={intialiseContract}> Initialise Contract </Button>
                        <p> {mes} </p>


                    </li>

                    <li> 
                      <h2> Step 5 </h2>
                      <p> Share the link with your supporters! And, tell your contributors about their rewards for #OSS contributions</p>

                      <p> {message} </p>
                    </li>
                    </ul>
    </div>
  

     : <div> Login please </div> }
    </div>
   </div>
  )
}

export default Owner;