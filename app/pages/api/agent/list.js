const fs = require('fs');
const uap = require('./parser');
export default (req, res) => {
    let rawdata = fs.readFileSync('useragents.json');
    var agents = JSON.parse(rawdata).aggregations.distinct_user_agents.buckets.map(e => e.key)
    console.log(agents)
    console.log(agents.length)
    res.status(200).json(agents);
};