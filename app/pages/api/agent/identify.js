var fs = require('fs');
var parser = require('ua-parser-js');
var uap = require('node-uap');
var merge = require('deepmerge')
var Set = require("collections/set");
export default (req, res) => {
    var userAgent = unescape(req.url.split('?ua=')[1]);
    var deviceType = "Unknown"
    var deviceName = "Unknown"
    if (userAgent != "-") {
        let uapData = uap.parse(unescape(userAgent))
        let uaParserData = parser(unescape(userAgent))
        console.log(uapData)
        console.log(uaParserData)
        if (uaParserData.device.type == "smarttv") {
            deviceType = "Smart TV"
            if (uaParserData.device.vendor == 'Amazon' && uapData.device.family == 'AFTA') {
                deviceName = "Amazon Fire TV"
            } else if (uaParserData.os.version == "TV") {
                deviceName = uaParserData.os.name + " TV"
            } else {
                deviceName = uaParserData.device.model
            }
        } else if (uaParserData.device.type == "mobile") {
            deviceType = "Mobile Phone"
            if (uaParserData.device.vendor == "Apple") {
                deviceName = uaParserData.device.vendor + " " + uaParserData.device.model
            } else if (uapData.device.model == "PANASONIC TV") {
                deviceType = "Smart TV"
                deviceName = "PANASONIC TV"
            } else if (uaParserData.device.vendor) {
                deviceName = uaParserData.device.vendor + " Phone"
            } else if (uapData.device.brand == "Generic_Android") {
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
        } else if (uaParserData.device.type == "wearable") {
            deviceType = "Wearable"
            deviceName = uaParserData.device.vendor
        } else {
            if (!uapData.device.model) {
                deviceType = "sadasdsa"
                deviceName = uaParserData.browser.name || unescape(uapData.ua.family)
            } else if (uapData.device.model.startsWith("AFT")) {
                deviceType = "Smart TV"
                deviceName = "Amazon Fire TV"
            } else if (uapData.device.model.startsWith("MIBOX")) {
                deviceType = "Smart TV"
                deviceName = "MI Box"
            } else if (uapData.device.model.startsWith("MiTV")) {
                deviceType = "Smart TV"
                deviceName = "MI TV"
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
            } else if (uapData.device.model == "TPM191E") {
                deviceType = "Smart TV"
                deviceName = "Philips TV"
            } else if (uapData.device.model == "Smartphone") {
                deviceType = "Mobile Phone"
                deviceName = uaParserData.os.name + " Phone"
            } else if (userAgent.indexOf("AndroidTV") > -1) {
                deviceType = "Smart TV"
                deviceName = uapData.device.model + (uapData.device.model.toUpperCase().indexOf("TV") > -1 ? "" : " TV")
            } else if ((uaParserData.browser.name || unescape(uapData.ua.family)) != "Other") {
                deviceName = uaParserData.browser.name || unescape(uapData.ua.family)
            }
        }
    }
    res.status(200).json({
        "deviceType": deviceType,
        "deviceName": deviceName
    });
};