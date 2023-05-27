const fs = require('fs');
const parser = require('ua-parser-js');
const uap = require('node-uap');
const merge = require('deepmerge')
const Set = require("collections/set");

function deviceTypeAndName(userAgent, partner) {
    if (userAgent == '-') return {
        "deviceType": "Unknown",
        "deviceName": "Unknown"
    }
    let uapData = uap.parse(unescape(userAgent))
    let uaParserData = parser(unescape(userAgent))
    let deviceName = 'Unknown', deviceType = 'Unknown'
    // console.log(userAgent)
    // console.log("UAPData", uapData)
    // console.log("UAParserData", uaParserData)
    if (uaParserData.device.type == "smarttv") {
        deviceType = "Smart TV"
        if (uaParserData.device.vendor == "Apple") {
            deviceName = "Apple TV"
        } else if (uaParserData.device.model && uaParserData.device.model.startsWith("Chromecast")) {
            deviceName = "Chromecast"
        } else if (uaParserData.device.vendor == "Roku") {
            deviceName = "Roku"
        } else if (uaParserData.device.vendor == 'Amazon' && uapData.device.model.startsWith("AFT")) {
            deviceName = "Amazon Fire TV"
        } else if (uaParserData.device.vendor == 'Xiaomi' && uapData.device.model.startsWith("MiTV")) {
            deviceName = "Mi TV"
        } else if (uapData.device.brand == "Haier") {
            deviceType = "Smart TV"
            deviceName = "Haier TV"
        } else if (uapData.device.brand == "Philips") {
            deviceType = "Smart TV"
            deviceName = "Philips TV"
        } else if (uaParserData.device.vendor == 'Sony') {
            if (uaParserData.device.model.toUpperCase().startsWith("BRAVIA")) {
                deviceName = "Sony Bravia"
            } else {
                deviceName = "Sony " + uaParserData.device.model
            }
        } else if (uapData.device.brand && !uapData.device.brand.startsWith("Generic") && uapData.device.family) {
            if (uapData.device.family.indexOf(uapData.device.brand) == -1) {
                deviceName = uapData.device.brand + " " + uapData.device.family
            } else {
                deviceName = uapData.device.family
            }
        } else {
            deviceName = uapData.os.family + " TV"
        }
    } else if (uaParserData.device.type == "mobile") {
        deviceType = "Mobile Phone"
        if (uaParserData.device.vendor == "Apple") {
            deviceName = "Apple " + uaParserData.device.model
        } else if (uapData.device.model == "PANASONIC TV") {
            deviceType = "Smart TV"
            deviceName = "PANASONIC TV"
        } else if (uaParserData.device.vendor) {
            deviceName = uaParserData.device.vendor + " Phone"
        } else if (uapData.device.brand == "Generic_Android" || uapData.device.brand == "Generic") {
            if (uapData.device.model == "M2006C3MI") {
                deviceName = "Xiaomi Phone"
            } else if (uapData.device.model == "K") {
                deviceName = "K Phone"
            } else {
                deviceName = "Android Phone"
            }
        } else {
            deviceName = (uapData.device.brand || uaParserData.os.name) + " Phone"
        }
    } else if (uaParserData.device.type == "tablet") {
        deviceType = "Tablet"
        if (uaParserData.device.vendor == "Apple") {
            deviceName = "Apple iPad"
        } else if (uaParserData.device.vendor == "Amazon") {
            if (uaParserData.device.model == "KFMAWI") {
                deviceName = "Amazon Fire Tablet"
            } else if (uaParserData.device.model == "KFKAWI" || uaParserData.device.model == "KFAPWI") {
                deviceName = "Amazon Kindle"
            } else if (uapData.device.brand == "Generic_Android") {
                deviceName = "Amazon Android Tablet"
            } else {
                deviceName = "Amazon " + uaParserData.os.name + " Tablet"
            }
        } else if (uaParserData.device.vendor == "Samsung") {
            deviceName = uaParserData.device.vendor + " Phone"
        } else {
            deviceName = uaParserData.os.name + " Phone"
        }
    } else if (uaParserData.device.type == "wearable" || uaParserData.device.type == "console") {
        deviceType = "Other"
        deviceName = uaParserData.device.vendor + " " + uaParserData.device.model
    } else if (!uaParserData.device.type && uaParserData.cpu.architecture) {
        deviceType = "Computer"
        deviceName = (uapData.os.family == "Ubuntu" ? "Linux" : uapData.os.family) + " Computer"
    } else {
        if (!uapData.device.model) {
            if (userAgent.indexOf('TV Store') > -1) {
                deviceType = "Smart TV"
                deviceName = uapData.os.family + " TV"
            } else if (uapData.device.family == "Other" && uapData.os.family != "Other") {
                deviceType = "Computer"
                deviceName = uapData.os.family + " Computer"
            } else if (uapData.os.family == "Other") {
                if (userAgent.indexOf("AirPlay") > -1) {
                    deviceType = "Smart TV"
                    deviceName = "Apple AirPlay"
                } else {
                    deviceType = "Other"
                    deviceName = uapData.device.family
                }
            } else {
                deviceType = "Other"
                deviceName = unescape(uapData.ua.family)
            }
        } else if (uapData.device.model == "iOS-Device") {
            deviceType = "Mobile Phone"
            deviceName = "Apple iPhone"
        } else if (uapData.device.model == "Mac") {
            deviceType = "Computer"
            deviceName = "Apple Mac"
        } else if (uapData.device.model.startsWith("AFT")) {
            deviceType = "Smart TV"
            deviceName = "Amazon Fire TV"
        } else if (uapData.device.model.startsWith("MIBOX")) {
            deviceType = "Smart TV"
            deviceName = "Mi Box"
        } else if (uapData.device.model.startsWith("MiTV")) {
            deviceType = "Smart TV"
            deviceName = "Mi TV"
        } else if (uapData.device.model.startsWith("Chromecast")) {
            deviceType = "Smart TV"
            deviceName = "Chromecast"
        } else if (uapData.device.model.startsWith("SWTV")) {
            deviceType = "Smart TV"
            deviceName = "Skyworth TV"
        } else if (uapData.device.model.startsWith("Y Series") || uapData.device.model == "Oneplus_Dosa_IN") {
            deviceType = "Smart TV"
            deviceName = "OnePlus TV"
        } else if (uapData.device.model == "haierATVnippori") {
            deviceType = "Smart TV"
            deviceName = "Haier TV"
        } else if (uapData.device.model == "PATH_7XPRO") {
            deviceType = "Smart TV"
            deviceName = "Kodak TV"
        } else if (uapData.device.model == "UnionTV") {
            deviceType = "Smart TV"
            deviceName = "UnionTV"
        } else if (uapData.device.model == "TPM191E") {
            deviceType = "Smart TV"
            deviceName = "Philips TV"
        } else if (userAgent.indexOf('ExoPlayerLib') > -1 && userAgent.indexOf('VideoPlayerGlue') > -1) {
            deviceType = "Smart TV"
            deviceName = partner == 'CW' ? "Cloud TV":"Android TV"
        } else if (uapData.device.model == "Smartphone") {
            deviceType = "Mobile Phone"
            deviceName = uapData.os.family + " Phone"
        } else if (userAgent.indexOf("AndroidTV") > -1) {
            deviceType = "Smart TV"
            if (uapData.device.model == "SMART_TV" || uaParserData.device.vendor == "Generic") {
                deviceName = uaParserData.os.name + " TV"
            } else {
                deviceName = uapData.device.model + (uapData.device.model.toUpperCase().indexOf("TV") > -1 ? "" : " TV")
            }
        } else if (userAgent.indexOf("AndroidMobile") > -1) {
            deviceType = "Mobile Phone"
            deviceName = uapData.os.family + " Phone"
        } else if (userAgent.indexOf("CloudWalker") > -1) {
            deviceType = "Smart TV"
            deviceName = "Cloud TV"
        } else if (userAgent.indexOf("ScopeBox") > -1) {
            deviceType = "Smart TV"
            deviceName = "Scope Box"
        } else if (uapData.device.family && uapData.device.family.startsWith("CloudTV")) {
            deviceType = "Smart TV"
            deviceName = "Cloud TV"
        } else if (uapData.device.model == "Desktop") {
            deviceType = "Computer"
            deviceName = unescape(uapData.os.family)
        } else if (uapData.device.family && uapData.device.family.indexOf("AOSP TV") > -1) {
            deviceType = "Smart TV"
            deviceName = "Android TV"
        } else if (uapData.device.family && uapData.device.family.indexOf("XStream_Smart_Box") > -1) {
            deviceType = "Smart TV"
            deviceName = "Airtel XStream Box"
        } else if (userAgent.indexOf("FetchTV") > -1) {
            deviceType = "IP TV"
            deviceName = "Fetch TV"
        } else if (uapData.device.brand == "OnePlus") {
            deviceType = "Mobile Phone"
            deviceName = "OnePlus Phone"
        } else if (uapData.os.family == "Android" && uapData.device.brand == "Generic_Android") {
            deviceType = "Mobile Phone"
            deviceName = "Android Phone"
        } else if (uapData.os.family == "Android" && uapData.device.brand == "Google") {
            deviceType = "Mobile Phone"
            deviceName = uapData.device.brand + " Phone"
        } else if (uapData.os.family == "Other" && uapData.device.model == "Feature Phone") {
            deviceType = "Mobile Phone"
            deviceName = "Feature Phone"
        } else if ((uaParserData.browser.name || unescape(uapData.ua.family)) != "Other") {
            deviceType = "Other"
            deviceName = uaParserData.browser.name || unescape(uapData.ua.family)
        }
    }
    return {
        "agent": userAgent,
        "deviceType": deviceType,
        "deviceName": deviceName
    }
}

module.exports = { deviceTypeAndName };