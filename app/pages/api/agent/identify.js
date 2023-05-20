var parser = require('./parser');

export default (req, res) => res.status(200).json(parser.deviceTypeAndName(unescape(req.url.split('?ua=')[1])))