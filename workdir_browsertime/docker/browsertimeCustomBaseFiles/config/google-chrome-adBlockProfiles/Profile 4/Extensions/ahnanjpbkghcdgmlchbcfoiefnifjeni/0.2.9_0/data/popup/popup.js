var background = (function () {
    var _tmp = {};
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        for (var id in _tmp) {
            if (_tmp[id] && (typeof _tmp[id] === "function")) {
                if (request.path == 'background-to-popup') {
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
        "send": function (id, data) {
            chrome.runtime.sendMessage({"path": 'popup-to-background', "method": id, "data": data})
        }
    }
})();

var activeTabUrl = '';
var popupElements = ['bug', 'faq', 'reset', 'media', 'image', 'style', 'object', 'script', 'input-field', 'website-list', 'global-settings', 'input-field-add', 'start-stop-button'];
var information = "No-Script Suite Lite provides an extra security for your Browser. It allows JavaScript to be executed only by trusted websites of your choice. Few websites are added to the white-list table above by default, but you can edit the list at any time.";

var popupObj = {
    "state": '',
    "itemURL": '',
    "whiteList": [],
    "mode": ['', '', '', '', ''],
    "whitelistR": ['', '', '', '', ''],
    "blacklistR": ['', '', '', '', ''],
    "address": ["all", "all", "all", "all", "all"],
    "arr": ["script", "style", "image", "object", "media"],
    "apply": ["domain", "domain", "domain", "domain", "domain"],
    "match": ["wildcard", "wildcard", "wildcard", "wildcard", "wildcard"]
};

var init = function () {
    var count = 1;
    var table = document.getElementById('website-list-table');
    table.textContent = '';
    var fillTable = function (arr, placeholder) {
        document.getElementById("input-field").setAttribute("placeholder", placeholder);
        if (arr && arr.length) {
            for (var i = arr.length - 1; i >= 0; i--) {
                var a = document.createElement('a');
                var tr = document.createElement('tr');
                var td1 = document.createElement('td');
                var td2 = document.createElement('td');
                var td3 = document.createElement('td');
                /*  */
                td1.textContent = count;
                td1.setAttribute('type', 'number');
                td2.appendChild(a);
                a.href = arr[i];
                a.textContent = arr[i];
                a.setAttribute("target", "_blank");
                a.setAttribute("style", "text-decoration: none; color: #656565");
                td2.setAttribute('type', 'item');
                td3.setAttribute('type', 'close');
                td1.setAttribute("style", "color: #656565");
                td2.setAttribute("style", "color: #656565");
                td3.setAttribute("style", "color: #656565");
                /*  */
                tr.appendChild(td1);
                tr.appendChild(td2);
                tr.appendChild(td3);
                table.appendChild(tr);
                count++;
            }
        }
    };
    /*  */
    document.getElementById('input-field').value = activeTabUrl;
    fillTable(popupObj.whiteList, "Add a website address to allow scripts");
    document.getElementById('input-field').disabled = popupObj.state === "disable";
    document.getElementById('input-field-add').setAttribute("state", popupObj.state);
    document.getElementById('start-stop-button').setAttribute("state", popupObj.state);
    for (var i = 0; i < popupObj.arr.length; i++) document.getElementById(popupObj.arr[i]).setAttribute("mode", popupObj.mode[i]);
};

var handlePage = function (e) {
    var id = e.target.getAttribute("id");
    if (id === "reset") {
        mscConfirm("Reset", "Do you really want to reset the addon to factory default?\nNote: all stored data will be deleted and your settings will be reset.", function () {
            background.send("reset-addon");
        });
    } else background.send("open-" + id + "-page");
};

var addInputFieldItem = function (e) {
    var value = document.getElementById('input-field').value;
    if (value) {
        popupObj.whiteList = popupObj.whiteList.filter(function (e) {
            return e !== value
        });
        popupObj.whiteList.push(value);
        background.send("store-popup-data", popupObj);
        document.getElementById('input-field').value = '';
    }
};

var handleSAClick = function (e) {
    var selected = false;
    e.target.setAttribute("mode", e.target.getAttribute("mode") === "selected" ? '' : "selected");
    for (var i = 0; i < popupObj.arr.length; i++) {
        if (document.getElementById(popupObj.arr[i]).getAttribute("mode") === "selected") {
            selected = true;
            popupObj.mode[i] = "selected";
        } else popupObj.mode[i] = '';
    }
    background.send("store-popup-data", popupObj);
    if (!selected) background.send("reset-badge");
};

var updateInformation = function (e) {
    window.setTimeout(function () {
        var target = e.target || e.originalTarget;
        var title = target.getAttribute("title");
        if (title) document.getElementById('information-span').textContent = title;
        else document.getElementById('information-span').textContent = information;
    }, 100);
};

background.receive('storageData', function (e) {
    popupObj = e;
    document.getElementById('input-field').disabled = popupObj.state === "disable";
    document.getElementById('input-field-add').setAttribute("state", popupObj.state);
    document.getElementById('start-stop-button').setAttribute("state", popupObj.state);
    /*  */
    var a = document.createElement('a');
    a.href = popupObj.activeTabUrl;
    document.body.appendChild(a);
    activeTabUrl = a.protocol + "//" + a.host;
    document.body.removeChild(a);
    /*  */
    init();
});

var load = function () {
    background.send('popup-start');
    window.removeEventListener("load", load, false);
    /*  */
    document.getElementById('input-field').addEventListener('keypress', function (e) {
        var key = e.which || e.keyCode;
        if (key === 13) addInputFieldItem(e);
    });
    /*  */
    document.getElementById('start-stop-button').addEventListener("click", function (e) {
        var state = e.target.getAttribute("state");
        state = (state === "enable") ? "disable" : "enable";
        popupObj.state = state;
        background.send("store-popup-data", popupObj);
    });
    /*  */
    document.getElementById('website-list-table').addEventListener("click", function (e) {
        if (e.target.tagName.toLowerCase() === 'td' || e.target.nodeName.toLowerCase() === 'td') {
            if (e.target.getAttribute('type') === 'close') {
                var url = e.target.parentNode.childNodes[1].textContent;
                popupObj.whiteList = popupObj.whiteList.filter(function (e) {
                    return e !== url
                });
                background.send("store-popup-data", popupObj);
            }
        }
    });
    /*  */
    document.getElementById("faq").addEventListener("click", handlePage);
    document.getElementById("bug").addEventListener("click", handlePage);
    document.getElementById("reset").addEventListener("click", handlePage);
    document.getElementById('information-span').textContent = information;
    document.getElementById("website-list").setAttribute("title", information);
    document.getElementById('input-field-add').addEventListener("click", addInputFieldItem);
    document.getElementById('global-settings').addEventListener("click", function () {
        background.send("open-options-page")
    });
    /*  */
    for (var i = 0; i < popupObj.arr.length; i++) document.getElementById(popupObj.arr[i]).addEventListener("click", handleSAClick);
    for (var i = 0; i < popupElements.length; i++) document.getElementById(popupElements[i]).addEventListener("mouseenter", updateInformation);
};

window.addEventListener("load", load, false);
