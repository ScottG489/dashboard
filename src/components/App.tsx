import React from 'react'
import {ThemeProvider, createTheme} from '@mui/material/styles';
import GitHubBuilds from "./GitHubBuilds";
import Container from "@mui/material/Container";

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

let App = () => {
    return (
        <ThemeProvider theme={darkTheme}>
            <Container>
                <GitHubBuilds/>
            </Container>
        </ThemeProvider>
    )
}

export default App
