import React from 'react'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min.js'


import GitHubBuilds from "./GitHubBuilds";
import Mint from "./Mint";

let App = () => {
    return (
        <div className="App container">
            <div className="card-columns justify-content-center">
                <div className="card">
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
