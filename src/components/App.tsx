import React from 'react'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min.js'


import GitHubBuilds from "./GitHubBuilds";

let App = () => {
    return (
        <div className="App container">
            <div className="card-columns justify-content-center">
                <div className="card">
                    <GitHubBuilds />
                </div>
            </div>
        </div>
    )
}

export default App
