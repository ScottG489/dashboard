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
                            <img src={repoBuildInfo.badgeUrl + "?" + repoBuildInfo.workflowRunConclusion}
                                 alt="github repo badge"/>
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
                a.workflowRunConclusion.localeCompare(b.workflowRunConclusion)
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
};

export default GitHubBuilds
