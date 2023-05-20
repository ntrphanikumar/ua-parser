const fs = require('fs');
const uap = require('./parser');
export default (req, res) => {
    let rawdata = fs.readFileSync('useragents.json');
    var agents = JSON.parse(rawdata).aggregations.distinct_user_agents.buckets.map(e => unescape(e.key)).map(agent => uap.deviceTypeAndName(agent))
    var processedDeviceNames = ["Samsung Phone", "Amazon Fire TV", "Apple TV", "Web0S TV", "Mi Box", "Roku", "Chromecast", "C00 TV", "UnionTV","Apple iPad","Sony Bravia", "Mi TV","D00 TV","Apple iPhone","Skyworth TV","OnePlus TV","Haier TV","BeyondTV","HiSmartTV A4","LG Web0S SmartTV","TCL HbbTV","Kodak TV","Sony Phone","K Phone","Motorola Phone","AI PONT TV","Kogan TV", "Lenovo Phone","Cloud TV","OnePlus Phone", "OPPO Phone","Vivo Phone","PANASONIC TV","Huawei Phone","Philips TV","Scope Box","Oppo Phone","Amazon Fire Tablet", "Linux TV","Xiaomi Phone","Nokia Phone","Amazon Kindle","ASUS Phone","Realme Phone","LG NetCast","Google Phone","LG Phone","Infinix Phone", "Samsung SMART-TV","SERAPHIC HbbTV","Itel Phone","Amazon Android Tablet","Panasonic Phone","Sharp Phone","Tecno Phone","LYF Phone","POLYTRON Phone", "Windows Computer", "Linux Computer","Chrome OS Computer","Apple Mac", "Other", "Apple AirPlay","Android TV","Android Phone","Fetch TV","meizu Phone","ZTE Phone","HTC Phone","Sony PlayStation 4","Other Computer","Facebook quest","Intex AQUA Android TV 2K","Sharp SHARP 2K SMART TV","Lava Iris 2K SmartTV","Lava Iris 4K Android TV","Intex AQUA Android TV DVB2K", "Karbonn Smart TV","Airtel XStream Box","Feature Phone"]


    var devicesToRevisit = []
    agents = agents.filter(agent => !processedDeviceNames.includes(agent.deviceName) && !devicesToRevisit.includes(agent.deviceName))
    console.log(agents)
    res.status(200).json(agents);
};