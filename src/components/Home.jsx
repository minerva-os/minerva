import React, { useState } from "react";
import NavBar from './NavBar'
import Button from 'react-bootstrap/Button';


function App(props) {

    console.log(props.state);
    return (
        <div>
            <NavBar active="home" />
            <div className="container">
                {
                    props.state.loggedIn ?

                        <div>
                           <div className="home-content"> <h5> Logged In! </h5> </div> 
            </div> :

                        <div className="home-content">
                            <h2> Note : </h2>
                            <h5> Please note that we are only available on Kovan testnet for the time being </h5>
                            <form method="GET" action="https://github-auth.recurshawn.repl.co/login?option=owner">
                                <Button type="submit" className="orange-btn"> Sign in with GitHub </Button>
                            </form>
                        </div>
                }
            </div>
        </div>
    )
}

export default App;