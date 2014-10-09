var dev = true;
//change these two lines for loading local files
var appEnginePort = 1250;
var devurl = "//127.0.0.1";
var produrl = "//cdn-dot-demobo.appspot.com";

var injectedScript = function() {
	demoboBody.injectScript = function(url, callback) {
		var s = document.createElement('script');
		s.src = url;
		s.setAttribute('class', 'dmb-script');
		s.onload = function() {
			if (callback)
				callback();
			this.parentNode.removeChild(this);
		};
		(document.head || document.documentElement).appendChild(s);
	};
	demoboBody.addEventListener("FromContentScript", function(e) {
		demoboBody.detail = e.detail;
	});
	demoboBody.addEventListener("FromPopup", function(e) {

	});
	if (window.onExtensionMessage)
		demoboBody.addEventListener("FromExtension", onExtensionMessage);
};
if (!document.getElementById('toggle')) {
	var demoboBody = document.createElement('div');
	demoboBody.setAttribute('id', 'demoboBody');
	document.body.appendChild(demoboBody);
	var toggle = document.createElement('div');
	if (dev) {
		toggle.setAttribute('onclick', 'javascript:((function(c){(c.demoboPortal&&c.demoboPortal.set("mode","EXTENSION"));c._extension=1;var d=window.__dmtg;((!c.demoboPortal&&function(){var a=new Date,b=c.document.createElement("script"),e=(document.location.protocol==="https:")?"https:' + devurl + ':443":"http:' + devurl + ':' + appEnginePort + '";window.demoboBase=e;b.src=e+"/core/entry.js?"+a.getTime();b.className="demoboJS";c.document.body&&c.document.body.appendChild(b)})||d)()})(window))');
	} else {
		toggle.setAttribute('onclick', 'javascript:((function(c){(c.demoboPortal&&c.demoboPortal.set("mode","EXTENSION"));c._extension=1;var d=window.__dmtg;((!c.demoboPortal&&function(){var a=new Date,b=c.document.createElement("script"),e="' + produrl + '";window.demoboBase=e;b.src="' + produrl + '/core/entry.js?"+a.getTime();b.className="demoboJS";c.document.body&&c.document.body.appendChild(b)})||d)()})(window))');
	}
	toggle.setAttribute('id', 'toggle');
	document.body.appendChild(toggle);

	var load = document.createElement('div');
	load.setAttribute('id', 'load');
	if (dev) {
		load.setAttribute('onclick', 'javascript:((function(c){(c.demoboPortal&&c.demoboPortal.set("mode","EXTENSION"));c._extension=1;var d=window.__dmtg;((!c.demoboPortal&&function(){var a=new Date,b=c.document.createElement("script"),e=(document.location.protocol==="https:")?"https:' + devurl + ':443":"http:' + devurl + ':' + appEnginePort + '";window.demoboBase=e;b.src=e+"/core/entry.js?"+a.getTime();b.className="demoboJS";c.document.body&&c.document.body.appendChild(b)})||d)()})(window))');
	} else {
		load.setAttribute('onclick', 'javascript:((function(c){(c.demoboPortal&&c.demoboPortal.set("mode","EXTENSION"));c._extension=1;var d=window.__dmtg;((!c.demoboPortal&&function(){var a=new Date,b=c.document.createElement("script"),e="' + produrl + '";window.demoboBase=e;b.src="' + produrl + '/core/entry.js?"+a.getTime();b.className="demoboJS";c.document.body&&c.document.body.appendChild(b)})||d)()})(window))');
	}
	document.body.appendChild(load);

	injectJavascript(injectedScript);

	demoboBody.addEventListener("FromFrontground", function(e) {
		console.log("FromFrontground", e.detail);
		chrome.runtime.sendMessage(e.detail);
	});
	demoboBody.addEventListener("FromKoala", function(e) {
		console.log("FromKoala", e.detail);
		chrome.runtime.sendMessage(e.detail);
        if (e.detail.data && e.detail.data.action == 'updateUrl') {
            var message = e.detail.data;
            message.source = "remote";
            sendToFrontPage("FromExtension", message);
        }
	});
	
	var toggled = false;
	function onMessage(message, sender, sendResponse) {
		// console.log("onMessage", message.action);
		if (message.action === 'toggleKoala') {
//			console.log("onMessage toggleKoala");
			if (!toggled) {
//				console.log("onMessage toggleKoala click");
				document.getElementById('toggle').click();
				toggled = true;	
			}
			//favicon off message
		} else if (message.action === 'updateUrl') {
            console.log("onMessage updateUrl" + message.url);
            message.source = "local";
            sendToFrontPage("FromExtension", message);
        } else if (message.action === 'load') {
			document.getElementById('load').click();
			var detail = {
				type : "input",
				source : 'demoboApp',
				value : '',
				userName : "simulator",
				deviceID : "simulator"
			};
			sendToFrontPage("FromPopup", detail);
		} else if (message.action == 'FromPopup') {
			if (message.detail)
				sendToFrontPage("FromPopup", message.detail);
			sendResponse({
				active : true
			});
		} else {
			if (!sender.tab)
				sendToFrontPage("FromExtension", message);
		}
	};
	function sendToFrontPage(evtName, evtDetail) {
		var evt = new CustomEvent(evtName, {
			detail : evtDetail
		});
		demoboBody.dispatchEvent(evt);
	}

	function javascriptToString(f) {
		var args = [];
		for (var i = 1; i < arguments.length; ++i) {
			args.push(JSON.stringify(arguments[i]));
		}
		return "(" + f.toString() + ")(" + args.join(",") + ");";
	}

	function injectJavascript(f) {
		var actualCode = javascriptToString(f);
		var script = document.createElement('script');
		script.textContent = actualCode;
		(document.head || document.documentElement).appendChild(script);
		script.parentNode.removeChild(script);
	}


	chrome.runtime.onMessage.addListener(onMessage);
}
