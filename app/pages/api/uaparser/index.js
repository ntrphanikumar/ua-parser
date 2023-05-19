var parser = require('ua-parser-js');
export default (req, res) => {
    var ua = parser(unescape(req.url.split('?ua=')[1]));
	res.status(200).json(ua);
};
