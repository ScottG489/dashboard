import React, {useEffect, useState} from 'react'
import config from "../config.conf";

const url = config.backendBaseUrl

let Example = () => {
    const [display, setDisplay] = useState('Loading...')

    useEffect(() => {
        makeRequest()
    }, []);

    return (
        <div>{display}</div>
    )

    async function makeRequest() {
        console.log('Sending request');
        const response = await fetch(
            url + '/build?image=library/hello-world:latest',
            {
                method: 'POST'
            });

        setDisplay(await response.text());
    }
};

export default Example
