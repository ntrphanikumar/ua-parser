var parser = require('./parser');

export default (req, res) => {
    let searchparams = new URLSearchParams(unescape(req.url.split('?')[1]))
    res.status(200).json(parser.deviceTypeAndName(searchparams.get('ua'), searchparams.get('partner')))
}