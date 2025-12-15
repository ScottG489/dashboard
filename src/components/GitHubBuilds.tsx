import React, {useEffect, useState} from 'react'
import {RepoBuildInfo} from "../types";
import Button from '@mui/material/Button';
import {
    Card,
    CardActions,
    CardHeader,
    CardContent,
    List,
    ListItem,
    ListItemText,
    Stack,
    Link, Typography, Box,
} from "@mui/material";
import {keyframes} from "@emotion/react";
import {Refresh} from '@mui/icons-material';

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

let GitHubBuilds = () => {
    const [repoBuildInfos, setBuildInfos] = useState<RepoBuildInfo[]>([])
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        fetchGitHubBuildStatuses()
        const interval = setInterval(fetchGitHubBuildStatuses, 1800000);
        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Card>
            <CardHeader
                title={<Typography variant="h4">Repo Build Status</Typography>}
                style={{textAlign: 'center'}}
                sx={headerDisplay()}
            />
            <CardContent>
                {displayBadgeTable()}
            </CardContent>
            <CardActions>
                <Button variant="contained" onClick={fetchGitHubBuildStatuses} style={{width: '100%'}}>
                    {isLoading ? loading() : 'Refresh'}
                </Button>
            </CardActions>
        </Card>
    )

    function headerDisplay() {
        const headerQueryParam = new URLSearchParams(window.location.search).get("header")
        const shouldDisplayHeader = !(headerQueryParam === 'false');

        return shouldDisplayHeader ? {} : {display: 'none'};
    }

    function displayBadgeTable() {
        return <List>{displayBadges()}</List>;
    }

    function displayBadges() {
        return repoBuildInfos.map(repoBuildInfo => {
            return (
                <Link href={repoBuildInfo.repoUrl} key={repoBuildInfo.repoName} underline="hover">
                    <Stack direction="row"
                           justifyContent="space-between"
                           alignItems="center"
                           spacing={2} key={repoBuildInfo.repoName}>
                        <ListItem divider>
                            <ListItemText>
                                <Box sx={{fontWeight: 'bold'}}>
                                    {repoBuildInfo.repoName}
                                </Box>
                            </ListItemText>
                            {repoBuildInfo.conclusion === 'success' ? successSVG() : failureSVG()}
                        </ListItem>
                    </Stack>
                </Link>
            )
        })
    }

    async function fetchGitHubBuildStatuses() {
        setIsLoading(true)
        console.log('Fetching GitHub build statuses...')
        let pull = repoBuildInfos.length > 0 ? 'always' : 'absent';
        try {
            const response = await fetch(
                `https://api.conjob.io/job/run?image=scottg489/gh-repo-build-status-job:latest&pull=${pull}`
            )
            const buildInfo: RepoBuildInfo[] = await response.json()
            buildInfo.sort((a, b) =>
                a.conclusion.localeCompare(b.conclusion)
            )
            setBuildInfos(buildInfo)
        } catch (e: any) {
            console.log(`Failure fetching diff info with diff input: ${e.message}`)
        }
        setIsLoading(false)
    }

    function loading() {
        return (
            <Refresh sx={{
                animation: `${spin} 1s infinite linear`
            }}/>
        )
    }

    function successSVG() {
        return (
            <svg width="16" height="16" style={{fill: '#3fb950'}}>
                <path
                    d="M8 16A8 8 0 1 1 8 0a8 8 0 0 1 0 16Zm3.78-9.72a.751.751 0 0 0-.018-1.042.751.751 0 0 0-1.042-.018L6.75 9.19 5.28 7.72a.751.751 0 0 0-1.042.018.751.751 0 0 0-.018 1.042l2 2a.75.75 0 0 0 1.06 0Z"></path>
            </svg>
        )
    }
    function failureSVG() {
        return (
            <svg width="16" height="16" style={{fill: '#f85149'}}>
                <path
                    d="M2.343 13.657A8 8 0 1 1 13.658 2.343 8 8 0 0 1 2.343 13.657ZM6.03 4.97a.751.751 0 0 0-1.042.018.751.751 0 0 0-.018 1.042L6.94 8 4.97 9.97a.749.749 0 0 0 .326 1.275.749.749 0 0 0 .734-.215L8 9.06l1.97 1.97a.749.749 0 0 0 1.275-.326.749.749 0 0 0-.215-.734L9.06 8l1.97-1.97a.749.749 0 0 0-.326-1.275.749.749 0 0 0-.734.215L8 6.94Z"></path>
            </svg>
        )
    }
    function inProgressSVG() {
        return (
            <div style={{height: '16px', width: '16px'}}>
                <svg className="spin" width="100%" height="100%" fill="none"
                     viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                    <path fill="none" stroke="#d29922" stroke-width="2"
                          d="M3.05 3.05a7 7 0 1 1 9.9 9.9 7 7 0 0 1-9.9-9.9Z" opacity=".5"></path>
                    <path fill="#d29922" fill-rule="evenodd"
                          d="M8 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z" clip-rule="evenodd"></path>
                    <path fill="#d29922"
                          d="M14 8a6 6 0 0 0-6-6V0a8 8 0 0 1 8 8h-2Z"></path>
                </svg>
            </div>
        )
    }
};

export default GitHubBuilds
