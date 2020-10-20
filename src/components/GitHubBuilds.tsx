import React, {useEffect, useState} from 'react'

let GitHubBuilds = () => {
    const [badgeUrls, setBadgeUrls] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchDiffInfo()
    }, []);

    return (
        <div>
            {isLoading ? 'Loading badges...' : ''}
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
            setIsLoading(false)
        } catch (e) {
            console.log(`Failure fetching diff info with diff input: ${e.message}`)
        }
    }
};

export default GitHubBuilds
