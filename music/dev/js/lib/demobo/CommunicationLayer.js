var demobo = demobo || {};

(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        // AMD. Register as an anonymous module.
        define(["underscore","backbone"], function(_, Backbone) {
            // Use global variables if the locals are undefined.
            return factory(_ || root._, Backbone || root.Backbone);
        });
    } else {
        // RequireJS isn't being used. Assume underscore and backbone are loaded in <script> tags
        factory(_, Backbone);
    }
}(this, function(_, Backbone) {
    var tempStorage = {};

    function CommunicationLayer(options) {
        Object.apply(this, arguments);
        _.defaults(options, CommunicationLayer.DEFAULT_OPTIONS);
        this.options = options;
        this.targets = {};
        this.add(options || {});
    }
    CommunicationLayer.prototype = Object.create(Object.prototype);
    CommunicationLayer.prototype.constructor = CommunicationLayer;
    CommunicationLayer.DEFAULT_OPTIONS = {};

    CommunicationLayer.prototype.add = function(channelObj,onSuccess,onFailure) {
        var onFailure = onFailure || function(){};
        var onSuccess = onSuccess || function(){};
        if (!channelObj.layers || !channelObj.layers.length) {
            this.remove(channelObj);
            onFailure.call(this);
            return;
        }
        var firstLayer = channelObj.layers[0].split(":");
        var type = firstLayer[0];
        var port = firstLayer[1];
        var options = {
            type: type,
            port: port,
            channel: channelObj.channelID
        };
        // only allow one websocket server
        if (options.type=="websocket" && demobo.discovery.isHost()) {
            var key = this.getKey(channelObj);
            var target = this.targets[key];
            if (target && target.type=="websocket") {
                delete target.state;
                target.ping.call(target);
                return;
            }
        }
        var target;
        switch (options.type) {
            case "webrtc":
                options.channel =  channelObj.channelID + ":" + channelObj.connectionID;
                target = new CommunicationLayerWebrtc(options);
                break;
            case "firebase":
                target = new CommunicationLayerFireBase(options);
                break;
            case "iframe":
                target = new CommunicationLayerIframe(options);
                break;
            case "socketio":
                target = new CommunicationLayerSocketio(options);
                break;
            case "alljoyn":
                target = new CommunicationLayerAlljoyn(options);
                break;
            case "websocket":
                target = new CommunicationLayerWebsocket(options);
                break;
            default:
                break;
        }
        if (target) {
            this.remove(channelObj);
            if (options.maxConnections==1) {
                this.offMessage();
                this.targets = {};
            }
            target.key = this.getKey(channelObj);
            this.targets[target.key] = target;
            if (this.onMessageCallback) target.onMessage(this.onMessageCallback);

            target.onConnect = function() {
                target.ping.call(target);
            }.bind(this);
            target.onSuccess = function() {
                if (demobo.discovery.isHost()) this.syncSet();
                onSuccess();
            }.bind(this);
            setTimeout(function() {
                if (!target.state) {
                    delete demobo.discovery.deviceInfo.port;
                    channelObj.layers.shift();
                    this.add(channelObj,onSuccess,onFailure);
                }
            }.bind(this), demobo.discovery.options.layerTimeout);
        }
        else {
            console.log("Communication Layer set up fails");
        }
    };

    CommunicationLayer.prototype.getKey = function(channelObj) {
        var key = channelObj.host+channelObj.guest || channelObj.channelID+channelObj.connectionID;
        return key;
    };

    CommunicationLayer.prototype.remove = function(channelObj) {
        var key = this.getKey(channelObj);
        var oldTarget = this.targets[key];
        if (oldTarget) {
            oldTarget.offMessage();
            delete this.targets[key];
        }
    };

    CommunicationLayer.prototype.set = function(key, value) {
        if (key) tempStorage[key] = value;
        _(this.targets).map(function(target){
            target.set(key, value);
        });
    };

    CommunicationLayer.prototype.get = function(key) {
        return tempStorage[key];
    };

    CommunicationLayer.prototype.syncSet = function() {
        _(tempStorage).map(function(value,key){
            this.set(key, value);
        }.bind(this));
    };

    CommunicationLayer.prototype.rpc = function(method, data) {
        _(this.targets).map(function(target){
            target.rpc(method, data);
        });
    };

    CommunicationLayer.prototype.postMessage = function(message) {
        _(this.targets).map(function(target){
            target.postMessage(message);
        });
    };

    CommunicationLayer.prototype.onMessage = function(callback) {
        this.onMessageCallback = callback;
        _(this.targets).map(function(target){
            target.onMessage(callback);
        });
    };

    CommunicationLayer.prototype.offMessage = function() {
        _(this.targets).map(function(target){
            target.offMessage();
        });
    };



    function CommunicationLayerGeneric(options) {
        Object.apply(this, arguments);
        this.guid = demobo.Utils.getDeviceID();
        this.type = options ? options.type : "";
        this.channel = options ? options.channel : "";
        this.firebaseUrl = demobo.discovery.options.firebaseUrl + "/communicationLayer";
    }
    CommunicationLayerGeneric.prototype = Object.create(Object.prototype);
    CommunicationLayerGeneric.prototype.constructor = CommunicationLayerGeneric;
    CommunicationLayerGeneric.DEFAULT_OPTIONS = {};
    CommunicationLayerGeneric.prototype.isHost = function() {
        return demobo.discovery.isHost();
    };
    CommunicationLayerGeneric.prototype.ping = function ping() {
        setTimeout(function() {
            this.postMessage({method: "ping", key: this.key, from: this.guid});
        }.bind(this),500);
    };
    CommunicationLayerGeneric.prototype.pings = function pings(count) {
        count--;
        this.ping();
        if (count>0) setTimeout(function() {
            this.pings.call(this,count);
        }.bind(this), 100);
    };
    CommunicationLayerGeneric.prototype.set = function set(key, value) {
        this.postMessage({method: "set", key: key, value: value, from: this.guid});
    };
    CommunicationLayerGeneric.prototype.rpc = function rpc(method, data) {
        var message = JSON.stringify([method, data]);
        this.postMessage({message: message, from: this.guid});
    };
    CommunicationLayerGeneric.prototype.postMessage = function(message) {};
    CommunicationLayerGeneric.prototype.onMessage = function(callback) {};
    CommunicationLayerGeneric.prototype.offMessage = function() {};
    CommunicationLayerGeneric.prototype.handleMessageCallback = function(data, callback) {
        if (!data || this.guid == data.from) {
            return;
        }
        if (data.method == "ping") {
            if (data.key==this.key && data.from!=this.guid) {
                if (!this.state) {
                    this.state = 1;
                    this.ping.call(this);
                    this.onSuccess();
                }
            }
        } else if (data.method == "set") {
            if (data.key) tempStorage[data.key] = data.value;
        } else {
            if (data.message) {
                callback(data.message);
            }
        }
    };

    function CommunicationLayerFireBase(options) {
        CommunicationLayerGeneric.apply(this, arguments);
        this.target = new Firebase(this.firebaseUrl + "/fb_"+this.channel);
        this.target.onDisconnect().remove();
        setTimeout(function() {
            if (this.onConnect) this.onConnect.call(this);
            if (!this.isHost()) {
                this.rpc("_remoteSync", []);
            }
        }.bind(this), 50);
    }

    CommunicationLayerFireBase.prototype = Object.create(CommunicationLayerGeneric.prototype);
    CommunicationLayerFireBase.prototype.constructor = CommunicationLayerFireBase;
    CommunicationLayerFireBase.DEFAULT_OPTIONS = {};

    CommunicationLayerFireBase.prototype.postMessage = function(message) {
        this.target.set(message);
    };

    CommunicationLayerFireBase.prototype.onMessage = function(callback) {
        this.messageCallback = function(snapshot) {
            var data = snapshot.val();
            if (data) this.handleMessageCallback(data, callback);
        }.bind(this);
        this.target.on("value", this.messageCallback);
    };

    CommunicationLayerFireBase.prototype.offMessage = function() {
        this.target.off("value", this.messageCallback);
    };



    function CommunicationLayerWebsocket(options) {
        CommunicationLayerGeneric.apply(this, arguments);
        var ip = demobo.discovery.getHostIPAddress();
        var port = options.port;
        this.target = new DemoboWebsocket({
            channel: this.channel,
            id: this.guid,
            isHost: this.isHost(),
            internalIP: ip,
            port: port
        });
        if (this.isHost()) demobo.discovery.deviceInfo.port = port;
        this.target.socketonopen = function() {
            if (this.onConnect) this.onConnect.call(this);
            if (!this.isHost()) {
                this.rpc("_remoteSync", []);
            }
        }.bind(this);
    }

    CommunicationLayerWebsocket.prototype = Object.create(CommunicationLayerGeneric.prototype);
    CommunicationLayerWebsocket.prototype.constructor = CommunicationLayerWebsocket;
    CommunicationLayerWebsocket.DEFAULT_OPTIONS = {};

    CommunicationLayerWebsocket.prototype.postMessage = function(message) {
        this.target.send(message);
    };

    CommunicationLayerWebsocket.prototype.onMessage = function(callback) {
        this.messageCallback = function(data) {
            this.handleMessageCallback(data, callback);
        }.bind(this);
        this.target.onMessage(this.messageCallback);
    };
    CommunicationLayerWebsocket.prototype.offMessage = function() {
        this.target.offMessage();
    };
    CommunicationLayerWebsocket.prototype.set = function set(key, value) {
        // do not support set in websocket yet, buggy
    };

    function CommunicationLayerAlljoyn(options) {
        CommunicationLayerGeneric.apply(this, arguments);
        this.target = new Alljoyn({
            channel: this.channel,
            id: this.guid,
            isHost: this.isHost()
        });
        setTimeout(function() {
            if (this.onConnect) this.onConnect.call(this);
            if (!this.isHost()) {
                this.rpc("_remoteSync", []);
            }
        }.bind(this), 1500);
    }

    CommunicationLayerAlljoyn.prototype = Object.create(CommunicationLayerGeneric.prototype);
    CommunicationLayerAlljoyn.prototype.constructor = CommunicationLayerAlljoyn;
    CommunicationLayerAlljoyn.DEFAULT_OPTIONS = {};

    CommunicationLayerAlljoyn.prototype.postMessage = function(message) {
        this.target.send("message", message);
    };

    CommunicationLayerAlljoyn.prototype.onMessage = function(callback) {
        this.messageCallback = function(data) {
            this.handleMessageCallback(data, callback);
        }.bind(this);
        this.target.on("message", this.messageCallback);
    };

    CommunicationLayerAlljoyn.prototype.offMessage = function() {
        this.target.off("message", this.messageCallback);
    };

    function CommunicationLayerIframe(options) {
        CommunicationLayerGeneric.apply(this, arguments);
        this.target = window.parent;
        setTimeout(function() {
            if (this.onConnect) this.onConnect.call(this);
            if (!this.isHost()) {
                this.rpc("_remoteSync", []);
            }
        }.bind(this), 0);
    }
    CommunicationLayerIframe.prototype = Object.create(CommunicationLayerGeneric.prototype);
    CommunicationLayerIframe.prototype.constructor = CommunicationLayerIframe;
    CommunicationLayerIframe.DEFAULT_OPTIONS = {};
    CommunicationLayerIframe.prototype.postMessage = function(message) {
        this.target.postMessage(message, "*");
    };
    CommunicationLayerIframe.prototype.onMessage = function(callback) {
        this.messageCallback = function(evt) {
            var data = evt.data;
            this.handleMessageCallback(data, callback);
        }.bind(this);
        if (window.addEventListener) {
            window.addEventListener('message', this.messageCallback, false);
        }
        else {
            window.attachEvent('onmessage', this.messageCallback);
        }
    };
    CommunicationLayerIframe.prototype.offMessage = function() {
        if (window.removeEventListener) {
            window.removeEventListener('message', this.messageCallback, false);
        }
        else {
            window.detachEvent('onmessage', this.messageCallback);
        }
    };


    function CommunicationLayerSocketio(options) {
        CommunicationLayerGeneric.apply(this, arguments);
        this.target = io.connect("172.16.0.43:4000");
        this.target.emit('create', this.channel);
        setTimeout(function() {
            if (this.onConnect) this.onConnect.call(this);
            if (!this.isHost()) {
                this.rpc("_remoteSync", []);
            }
        }.bind(this), 50);
    }
    CommunicationLayerSocketio.prototype = Object.create(CommunicationLayerGeneric.prototype);
    CommunicationLayerSocketio.prototype.constructor = CommunicationLayerSocketio;
    CommunicationLayerSocketio.DEFAULT_OPTIONS = {};
    CommunicationLayerSocketio.prototype.postMessage = function(message) {
        this.target.emit('message', message);
    };
    CommunicationLayerSocketio.prototype.onMessage = function(callback) {
        this.messageCallback = function(data) {
            this.handleMessageCallback(data, callback);
        }.bind(this);
        this.target.on('message', this.messageCallback);
    };
    CommunicationLayerSocketio.prototype.offMessage = function() {
        this.target.off('message', this.messageCallback);
    };




    function CommunicationLayerWebrtc(options) {
        CommunicationLayerGeneric.apply(this, arguments);
        this.target = new WebrtcFirebase({
            firebaseUrl : this.firebaseUrl,
            channel : this.channel,
            guid: this.guid
        });
        this.target.onOpen = function() {
            if (this.onConnect) this.onConnect.call(this);
            if (!this.isHost()) {
                this.rpc("_remoteSync", []);
            }
        }.bind(this);
    }
    CommunicationLayerWebrtc.prototype = Object.create(CommunicationLayerGeneric.prototype);
    CommunicationLayerWebrtc.prototype.constructor = CommunicationLayerWebrtc;
    CommunicationLayerWebrtc.DEFAULT_OPTIONS = {};

    CommunicationLayerWebrtc.prototype.postMessage = function(message) {
        if (this.target.sendMessage) this.target.sendMessage(message);
    };
    CommunicationLayerWebrtc.prototype.onMessage = function(callback) {
        this.messageCallback = function(data) {
            this.handleMessageCallback(data, callback);
        }.bind(this);
        this.target.messageCallback = this.messageCallback;
    };
    CommunicationLayerWebrtc.prototype.offMessage = function() {
        delete this.target.messageCallback;
    };

    demobo.CommunicationLayer = CommunicationLayer;
    demobo.communicationLayer = new demobo.CommunicationLayer({});
    return demobo.CommunicationLayer;
}));