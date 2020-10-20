import React, {useEffect, useState} from 'react'

let GitHubBuilds = () => {
    const [badgeUrls, setBadgeUrls] = useState<string[]>([])

    useEffect(() => {
        fetchDiffInfo()
    }, []);

    return (
        <div>
            {displayBadges()}
        </div>
    )

    function displayBadges() {
        return badgeUrls.map(badgeUrl => {
            return (
                <div>
                    <img src={badgeUrl} alt="github repo badge"/>
                </div>
            )
        })
    }

    async function fetchDiffInfo() {
        try {
            const response = await fetch(
                'http://api.simple-ci.com/build?image=scottg489/gh-repo-build-status-job'
            )
            const badges: string[] = await response.json()
            setBadgeUrls(badges)
        } catch (e) {
            console.log(`Failure fetching diff info with diff input: ${e.message}`)
        }
    }
};

export default GitHubBuilds
