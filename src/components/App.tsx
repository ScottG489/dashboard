import React from 'react'
import {ThemeProvider, createTheme} from '@mui/material/styles';
import GitHubBuilds from "./GitHubBuilds";
import Container from "@mui/material/Container";
import {CssBaseline} from "@mui/material";

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

let App = () => {
    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <Container>
                <GitHubBuilds/>
            </Container>
        </ThemeProvider>
    )
}

export default App
