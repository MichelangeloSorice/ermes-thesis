var app = {};

app.tabsObject = {};
app.loadReason = "startup";
app.reload = function () {
    chrome.runtime.reload()
};
app.version = function () {
    return chrome.runtime.getManifest().version
};
app.homepage = function () {
    return chrome.runtime.getManifest().homepage_url
};
app.toolbarIcon = function (e) {
    chrome.browserAction.setIcon({"path": "../../data/icons/32-" + e + ".png"})
};
if (chrome.runtime.onInstalled) chrome.runtime.onInstalled.addListener(function (e) {
    app.loadReason = e.reason
});
if (chrome.runtime.setUninstallURL) chrome.runtime.setUninstallURL(app.homepage() + "?v=" + app.version() + "&type=uninstall", function () {
});

var onUpdated, onActivated;
var onRemovedListener = function (tabId) {
    delete app.tabsObject[tabId]
};
var onCreatedListener = function (tab) {
    if (tab) app.tabsObject[tab.id] = tab
};

var onUpdatedListener = function (tabId, changeInfo, tab) {
    if (tab) {
        app.tabsObject[tab.id] = tab;
        if (onUpdated && changeInfo.status === "loading") onUpdated(tab);
    }
};

var onActivatedListener = function (e) {
    if (e && e.tabId) {
        chrome.tabs.get(e.tabId, function (tab) {
            if (tab) {
                app.tabsObject[tab.id] = tab;
                if (onActivated) onActivated(tab);
            }
        });
    }
};

var load = function (e) {
    var urls = ['http://', 'https://', 'ftp://'], types = ["main_frame", "sub_frame"];
    chrome.webRequest.onBeforeRequest.removeListener(onBeforeRequest, {"urls": urls}, ["blocking"]);
    chrome.webRequest.onHeadersReceived.removeListener(onHeadersReceived, {"urls": urls}, ["blocking", "responseHeaders"]);
    for (var i = 0; i < config.settings.object.mode.length; i++) if (config.settings.object.mode[i] === "selected") types.push(config.settings.object.arr[i]);
    /*  */
    var flag_WRB = config.settings.object.WRB && config.settings.object.state === "enable";
    var flag_CSP = config.settings.object.CSP && config.settings.object.state === "enable";
    /*  */
    if (flag_WRB) chrome.webRequest.onBeforeRequest.addListener(onBeforeRequest, {
        "urls": ['<all_urls>'],
        "types": types
    }, ["blocking"]);
    if (flag_CSP) chrome.webRequest.onHeadersReceived.addListener(onHeadersReceived, {
        "urls": ['<all_urls>'],
        "types": ["main_frame", "sub_frame"]
    }, ["blocking", "responseHeaders"]);
};

app.storage = (function () {
    var objs = {};
    window.setTimeout(function () {
        chrome.storage.local.get(null, function (o) {
            objs = o;
            config.init();
            window.setTimeout(load, 300);
            var script = document.createElement("script");
            script.src = "../common.js";
            document.body.appendChild(script);
        });
    }, 300);
    /*  */
    return {
        "read": function (id) {
            return objs[id]
        },
        "clear": function (callback) {
            chrome.storage.local.clear(callback)
        },
        "write": function (id, data) {
            var tmp = {};
            tmp[id] = data;
            objs[id] = data;
            chrome.storage.local.set(tmp, function () {
            });
        }
    }
})();

app.button = (function () {
    var callback;
    chrome.browserAction.onClicked.addListener(function () {
        if (callback) callback()
    });
    /*  */
    return {
        "onCommand": function (c) {
            callback = c
        },
        set label(val) {
            chrome.browserAction.setTitle({"title": val})
        },
        set badge(val) {
            chrome.browserAction.setBadgeText({"text": (val ? val : '') + ''})
        }
    }
})();

app.tab = {
    "onUpdated": function (callback) {
        onUpdated = callback
    },
    "onActivated": function (callback) {
        onActivated = callback
    },
    "open": function (url) {
        chrome.tabs.create({"url": url, "active": true})
    },
    "openOptions": function () {
        chrome.runtime.openOptionsPage(function () {
        })
    },
    "getActive": function (callback) {
        chrome.tabs.query({"currentWindow": true, "active": true}, function (e) {
            if (e && e.length) callback(e[0])
        })
    }
};

app.addon = (function () {
    var callbacks = {};
    return {
        "send": function (id, data) {
            (callbacks[id] || []).forEach(function (c) {
                c(data)
            })
        },
        "receive": function (id, callback) {
            callbacks[id] = callbacks[id] || [];
            callbacks[id].push(callback);
        }
    }
})();

app.popup = (function () {
    var _tmp = {};
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        for (var id in _tmp) {
            if (_tmp[id] && (typeof _tmp[id] === "function")) {
                if (request.path === 'popup-to-background') {
                    if (request.method === id) _tmp[id](request.data);
                }
            }
        }
    });
    /*  */
    return {
        "receive": function (id, callback) {
            _tmp[id] = callback
        },
        "send": function (id, data, tabId) {
            chrome.runtime.sendMessage({"path": 'background-to-popup', "method": id, "data": data});
        }
    }
})();

app.options = (function () {
    var _tmp = {};
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        for (var id in _tmp) {
            if (_tmp[id] && (typeof _tmp[id] === "function")) {
                if (request.path === 'options-to-background') {
                    if (request.method === id) _tmp[id](request.data);
                }
            }
        }
    });
    /*  */
    return {
        "receive": function (id, callback) {
            _tmp[id] = callback
        },
        "send": function (id, data, tabId) {
            chrome.runtime.sendMessage({"path": 'background-to-options', "method": id, "data": data});
        }
    }
})();

var onBeforeRequest = function (info) {
    var top = app.tabsObject[info.tabId] ? app.tabsObject[info.tabId].url : '';
    if (info.type === "main_frame") {
        top = info.url;
        config.badge.update(top, true);
    }
    /*  */
    var WRB = config.webRequest("WRB", top, info.url, info.type);
    if (WRB) return {"cancel": true};
};

var onHeadersReceived = function (info) {
    var headers = info.responseHeaders;
    var top = app.tabsObject[info.tabId] ? app.tabsObject[info.tabId].url : '';
    if (info.type === "main_frame") {
        top = info.url;
        config.badge.update(top, true);
    }
    /*  */
    var CSP = config.webRequest("CSP", top, info.url, info.type);
    if (CSP) {
        for (var i = 0; i < headers.length; i++) {
            var name = headers[i].name.toLowerCase();
            if (name === "content-security-policy") {
                headers[i].value = CSP + headers[i].value;
                /* add to existing CSP */
                return {"responseHeaders": headers};
            }
        }
        /* if there is no existing CSP */
        headers.push({'name': "Content-Security-Policy", 'value': CSP});
        return {"responseHeaders": headers};
    }
};

chrome.storage.onChanged.addListener(load);
chrome.tabs.onCreated.addListener(onCreatedListener);
chrome.tabs.onUpdated.addListener(onUpdatedListener);
chrome.tabs.onRemoved.addListener(onRemovedListener);
chrome.tabs.onActivated.addListener(onActivatedListener);
chrome.tabs.query({}, function (e) {
    e.forEach(function (tab) {
        if (tab) app.tabsObject[tab.id] = tab
    })
});
