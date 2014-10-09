var PORTAL_URL = "http://www.pandora.com/";
var targetTab;
var TouchModel = Backbone.DemoboStorage.Model.extend({
    demoboID: 'touchModel'
});
var touchData = new TouchModel({
    id: 'touchModel'
});

preloadDemoboScript();
setTimeout(function(){
    setBWIcon();
    setListeners();
    initDemobo();
},1000);

chrome.browserAction.onClicked.addListener(function() {
    if (!targetTab) {
        chrome.tabs.create({
            'url' : PORTAL_URL,
            pinned : true
        }, function(tab) {
            targetTab = tab;
            setIcon();
        });
        demobo.discovery.enable();
        demobo.discovery.enterCode(1234);
    } else {
        if (targetTab && targetTab.id) {
            chrome.tabs.remove(targetTab.id, function() {
                setBWIcon();
                demobo.discovery.disable();
            });
            targetTab = null;
        }
    }
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    // tagetTab change bug on some websites
    if (tab.pinned && tab.index==0) {
        targetTab = tab;
    }
    if (targetTab && targetTab.id == tabId) {
        if (changeInfo.status=='complete' && targetTab.id) {
            console.log("onUpdate complete");
            chrome.tabs.sendMessage(targetTab.id, {
                action : 'toggleKoala'
            });
        }
    }
});

function setIcon() {
    chrome.browserAction.setIcon({
        path : 'images/colabeo19.png'
    });
}

function setBWIcon() {
    chrome.browserAction.setIcon({
        path : 'images/colabeo19_bw.png'
    });
}

function preloadDemoboScript() {
    if (document.getElementById('demoboScript'))
        return;
    var e = document.createElement('script');
    e.id  = 'demoboScript';
    e.src = "https://net.demobo.com/guid.js";
    document.body.appendChild(e);
}

function initDemobo() {
    demobo.init({
        isHost: false,
        appName: "demoboMusic",
        method: "code",
        layers: ["socketio", "firebase"],
        layerTimeout: 10000,
        timeout: 30000,
        onSuccess: function() {
            console.log("demobo onSuccess");
        }.bind(this),
        onFailure: function() {
            console.log("demobo onFailure");
        }.bind(this),
        onPairing: function() {
            console.log("demobo onPairing");
        }.bind(this),
        onTimeout: function() {
            console.log("demobo onTimeout");
        }.bind(this)
    });
}

function setListeners() {
    touchData.on("change", function(model) {
        var data = model.attributes;
        sendToTarget(data);
    });
}

function sendToTarget(data) {
    if (!targetTab) return;
//    console.log(targetTab.id, data.value);
    chrome.tabs.sendMessage(targetTab.id, data);
}