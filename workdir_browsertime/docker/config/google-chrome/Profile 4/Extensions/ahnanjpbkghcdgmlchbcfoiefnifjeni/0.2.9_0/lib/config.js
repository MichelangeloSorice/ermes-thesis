var config = {}, CBN = {};

var configSettingsObject = {
    "CSP": true,
    "WRB": false,
    "HOME": true,
    "BADGE": true,
    "itemURL": '',
    "CONSOLE": false,
    "INCLUSIVE": true,
    "state": "enable",
    "EXCLUSIVE": false,
    "whitelistR": ['', '', '', '', ''],
    "blacklistR": ['', '', '', '', ''],
    "mode": ["selected", '', '', '', ''],
    "address": ["all", "all", "all", "all", "all"],
    "arr": ["script", "style", "image", "object", "media"],
    "apply": ["domain", "domain", "domain", "domain", "domain"],
    "match": ["wildcard", "wildcard", "wildcard", "wildcard", "wildcard"],
    "whiteList": [
        "https://hotmail.com", "https://github.com", "https://live.com",
        "http://www.ebay.com", "http://www.bing.com", "http://www.apple.com",
        "https://www.yahoo.com", "http://www.amazon.com", "https://twitter.com",
        "https://instagram.com", "https://www.chase.com", "https://www.paypal.com",
        "http://store.apple.com", "https://www.icloud.com", "https://www.google.com",
        "https://login.live.com", "https://mail.google.com", "https://login.yahoo.com",
        "https://www.mozilla.org", "https://www.youtube.com", "https://mail.yahoo.com",
        "https://www.facebook.com", "https://addons.opera.com", "https://plus.google.com",
        "https://accounts.google.com", "https://addons.mozilla.org", "http://mybrowseraddon.com",
        "https://chrome.google.com", "https://translate.google.com", "https://www.bankofamerica.com"
    ]
};

var WHITELIST = configSettingsObject.whiteList.join(' | ');

config.welcome = {
    get open() {
        return config.settings.object.HOME
    },
    get version() {
        return app.storage.read("version")
    },
    set version(val) {
        app.storage.write("version", val)
    }
};

config.init = function () {
    var _tmp = app.storage.read('noscript-object');
    if (_tmp) {
        var obj = JSON.parse(_tmp);
        configSettingsObject = obj;
        WHITELIST = configSettingsObject.whiteList.join(' | ');
    } else {
        var flag = navigator.userAgent.toLowerCase().indexOf('firefox') !== -1;
        if (flag) configSettingsObject.HOME = false;
    }
};

config.settings = {
    get whiteList() {
        return WHITELIST
    },
    get object() {
        return configSettingsObject
    },
    set object(o) {
        configSettingsObject = o;
        WHITELIST = o.whiteList.join(' | ');
        app.storage.write('noscript-object', JSON.stringify(o));
    }
};

config.hostname = function (url) {
    var s = url.indexOf("//") + 2;
    if (s > 1) {
        var o = url.indexOf('/', s);
        if (o > 0) return url.substring(s, o);
        else {
            o = url.indexOf('?', s);
            if (o > 0) return url.substring(s, o);
            else return url.substring(s);
        }
    } else return url;
};

config.badge = {
    set number(o) {
        CBN = o
    },
    get number() {
        return CBN
    },
    "update": function (top, reset) {
        var tmp = config.badge.number;
        tmp[top] = reset ? 0 : (tmp[top] || 0) + 1;
        config.badge.number = tmp;
        app.addon.send("update-badge");
    }
};

config.address = {
    "validate": function (top) {
        var key = config.hostname(top);
        return config.settings.whiteList.indexOf(key) === -1;
    },
    "thirdparty": function (top, url) {
        var topDomain = config.hostname(top);
        var currentDomain = config.hostname(url);
        return currentDomain !== topDomain;
    }
};

config.webRequest = function (method, top, url, type) {
    var CSP = '';
    if (config.address.validate(top)) {
        for (var i = 0; i < config.settings.object.mode.length; i++) {
            if (config.settings.object.mode[i] === "selected") {
                var flag1 = (config.settings.object.apply[i] === 'frame') ? (type === 'sub_frame') : true;
                var flag2 = (config.settings.object.address[i] === 'thirdparty') ? config.address.thirdparty(top, url) : true;
                /*  */
                var whitelistR = config.settings.object.whitelistR[i];
                var blacklistR = config.settings.object.blacklistR[i];
                var whitelisted = whitelistR ? (new RegExp(whitelistR)).test(url) : false;
                var blacklisted = blacklistR ? (new RegExp(blacklistR)).test(url) : false;
                /*  */
                if (config.settings.object.EXCLUSIVE) {
                    if (method === "CSP") {
                        if (config.settings.object.CONSOLE) {
                            console.error("Content Security Policy :: Please use Inclusive mode from the settings page. Note: CSP is an inclusive method. Or, switch to Web Request Observer method, if you need Exclusive mode.");
                        }
                    } else if (blacklisted) {
                        if (flag1 && flag2) {
                            if (method === "WRB") {
                                if (type.indexOf(config.settings.object.arr[i]) !== -1) {
                                    config.badge.update(top, false);
                                    if (config.settings.object.CONSOLE) {
                                        var _rule, _tmp = (new RegExp(blacklistR)).exec(url);
                                        if (_tmp && _tmp.length) _rule = _tmp[0];
                                        console.error("Web Request Observer ::", "Exclusive Mode >>", "BlackList RULE >>", _rule, " TYPE >>", type, " URL >>", url);
                                    }
                                    return true;
                                }
                            }
                        }
                    }
                } else {
                    if (!whitelisted) {
                        if ((flag1 && flag2) || (blacklisted)) {
                            if (method === "WRB") {
                                if (type.indexOf(config.settings.object.arr[i]) !== -1) {
                                    config.badge.update(top, false);
                                    if (config.settings.object.CONSOLE) {
                                        console.error("Web Request Observer ::", "Inclusive Mode >>", "TYPE >>", type, " URL >>", url);
                                    }
                                    return true;
                                }
                            }
                            if (method === "CSP") {
                                config.badge.update(top, false);
                                var value = ["script-src 'none'", "style-src 'none'", "img-src 'none'", "object-src 'none'", "media-src 'none'"];
                                CSP += value[i] + "; ";
                            }
                        }
                    } else {
                        if (config.settings.object.CONSOLE) {
                            var _rule, _tmp = (new RegExp(whitelistR)).exec(url);
                            if (_tmp && _tmp.length) _rule = _tmp[0];
                            console.error("Web Request Observer ::", "Inclusive Mode >>", "WhiteList RULE >>", _rule, " TYPE >>", type, " URL >>", url);
                        }
                    }
                }
            }
        }
    }
    /*  */
    if (method === "WRB") return false;
    if (method === "CSP") {
        if (config.settings.object.CONSOLE && CSP) console.error("Content Security Policy ::", "Inclusive Mode >>", "POLICY >>", CSP);
        return CSP;
    }
};

config.get = function (name) {
    return name.split('.').reduce(function (p, c) {
        return p[c]
    }, config)
};

config.set = function (name, value) {
    function set(name, value, scope) {
        name = name.split('.');
        if (name.length > 1) set.call((scope || this)[name.shift()], name.join('.'), value);
        else this[name[0]] = value;
    }

    set(name, value, config);
};
