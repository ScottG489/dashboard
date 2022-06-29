import React, {useEffect, useState} from 'react'
import {RepoBuildInfo} from "../types";

let GitHubBuilds = () => {
    const [repoBuildInfos, setBuildInfos] = useState<RepoBuildInfo[]>([])
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        fetchGitHubBuildStatuses()
        const interval = setInterval(fetchGitHubBuildStatuses, 1800000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div>
            <div className="card-header">
                <h2 className="card-title text-center">Repo Build Status</h2>
            </div>
            <div className="card-body">
                {displayBadgeTable()}
            </div>

            <div className="card-footer text-muted">
                <form
                    onSubmit={async (event: React.FormEvent) => {
                        event.preventDefault()
                        await fetchGitHubBuildStatuses()
                    }}
                >
                    <button className="form-control btn-primary">{isLoading ? loading() : 'Refresh'}</button>
                </form>
            </div>
        </div>
    )

    function displayBadgeTable() {
        return <table className="table table-striped table-hover">
            <tbody>
                {displayBadges()}
            </tbody>
        </table>;
    }

    function displayBadges() {
        return repoBuildInfos.map(repoBuildInfo => {
            return (
                <tr key={repoBuildInfo.repoName}>
                    <td className="p-0">
                        <a href={repoBuildInfo.repoUrl} className="d-flex p-3 text-decoration-none">
                            <div>
                                <strong>{repoBuildInfo.repoName}</strong>
                            </div>
                        </a>
                    </td>
                    <td className="p-0">
                        <a href={repoBuildInfo.repoUrl} className="d-flex p-3">
                            <div>
                                <img src={repoBuildInfo.badgeUrl + "?" + repoBuildInfo.workflowRunConclusion}
                                     alt="github repo badge"/>
                            </div>
                        </a>
                    </td>
                </tr>
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
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        )
    }
};

export default GitHubBuilds
