import React, {useEffect, useState} from 'react'
import {RepoBadgeInfo} from "../types";
import './GitHubBuilds.css'

let GitHubBuilds = () => {
    const [repoBadgeInfos, setBadgeUrls] = useState<RepoBadgeInfo[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchDiffInfo()
    }, []);

    return (
        <div className="card-body">
            {isLoading ? loading() : ''}
            {displayBadges()}
        </div>
    )

    function displayBadges() {
        return repoBadgeInfos.map(repoBadgeInfo => {
            return (
                <div key={repoBadgeInfo.repoName} className={"row"}>
                    <div className={"col"}>
                        <h4>{repoBadgeInfo.repoName}</h4>
                    </div>
                    <div className={"col-auto my-auto"}>
                        <a href={repoBadgeInfo.repoUrl}>
                            <img src={repoBadgeInfo.badgeUrl} alt="github repo badge"/>
                        </a>
                    </div>
                </div>
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
            <div className="spinner-border" role="status">
                <span className="sr-only">Loading...</span>
            </div>
        )
    }
};

export default GitHubBuilds
