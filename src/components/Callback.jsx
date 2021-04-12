import React, { useEffect, useState } from 'react';

import {Redirect} from "react-router-dom";

function App(props) {

    const [data, setData] = useState([]);

    useEffect(() => {
        // const params = new URLSearchParams(location.search);

        console.log(props.location.search);

        // let code = getParameterByName('code', location.search);

        fetch(`https://github-auth.recurshawn.repl.co/getData${props.location.search}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            // setData(data.repos);
            props.ownerHandler();
            props.handleGithubData(data.githubData, data.repos);
        } )
        .catch(err => console.log(err));
      }, []);


    return (
        <div>
            {
                props.state.owner ?  <Redirect to="/home" />  : <div> </div>
            }
        </div>
    )

}

export default App;