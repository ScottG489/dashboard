import React, {useState} from 'react'

let Mint = () => {
    const [creditScore, setCreditScore] = useState('')
    const [credentials, setCredentials] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    let creditScoreTab: any

    return (
        <div>
            <div className="card-header">
                <h2 className="card-title text-center">Mint</h2>
                <ul className="nav nav-tabs" id="myTab" role="tablist">
                    <li className="nav-item">
                        <a ref={input => creditScoreTab = input} className="nav-link active" id="mint-credit-score-tab"
                           data-toggle="tab" href="#mint-credit-score" role="tab" aria-controls="mint-credit-score"
                           aria-selected="true">
                            Credit Score
                        </a>
                    </li>
                    <li className="nav-item">
                        <a
                            className="nav-link" id="mint-credit-score-creds-tab" data-toggle="tab"
                            href="#mint-credit-score-creds" role="tab" aria-controls="mint-credit-score-creds"
                            aria-selected="false">
                            Credentials
                        </a>
                    </li>
                </ul>
            </div>

            <div className="card-body">
                <div className="tab-content" id="myTabContent">
                    <div className="tab-pane fade show active text-center" id="mint-credit-score" role="tabpanel"
                         aria-labelledby="mint-credit-score-tab">
                        {isLoading ? loading() : ''}
                        <span className="lead font-weight-bold">{creditScore}</span>
                    </div>
                    <div className="tab-pane fade" id="mint-credit-score-creds" role="tabpanel"
                         aria-labelledby="mint-credit-score-creds-tab">
                        <form
                            onSubmit={async (event: React.FormEvent) => {
                                event.preventDefault()
                                await fetchCreditScore()
                            }}
                        >
                            <div className="form-group">
                                <div className="form-group">
                                    <input type="password" className="form-control" id="mint-credit"
                                           placeholder="Enter credentials"
                                           value={credentials}
                                           onChange={(event) => {
                                               setCredentials(event.target.value)
                                           }}
                                    />
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <div className="card-footer text-muted">
                <form
                    onSubmit={async (event: React.FormEvent) => {
                        event.preventDefault()
                        await fetchCreditScore()
                    }}
                >
                    <button className="form-control btn-primary">Refresh</button>
                </form>
            </div>
        </div>
    )

    async function fetchCreditScore() {
        setIsLoading(true)
        creditScoreTab.click();
        console.log('Fetching mint credit score...')
        const body = {
            "UNLOCK_SECRETS_CREDENTIALS": credentials
        }
        try {
            const response = await fetch(
                'http://api.conjob.io/job/run?image=scottg489/mint-api-query-job',
                {
                    method: 'POST',
                    body: JSON.stringify(body),
                },
            )
            const creditScore = await response.json()
            setCreditScore(creditScore)
        } catch (e) {
            console.log(`Failure fetching diff info with diff input: ${e.message}`)
        }
        setIsLoading(false)
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

export default Mint
