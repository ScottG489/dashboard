import React, {useEffect, useState} from 'react'
import {RepoBadgeInfo} from "../types";

let GitHubBuilds = () => {
    const [repoBadgeInfos, setBadgeUrls] = useState<RepoBadgeInfo[]>([])
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        fetchGitHubBuildStatuses()
        const interval = setInterval(fetchGitHubBuildStatuses, 60000);
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
        return repoBadgeInfos.map(repoBadgeInfo => {
            return (
                <tr key={repoBadgeInfo.repoName}>
                    <td className="p-0">
                        <a href={repoBadgeInfo.repoUrl} className="d-flex p-3 text-decoration-none">
                            <div>
                                <strong>{repoBadgeInfo.repoName}</strong>
                            </div>
                        </a>
                    </td>
                    <td className="p-0">
                        <a href={repoBadgeInfo.repoUrl} className="d-flex p-3">
                            <div>
                                <img src={repoBadgeInfo.badgeUrl} alt="github repo badge"/>
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
                'http://api.simple-ci.com/build?image=scottg489/gh-repo-build-status-job'
            )
            const badgeInfo: RepoBadgeInfo[] = await response.json()
            setBadgeUrls(badgeInfo)
        } catch (e) {
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
