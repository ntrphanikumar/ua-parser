var fs = require('fs');
var parser = require('node-uap');
export default (req, res) => {
    let rawdata = fs.readFileSync('useragents.json');
    let uadata = JSON.parse(rawdata).aggregations.distinct_user_agents.buckets;
    uadata = uadata.map(agent => {
        return {
            "agent": agent.key,
            "parsed_agent": parser.parse(unescape(agent.key))
        }
    })
	res.status(200).json(uadata);
};