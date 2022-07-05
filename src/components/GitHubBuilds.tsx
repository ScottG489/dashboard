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
    Link, Typography,
} from "@mui/material";

let GitHubBuilds = () => {
    const [repoBuildInfos, setBuildInfos] = useState<RepoBuildInfo[]>([])
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        fetchGitHubBuildStatuses()
        const interval = setInterval(fetchGitHubBuildStatuses, 1800000);
        return () => clearInterval(interval);
    }, []);

    return (
        <Card>
            <CardHeader
                title={<Typography variant="h4">Repo Build Status</Typography>}
                style={{textAlign: 'center'}}/>
            <CardContent>
                {displayBadgeTable()}
            </CardContent>
            <CardActions>
                <Button variant="contained" onClick={fetchGitHubBuildStatuses}>
                    {isLoading ? loading() : 'Refresh'}
                </Button>
            </CardActions>
        </Card>
    )

    function displayBadgeTable() {
        return <List>{displayBadges()}</List>;
    }

    function displayBadges() {
        return repoBuildInfos.map(repoBuildInfo => {
            return (
                <Link href={repoBuildInfo.repoUrl} key={repoBuildInfo.repoName}>
                    <Stack direction="row"
                           justifyContent="space-between"
                           alignItems="center"
                           spacing={2} key={repoBuildInfo.repoName}>
                        <ListItem divider>
                            <ListItemText>
                                {repoBuildInfo.repoName}
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
        try {
            const response = await fetch(
                'https://api.conjob.io/job/run?image=scottg489/gh-repo-build-status-job:latest&pull=absent'
            )
            const buildInfo: RepoBuildInfo[] = await response.json()
            setBuildInfos(buildInfo)
        } catch (e: any) {
            console.log(`Failure fetching diff info with diff input: ${e.message}`)
        }
        setIsLoading(false)
    }

    function loading() {
        return (
            <div className="text-center">
                <div className="spinner-border spinner-border-sm" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        )
    }
};

export default GitHubBuilds
