import React from 'react';
import {createRoot} from "react-dom/client";
import './index.css';
import App from './components/App';
import * as serviceWorker from './serviceWorker';

const rootElement = document.getElementById('root')
// TODO: I believe this is necessary until Typescript types come out for react 18
if (!rootElement) throw new Error('Failed to find the root element')
const root = createRoot(rootElement)

root.render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
