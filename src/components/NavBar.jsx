import React, {useState} from "react";
import Navbar from 'react-bootstrap/Navbar';
import Image from 'react-bootstrap/Image'
import Minerva from '../minerva-logo.png';

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";

function NavBar (props) {

    return(
      <Navbar expand="lg" className="navbar">
        <div className="container">
            <Navbar.Brand width="200px"  href="/home"><Image src={Minerva} width="200px"/></Navbar.Brand>
            <Link to="/home" className={`nav-link ${props.active==="home" && "active"}`}> Home </Link>
            <Link to="/owner" className={`nav-link ${props.active==="owner" && "active"}`}> Owner </Link>
            <Link to="/contributor" className={`nav-link ${props.active==="contributor" && "active"}`}> Contributor </Link>
            <Link to="/liquid" className={`nav-link ${props.active==="liquid" && "active"}`}> Liquidity </Link>
            <div className="ml-1 mr-2 metamask-status">{props.metamaskStatus ? <div style={{color : "#9AD3A3"}}> Connected </div> : <div style={{color : "red"}}> Not Connected </div> }</div>
        </div>
      </Navbar>
    );

}

export default NavBar;