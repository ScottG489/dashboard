import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'

import GitHubBuilds from "./GitHubBuilds";

let App = () => {
    return (
        <div className="App container">
            <div className="row justify-content-center">
                <div className="col-auto card">
                    <GitHubBuilds />
                </div>
            </div>
        </div>
    )
}

export default App
