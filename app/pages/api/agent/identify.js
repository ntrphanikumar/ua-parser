var parser = require('./parser');
var partner_suggestor = require('./partner_suggestor');

export default (req, res) => {
    let searchparams = new URLSearchParams(unescape(req.url.split('?')[1]))
    res.status(200).json({
        ...parser.deviceTypeAndName(searchparams.get('ua'), searchparams.get('partner')),
        ...{ suggestedPartner: partner_suggestor.suggest(searchparams.get('ua'), searchparams.get('partner')) }
    })
}