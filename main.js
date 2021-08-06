const text = document.querySelector(".text")
text.innerHTML = "<div>hello</div>"

const getKey = () => {
    // Routed request through Heroku server to avoid CORS issue
    return fetch(`https://limitless-citadel-23911.herokuapp.com/https://www.linkedin.com/oauth/v2/accessToken?grant_type=client_credentials&client_id=77q6pg2epuu8d5&client_secret=jYfEcxx2b76cLzln`)
        .then(res => res.json())
        .then(res => {
            console.log(res.access_token)
            fetch(`https://limitless-citadel-23911.herokuapp.com/https://api.linkedin.com/v2/learningActivityReports?q=criteria&count=10&startedAt=1562699900247&timeOffset.unit=DAY&timeOffset.duration=7&aggregationCriteria.primary=ACCOUNT`, {
                headers: {
                    "Authorization": `Bearer ${res.access_token}`
                }
            }
            ).then(res => res.json())
            .then(res => console.log(res))
        }
    )
}

getKey()