
function suggest(userAgent, partner) {
    if(!userAgent) return partner
    const ua = userAgent.toLowerCase()
    if(ua.startsWith('dailyhunt')) return 'dailyhunt'
    return partner
}

module.exports = { suggest };