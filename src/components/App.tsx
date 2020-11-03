import React from 'react'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min.js'


import GitHubBuilds from "./GitHubBuilds";
import Mint from "./Mint";

let App = () => {
    return (
        <div className="App container">
            <div className="row justify-content-center">
                <div className="col-auto card">
                    <GitHubBuilds />
                </div>
                <div className="card">
                    <Mint />
                </div>
            </div>
        </div>
    )
}

export default App
