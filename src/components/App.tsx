import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'

import Example from "./Example";
import GitHubBuilds from "./GitHubBuilds";

let App = () => {
    return (
        <div className="App container">
            <div className="row justify-content-center">
                <div className="col-auto">
                    <pre>
                        {/*<Example/>*/}
                    </pre>
                </div>
                <div className="col-auto">
                    <GitHubBuilds />
                </div>
            </div>
        </div>
    )
}

export default App
