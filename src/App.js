import React, { Component } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import './Owner.css'

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar';
import Modal from 'react-bootstrap/Modal';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Image from 'react-bootstrap/Image';

import Home from "./components/Home";
import Sponsor from "./components/Sponsor";
import Contributor from "./components/Contributor";
import Callback from "./components/Callback";
import Owner from "./components/Owner";
import Minerva from './minerva-logo.png';
import Explanation from './minerva-explanation.gif';
import Commits from './gitcommits.png';
import Diagram from './diagram.png'
import Liquid from './components/Liquid';


class App extends Component {

  state = {
    owner: false,
    loggedIn: false,
    showLogInModal: false,
  }

  handler = () => {
    this.setState({
      owner: true,
      loggedIn: true
    })
  }

  handleGithubData = (userData, repoData) => {
    this.setState({
      userData: userData,
      repoData: repoData
    })
  }

  handleModalClose = () => {
    this.setState({ showLogInModal: false })
  }

  handleModalOpen = () => {
    this.setState({ showLogInModal: true })
  }
  render() {
    return (
      <div className="App">

        <Router>
          <Switch>
            <Route path="/" exact>
              <div className="landing-page">
                <Navbar expand="lg">
                  <Navbar.Brand className="shorten mr-auto" href="/"><img src={Minerva} width="200px" /></Navbar.Brand>
                  <Button onClick={this.handleModalOpen} className="orange-btn bold">Log In</Button>
                </Navbar>

                <div className="container">
                  <Modal show={this.state.showLogInModal} onHide={this.handleModalClose}>
                    <Modal.Header closeButton>
                      <Modal.Title>Log In</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Sign in with GitHub to use Minerva.</Modal.Body>
                    <Modal.Footer>
                      <Button variant="secondary" onClick={this.handleModalClose}>
                        Close
                    </Button>
                      
                        <Link to="/home">


                          <Button type="submit" className="orange-btn bold" onClick={this.handleModalClose}>
                            Sign In with GitHub
                    </Button>

                        </Link>
                    </Modal.Footer>
                  </Modal>

                  <Jumbotron className="jumbotron-transparent">

                    <h1 className="bold">Minerva</h1>
                    <p style={{ color: '#F8B101', fontWeight: 'bold' }}>Code. Contribute. Support.</p>
                    <h2 className="bold">Get rewarded for every open-source contribution</h2>
                    <br />
                    <Button onClick={this.handleModalOpen} className="orange-btn getStarted-btn bold">Get Started ➜</Button>
                    
                    {/* <Image className="gitcommits" src={Commits} /> */}
                  </Jumbotron>
                  <div className="gif-container">
                    <Image src={Explanation} fluid />
                  </div>
                  <br />
                  <h2 style={{ color: "#f8b101", fontWeight: 'bold' }}>Game Theory Overview</h2>
                  <div className="row">
                    <div className="col ">
                      <h3 className="overviewH3">Incentivising Contributors</h3>
                      <p>Minerva does this by letting sponsors directly fund the contributors of the project on platforms such as GitHub.</p>
                    </div>
                    <div className="col">
                      <h3 className="overviewH3">Incentivising Sponsors</h3>
                      <p>Sponsors get ERC-20 tokens for a particular repository after sponsoring it. This also promotes early sponsoring.</p>
                    </div>
                  </div>
                  <br />
                  <h2 style={{ color: "#f8b101", fontWeight: 'bold' }}>How It Works</h2>
                  <p>The idea here is to have a platform where anyone interested to support/sponsor a certain GitHub repository can contribute their part for building the project associated.
                    If a supporter/sponsor finds a repository which he/she/they think is useful, innovative or interesting and can be taken to another extent, they can fund the repository in form of stablecoins through the platform.</p>
                  <Image src={Diagram} className="image" />
                  <p>Now whenever the sponsor funds a repo, they get an ERC-20 token (associated with the repository) in return.
                  If a supporter/sponsor finds a repository which he/she/they think is useful, innovative or interesting and can be taken to another extent, they can fund the repository in form of stablecoins through the platform.
                  An X amount of percentage of ERC-20 tokens (associated with the repository) goes to the maintainer of the repository as their reward from this pool.
                  The rest goes to a pool which is used later to incentivize contributions to this repository, for the contributors.</p>
                </div>
                <br />
                <br />
              </div>

            </Route>

            <Route path="/home">
              <Home state={this.state} />
            </Route>


            <Route path="/owner">
              <Owner state={this.state} ownerData={this.ownerData} />
            </Route>

            <Route path="/sponsor/:repo_id" render={(props) => (
              <Sponsor {...props} state={this.state} />
            )} />

            <Route path="/contributor" render={(props) => (
              <Contributor {...props} state={this.state} />
            )} />

            <Route path={"/callback"} render={(props) => (
              <Callback {...props} ownerHandler={this.handler} handleGithubData={this.handleGithubData} state={this.state} />
            )} />
                    <Route path="/liquid/:repo_id" render={(props) => (
              <Liquid {...props} state={this.state} />
            )} />
            </Switch>



        </Router>

      </div>
    );
  }


}

export default App;