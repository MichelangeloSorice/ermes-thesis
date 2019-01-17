window.setTimeout(function () {
    if (app.loadReason === "install" || app.loadReason === "startup") {
        var version = config.welcome.version;
        if (!version) app.tab.open(app.homepage() + "?v=" + app.version() + "&type=install");
        else if (config.welcome.open) {
            if (app.version() !== version) {
                app.tab.open(app.homepage() + "?v=" + app.version() + "&p=" + version + "&type=upgrade");
            }
        }
        config.welcome.version = app.version();
    }
}, 3000);

var updateToolbarIcon = function (e) {
    config.settings.object.state === "enable" ? app.toolbarIcon(e ? "noeffect" : "enable") : app.toolbarIcon("disable");
};

var updatePopup = function () {
    app.tab.getActive(function (tab) {
        var tmp = config.settings.object;
        tmp["activeTabUrl"] = tab.url;
        app.popup.send("storageData", tmp);
    });
};

var updateOptions = function () {
    app.tab.getActive(function (tab) {
        var tmp = config.settings.object;
        tmp["activeTabUrl"] = tab.url;
        app.options.send("storageData", tmp);
    });
};

var updateBadge = function () {
    app.tab.getActive(function (tab) {
        var key = config.hostname(tab.url);
        var count = config.badge.number[tab.url];
        if (!count || typeof count === undefined) count = 0;
        var index = config.settings.whiteList.indexOf(key);
        if (config.settings.object.state === "enable") {
            if ((tab.url.indexOf("http") === 0 || tab.url.indexOf("ftp") === 0) && index === -1) {
                updateToolbarIcon(false);
                if (config.settings.object.BADGE) app.button.badge = count < 100 ? count : '99+';
            } else {
                updateToolbarIcon(true);
                app.button.badge = 0;
            }
        } else {
            updateToolbarIcon(false);
            app.button.badge = 0;
        }
    });
};

app.popup.receive("store-popup-data", function (e) {
    config.settings.object = e;
    updateOptions();
    updatePopup();
    updateBadge();
});

app.options.receive("store-options-data", function (e) {
    config.settings.object = e;
    updateOptions();
});

app.tab.onUpdated(updateBadge);
app.tab.onActivated(updateBadge);
window.setTimeout(updateBadge, 300);
app.popup.receive("popup-start", updatePopup);
app.addon.receive("update-badge", updateBadge);
app.options.receive("options-start", updateOptions);
app.popup.receive("open-options-page", app.tab.openOptions);
app.popup.receive("reset-badge", function () {
    config.badge.number = {}
});
app.options.receive("reset-badge", function () {
    config.badge.number = {}
});
app.popup.receive("open-faq-page", function () {
    app.tab.open(app.homepage())
});
app.popup.receive("open-bug-page", function () {
    app.tab.open(app.homepage() + "#report")
});
app.popup.receive("reset-addon", function () {
    app.storage.clear(function () {
        app.reload()
    })
});
