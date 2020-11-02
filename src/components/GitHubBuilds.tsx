import React, {useEffect, useState} from 'react'
import {RepoBadgeInfo} from "../types";

let GitHubBuilds = () => {
    const [repoBadgeInfos, setBadgeUrls] = useState<RepoBadgeInfo[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchDiffInfo()
    }, []);

    return (
        <div className="card-body">
            <h1 className="card-title text-center">Repo Build Status</h1>
            {isLoading ? loading() : ''}
            <table className="table table-striped table-hover">
                <tbody>
                {displayBadges()}
                </tbody>
            </table>
        </div>
    )

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

    async function fetchDiffInfo() {
        try {
            const response = await fetch(
                'http://api.simple-ci.com/build?image=scottg489/gh-repo-build-status-job'
            )
            const badgeInfo: RepoBadgeInfo[] = await response.json()
            setBadgeUrls(badgeInfo)
            setIsLoading(false)
        } catch (e) {
            console.log(`Failure fetching diff info with diff input: ${e.message}`)
        }
    }

    function loading() {
        return (
            <div className="text-center">
                <div className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        )
    }
};

export default GitHubBuilds
