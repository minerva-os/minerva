import React, { useState } from "react";
import NavBar from './NavBar'

function App(props) {

    console.log(props.state);
    return (
        <div>
            <NavBar active="home" />
            <div className="container">
                {
                    props.state.loggedIn ?

                        <div>
                            Logged In!
            </div> :

                        <div>
                            <form method="GET" action="https://github-auth.recurshawn.repl.co/login?option=owner">
                                <button type="submit" > Sign in with GitHub </button>
                            </form>
                        </div>
                }
            </div>
        </div>
    )
}

export default App;