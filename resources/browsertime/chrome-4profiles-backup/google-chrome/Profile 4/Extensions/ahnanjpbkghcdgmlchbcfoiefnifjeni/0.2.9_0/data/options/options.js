var optionsObj = {};

var background = (function () {
  var _tmp = {};
  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    for (var id in _tmp) {
      if (_tmp[id] && (typeof _tmp[id] === "function")) {
        if (request.path == 'background-to-options') {
          if (request.method === id) _tmp[id](request.data);
        }
      }
    }
  });
  /*  */
  return {
    "receive": function (id, callback) {_tmp[id] = callback},
    "send": function (id, data) {chrome.runtime.sendMessage({"path": 'options-to-background', "method": id, "data": data})}
  }
})();

var handleCheckbox = function (e) {
  var target = e.target;
  optionsObj[target.id] = target.checked;
  background.send("store-options-data", optionsObj);
  if (target.getAttribute("id") === "CSP" || target.getAttribute("id") === "WRB") {
    if (target.checked === false) background.send("reset-badge");
  }
};

var handleButton = function () {
  optionsObj["EXCLUSIVE"] = false;
  optionsObj["INCLUSIVE"] = false;
  /*  */
  optionsObj[this.id] = true;
  background.send("store-options-data", optionsObj);
};
  
var load = function () {
  background.send('options-start');
  window.removeEventListener("load", load, false);
  document.getElementById("CSP").addEventListener("change", handleCheckbox);
  document.getElementById("WRB").addEventListener("change", handleCheckbox);
  document.getElementById("HOME").addEventListener("change", handleCheckbox);
  document.getElementById("BADGE").addEventListener("change", handleCheckbox);
  document.getElementById("EXCLUSIVE").addEventListener("click", handleButton);
  document.getElementById("INCLUSIVE").addEventListener("click", handleButton);
  document.getElementById("CONSOLE").addEventListener("change", handleCheckbox);
  document.getElementById("INCLUSIVE-c").addEventListener("click", function () {document.getElementById("INCLUSIVE").click()});
  document.getElementById("EXCLUSIVE-c").addEventListener("click", function () {document.getElementById("EXCLUSIVE").click()});
};

background.receive('storageData', function (o) {
  optionsObj = o;
  document.getElementById("CSP").checked = optionsObj.CSP || false;
  document.getElementById("WRB").checked = optionsObj.WRB || false;
  document.getElementById("HOME").checked = optionsObj.HOME || false;
  document.getElementById("BADGE").checked = optionsObj.BADGE || false;
  document.getElementById("CONSOLE").checked = optionsObj.CONSOLE || false;
  document.getElementById("EXCLUSIVE").setAttribute("active", optionsObj.EXCLUSIVE + '');
  document.getElementById("INCLUSIVE").setAttribute("active", optionsObj.INCLUSIVE + '');
  document.getElementById("EXCLUSIVE-c").setAttribute("active", optionsObj.EXCLUSIVE + '');
  document.getElementById("INCLUSIVE-c").setAttribute("active", optionsObj.INCLUSIVE + '');
  /*  */
  var table = document.getElementById("settings-table");
  if (table) table.parentNode.removeChild(table);
  var table = document.createElement("table"); 
  table.setAttribute("id", "settings-table");
  table.setAttribute("class", "settings");
  /*  */
  var addTR = function (table, rule) {
    var tr = document.createElement("tr");  
    tr.setAttribute("rule", rule);
    var addTD = function (tr, method, index, cl) {
      var td = document.createElement("td"); 
      td.setAttribute("method", method);
      td.setAttribute("type", optionsObj[method][index]);    
      if (cl) {
        td.setAttribute("class", cl);
        td.addEventListener("click", function () {
          var type = this.getAttribute("type");
          var method = this.getAttribute("method");
          var rule = this.parentNode.getAttribute("rule");
          if (method === "apply") this.setAttribute("type", (type === "domain" ? "frame" : "domain"));
          if (method === "address") this.setAttribute("type", (type === "all" ? "thirdparty" : "all"));
          if (method === "match") this.setAttribute("type", (type === "regexp" ? "wildcard" : "regexp"));
          /*  */
          var i = optionsObj.arr.indexOf(rule);
          optionsObj[method][i] = this.getAttribute("type");
          background.send("store-options-data", optionsObj);
        });
      } else {
        td.setAttribute("mode", optionsObj.mode[index]);
        td.textContent = optionsObj[method][index];
        td.addEventListener("click", function () {
          var mode = this.getAttribute("mode");
          this.setAttribute("mode", (mode === "selected" ? "unselected" : "selected"));
          optionsObj.mode[index] = this.getAttribute("mode");
          background.send("store-options-data", optionsObj);
        });
      }
      tr.appendChild(td);
    };
    /*  */
    var index = optionsObj.arr.indexOf(rule);
    /*  */
    addTD(tr, "arr", index, '');
    addTD(tr, "apply", index, 'button');
    addTD(tr, "address", index, 'button');
    /*  */
    var td = document.createElement("td"); 
    var textarea = document.createElement("textarea"); 
    textarea.setAttribute("placeholder", "WHITELIST Rules for " + rule.toUpperCase() + " Contents with Regular Expressions (i.e. \\.test\\.com|\\&sample\\=)");
    textarea.value = optionsObj.whitelistR[index];
    textarea.addEventListener("change", function (e) {
      optionsObj.whitelistR[index] = e.target.value; 
      background.send("store-options-data", optionsObj);
    });
    td.appendChild(textarea);
    tr.appendChild(td);
    /*  */
    var td = document.createElement("td"); 
    var textarea = document.createElement("textarea"); 
    textarea.setAttribute("placeholder", "BLACKLIST Rules for " + rule.toUpperCase() + " Contents with Regular Expressions (i.e. \\.test\\.com|\\&sample\\=)");
    textarea.value = optionsObj.blacklistR[index];
    textarea.addEventListener("change", function (e) {
      optionsObj.blacklistR[index] = e.target.value; 
      background.send("store-options-data", optionsObj);
    });
    td.appendChild(textarea);
    tr.appendChild(td);
    table.appendChild(tr);
  };
  /*  */
  addTR(table, "script");
  addTR(table, "style");
  addTR(table, "image");
  addTR(table, "object");
  addTR(table, "media");
  document.getElementById("content").appendChild(table);
});

window.addEventListener("load", load, false);