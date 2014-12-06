var demobo = demobo || {};

(function() {
    var simpleBump = demobo.SimpleBump;

    function Discovery(options) {
        Object.apply(this, arguments);
        _.defaults(options, Discovery.DEFAULT_OPTIONS);
        this.options = options;
        if (this.options.isSyncHost == undefined) this.options.isSyncHost=this.options.isHost;
        _init.call(this);
        this.initDeviceInfo.call(this);
        _createHandlers.call(this);
        //_debug.call(this);
    }

    Discovery.prototype = Object.create(Object.prototype);
    Discovery.prototype.constructor = Discovery;
    Discovery.DEFAULT_OPTIONS = {
        firebaseUrl : "https://demobo.firebaseio.com",
        appName: "discovery",
        paringTolerance: 1000,
        dataKeptTime: 5000,
        mode: "conference",
        isHost: false,
        method: "bump",
        timeout: 6000
    };

    function _debug(){
        window.discovery = this;
    }

    function _init(){
        this.pairingTimeout;
        this.onPairing = this.options.onPairing;
        this.onSuccess = function(){
            if (this.pairingTimeout) clearTimeout(this.pairingTimeout);
            this.options.onSuccess();
        }.bind(this);
        this.onFailure = function(){
            if (this.pairingTimeout) clearTimeout(this.pairingTimeout);
            this.options.onFailure();
        }.bind(this);
        this.onTimeout = function(){
            if (this.pairingTimeout) clearTimeout(this.pairingTimeout);
            this.options.onTimeout();
        }.bind(this);
        this.rootUrl = this.options.firebaseUrl + "/" + this.options.appName + "/";
        this.pairingUrl = this.options.firebaseUrl + "/" + this.options.appName +  '/pairing/';
        this.enabled = false;
        //---------------------------------------
        this.pairing = {};
        this.pairing["candidates"] = [];          // bumped machine
        this.pairing["pairedMembers"] = [];       // the one will be paired with this
        //---------------------------------------
        this.successCallback = null;
        this.failCallback = null;
        this.allowMesh = this.options.allowMesh;

    }
    Discovery.prototype.initDeviceInfo = function () {
        this.deviceInfo = {
            deviceID: demobo.Utils.getDeviceID(),
            platform: navigator.platform,
            userAgent:navigator.userAgent,
            layers: this.options.layers || this.getAvailableLayers(),
            isHost: this.options.isHost,
            roomId: null,
            channelID: null,
            host: null,
            externalID: demobo_r
        };
        if (this.isMobile() && window.getIPAddress) {
            window.getIPAddress(true, function(ipv4){
                _.extend(this.deviceInfo , {
                    internalIP: ipv4
                });
            }.bind(this), function(e){
                console.log(e);
            });
        }
        if (this.options.alwaysOn && this.deviceInfo.externalID) {
            setTimeout(function(){
                this.enable();
            }.bind(this),0);
        }
    };

    function _createHandlers(){
        this.keydownHandler = function (event) {
            if (event.keyCode == 32) {
                setTimeout(this.onPairingTrigger.bind(this), simpleBump.delay * 2);
            }
        }.bind(this);

        this.onPairHandler = function(firebaseNodeData){
            var data = firebaseNodeData.val();
            _.each(data, function(value){
                this.pairing.candidates.push(value);
            }.bind(this));
        }.bind(this);
    }

    Discovery.prototype.enable = function () {
        if(this.enabled) return;
        this.enabled = true;
        if (this.options.method == "code") {
            this.startCodePairing();
        } else {
            this.startBumpPairing();
        }

    };

    Discovery.prototype.disable = function () {
        if(! this.enabled) return;
        this.enabled = false;
        if (this.options.method == "code") {
            this.endCodePairing();
        } else {
            this.endBumpPairing();
        }

    };

    Discovery.prototype.search = function (successCallback, failCallback) {
        if(typeof successCallback === "function") {
//            this.successCallback = successCallback;
            this.successCallback = _.debounce(successCallback, 300, true);
        }
        if(typeof failCallback === "function") {
//            this.failCallback = failCallback;
            this.failCallback = _.debounce(failCallback, 300, true);
        }
    };

    function _addBumpListener() {
        simpleBump.startWatch(this.onPairingTrigger.bind(this));
    }

    function _removeBumpListener() {
        simpleBump.stopWatch();
    }

    function _addVolumeButtonListener(){
        this.onPairingTriggerRef = this.onPairingTrigger.bind(this);
        document.addEventListener("volumedownbutton",this.onPairingTriggerRef , false);
        document.addEventListener("volumeupbutton", this.onPairingTriggerRef, false);
    }

    function _removeVolumeButtonListener(){
        document.removeEventListener("volumedownbutton", this.onPairingTriggerRef, false);
        document.removeEventListener("volumeupbutton", this.onPairingTriggerRef, false);
    }

    function _addSpaceBarListener() {
        window.addEventListener('keydown', this.keydownHandler);
    }

    function _removeSpaceBarListener() {
        window.removeEventListener('keydown', this.keydownHandler);
    }

    function _removePairingRef(delayTime){
        if(this.removeTimeout) clearTimeout(this.removeTimeout);
        this.removeTimeout = setTimeout(function(){
            this.pairingRef.off('child_added');
            this.pairingRef.off('value');
            this.pairingRef.child(this.getDeviceInfo().deviceID).remove();
        }.bind(this), delayTime);
    }

    function _selectPairMembers(){
        var thisInfo = _.find(this.pairing.candidates, function(candidate){
            return (candidate.deviceID == this.getDeviceInfo().deviceID);
        }.bind(this));
        if(thisInfo){
            this.pairing.pairedMembers = this.pairing.candidates.filter(function(candidate){
                if (candidate.deviceID == this.getDeviceInfo().deviceID) return false;
                if (this.options.method == "code") {
                    return (candidate.code && thisInfo.code==candidate.code);
                } else {
                    return Math.abs(candidate.serverTime - thisInfo.serverTime) <= this.options.paringTolerance;
                }
            }.bind(this));
            _createRoom.call(this, thisInfo);
        }else{
            // err
        }
        this.pairing.candidates = [];
    }

    function _createRoom(thisInfo){
        this.roomRef = null;
        if(this.pairing.pairedMembers.length == 1){
            // todo roomId indicates connections each device already have , in the room they have communication info
            // todo latter by checking whether they have same roomId determine whether they already connected
            var candidate = this.pairing.pairedMembers[0];
            if(candidate.channelID && thisInfo.channelID) {
                // TODO
            }
            else if((candidate.channelID || thisInfo.channelID) &&
                (! candidate.isHost && ! thisInfo.isHost)){
                if(this.allowMesh){
                    _joinChannel.call(this, thisInfo);
                }else{
                    var host = candidate.host ? candidate.host: thisInfo.host;
                    this.failCallback(host);
                }
            }else{
                _findHost.call(this, thisInfo);
                _createChannel.call(this, thisInfo);
            }

        }else{
            if(this.roomRef) this.failCallback("more then one device is pairing");
        }
    }

    function _joinChannel(thisInfo){
        var id = "";
//            var id = Math.min(this.pairing.pairedMembers[0].serverTime, thisInfo.serverTime)+ "ID_ip";
        if(thisInfo.channelID){
            id = this.pairing.pairedMembers[0].deviceID;
        }else{
            id = thisInfo.deviceID;
        }
        this.getDeviceInfo().roomId = id;
        this.roomRef = new Firebase(this.rootUrl + "connected/" + id);
        this.roomRef.onDisconnect().remove();
        if(thisInfo.channelID){
            var info = {};
            info.connectionID = demobo.Utils.guid();
            info.host = this.getDeviceInfo().host;
            info.layers = this.getDeviceInfo().layers;
            info.channelID = this.getDeviceInfo().channelID;
            info.hostInfo = this.getDeviceInfo().hostInfo;
            info = _.compactObject(info);
            this.roomRef.update(info, function(){
                function roomOnValue(nodeData){
                    var nodeObj = nodeData.val();
                    if (!nodeObj || !nodeObj.guest) return;
                    this.roomRef.off('value', this.roomOnValue);
                    this.successCallback(nodeObj);
                }
                this.roomOnValue = roomOnValue.bind(this);
                this.roomRef.on('value', this.roomOnValue);
            }.bind(this));
        }else{
            _doGuestStuff.call(this);
        }
    }

    function _createChannel(thisInfo){
        // TODO some time guest do not write data
        var id = "";
//            var id = Math.min(this.pairing.pairedMembers[0].serverTime, thisInfo.serverTime)+ "ID_ip";
        if(this.getDeviceInfo().isHost){
            id = this.pairing.pairedMembers[0].deviceID;
        }else{
            id = thisInfo.deviceID;
        }
        this.getDeviceInfo().roomId = id;
        this.roomRef = new Firebase(this.rootUrl + "connected/" + id);
        this.roomRef.onDisconnect().remove();

        if(this.getDeviceInfo().isHost){
            var info = {};
            if(! this.getDeviceInfo().channelID) {
                this.getDeviceInfo().channelID = demobo.Utils.guid();
            }
            info.channelID = this.getDeviceInfo().channelID;
            info.connectionID = demobo.Utils.guid();
            info.host = this.getDeviceInfo().deviceID;
            info.hostInfo = {};
            info.hostInfo["internalIP"] = this.getDeviceInfo().internalIP || "";
            info.hostInfo["userAgent"] = this.getDeviceInfo().userAgent || "";
            this.getDeviceInfo().hostInfo = info.hostInfo;
            info.layers = this.getDeviceInfo().layers;
            info = _.compactObject(info);
            this.roomRef.update(info, function(){
                function roomOnValue(nodeData){
                    var nodeObj = nodeData.val();
                    if (!nodeObj || !nodeObj.guest) return;
                    this.roomRef.off('value', this.roomOnValue);
                    this.successCallback(nodeObj);
                }
                this.roomOnValue = roomOnValue.bind(this);
                this.roomRef.on('value', this.roomOnValue);
            }.bind(this));
        }else{
            _doGuestStuff.call(this);
        }
    }

    function _doGuestStuff(){
        function roomOnValue(nodeData){
            var nodeObj = nodeData.val();
            if (!nodeObj) return;
            var layers = nodeObj.layers;
            nodeObj.layers = _.intersection(layers, this.getDeviceInfo().layers);
            nodeObj.guest = this.getDeviceInfo().deviceID;
            this.roomRef.off('value', this.roomOnValue);
            this.getDeviceInfo().host = nodeObj.host;
            this.getDeviceInfo().channelID = nodeObj.channelID;
            this.getDeviceInfo().hostInfo = nodeObj.hostInfo;
            nodeObj = _.compactObject(nodeObj);
            this.roomRef.update(nodeObj);
            this.successCallback(nodeObj);
        };
        this.roomOnValue = roomOnValue.bind(this);
        this.roomRef.on('value',this.roomOnValue);
    }

    function _findHost(thisInfo){
        var candidate = this.pairing.pairedMembers[0];
        if((thisInfo.isHost && !candidate.isHost) || (! thisInfo.isHost && candidate.isHost)){
            return;
        }
        var isThisMobile = this.isMobile();
        var isPairedMobile = this.isAgentMobile(candidate.userAgent);
        if((isPairedMobile && isThisMobile) ||(! isPairedMobile && ! isThisMobile)  ){
            this.getDeviceInfo().isHost = thisInfo.serverTime <= candidate.serverTime;
        }else if(isPairedMobile && !isThisMobile){
            this.getDeviceInfo().isHost = true;
        }else if(! isPairedMobile && isThisMobile){
            this.getDeviceInfo().isHost = false;
        }
//        this.deviceInfo.isHost = this.isHost;
    }

    function _updateClientInfoTo(ref){
        if(! ref) return;
        var deviceInfoClone = _.compactObject(this.getDeviceInfo());
        deviceInfoClone.serverTime = Firebase.ServerValue.TIMESTAMP;
        var clientInfo = {};
        clientInfo[deviceInfoClone.deviceID] = deviceInfoClone;
        clientInfo = _.compactObject(clientInfo);
        ref.update(clientInfo);
    }

    function _addFirebaseListeners(){
        this.pairingRef.off('child_added');
        this.pairingRef.off('value');
        if (this.options.method=="code" && this.isHost()) {
            this.pairingRef.on('child_added', function(){
                setTimeout(function(){
                    this.pairingRef.once('value', function(firebaseNodeData){
                        this.onPairHandler(firebaseNodeData);
                        _selectPairMembers.call(this);
                    }.bind(this));
                }.bind(this), this.options.paringTolerance);
            }.bind(this));
        } else {
            this.pairingRef.once('child_added', function(){
                setTimeout(function(){
                    this.pairingRef.once('value', function(firebaseNodeData){
                        this.onPairHandler(firebaseNodeData);
                        _selectPairMembers.call(this);
                    }.bind(this));
                }.bind(this), this.options.paringTolerance);
            }.bind(this));
        }
    }

    Discovery.prototype.getDeviceInfo = function () {
        return this.deviceInfo;
    };

    Discovery.prototype.getDeviceID = function () {
        return this.deviceInfo.deviceID;
    };

    Discovery.prototype.isMobile = function () {
        return navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/);
    };
    Discovery.prototype.isAgentMobile = function (agent) {
        return agent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/);
    };

    Discovery.prototype.getAvailableLayers = function () {
        var layers = ["firebase"];
        layers.unshift("websocket:8010");
        layers.unshift("websocket:80");
        if (typeof webrtcDetectedBrowser != 'undefined' && webrtcDetectedBrowser)
            layers.unshift("webrtc");
        if(this.isMobile()){
            if (typeof Alljoyn != 'undefined')
                layers.unshift("alljoyn");
        }
        return layers;
    };

    Discovery.prototype.isSyncHost = function(){
        return this.options.isSyncHost;
    };

    Discovery.prototype.isHost = function(){
        return this.getDeviceInfo().isHost;
    };

    Discovery.prototype.getIPAddress = function(){
        // TODO if cannot get IP
        return this.getDeviceInfo().internalIP;
    };

    Discovery.prototype.getHostIPAddress = function(){
        // TODO if cannot get IP
        return this.getDeviceInfo().hostInfo.internalIP;
    };

    Discovery.prototype.isServer = function(){
        // TODO if cannot get IP
        return this.getDeviceInfo().hostInfo.internalIP === this.getDeviceInfo().internalIP;
    };

    Discovery.prototype.getRoomID = function () {
        // override this method to add more parameters for hashing in the future
        var id = this.deviceInfo.externalID.replace(/\./g,'dot');
        return id;
    };

    Discovery.prototype.onPairingTrigger = function () {
        _addFirebaseListeners.call(this);
        _updateClientInfoTo.call(this, this.pairingRef);
        if (!this.getDeviceInfo().isHost) _removePairingRef.call(this, this.options.dataKeptTime);
        if (this.onPairing) {
            this.onPairing();
            this.pairingTimeout = setTimeout(this.onTimeout, this.options.timeout);
        }
    };

    //----------------- Start of Bump Pairing Methods -----------------//
    Discovery.prototype.startBumpPairing = function(){
        if (!this.deviceInfo.externalID) return;
        var roomURL = this.pairingUrl + this.getRoomID();
        this.pairingRef = new Firebase(roomURL);
        if (this.isMobile()) {
            _addVolumeButtonListener.call(this);
            // _addBumpListener.call(this);
        }
        else {
            _addSpaceBarListener.call(this);
        }
    };

    Discovery.prototype.endBumpPairing = function(){
        _removePairingRef.call(this, 0);
        if (this.isMobile()) {
            _removeVolumeButtonListener.call(this);
            // _removeBumpListener.call(this);
        }
        else {
            _removeSpaceBarListener.call(this);
        }
    };

    //----------------- End of Bump Pairing Methods -----------------//

    //----------------- Start of Code Pairing Methods -----------------//

    Discovery.prototype.startCodePairing = function(){
        if (!this.deviceInfo.externalID) return;
        var roomURL = this.pairingUrl + this.getRoomID();
        this.pairingRef = new Firebase(roomURL);
        if (this.isMobile()) {
            var code = this.options.code || Math.random().toString(36).substr(2, 4);
            this.pairingRef.on('value', function (allSnapshot){
                allSnapshot.forEach(function (snapshot) {
                    if (snapshot.val().code==code)
                        snapshot.ref.remove();
                });
                this.enterCode(code);
            }.bind(this));
        }
    };

    Discovery.prototype.endCodePairing = function(){
        _removePairingRef.call(this, 0);
    };

    Discovery.prototype.enterCode = function(code){
        this.deviceInfo.code = code;
        this.onPairingTrigger();
    };

    Discovery.prototype.connectWIFI = function(internalIP) {
        if (!configs.dev) {
            var channelObj = {
                "channelID":"1ae5d720-6a9f-bb3a-24b4-086811a42d7c",
                "connectionID":"a4e79935-ee0f-8766-da06-6c06d510492e",
                "host":"mobile",
                "hostInfo":{
                    "internalIP":internalIP
                },
                "layers":["websocket:8020"],
                "guest":"web",
                "roomId":"web"
            };
            demobo.communicationLayer.remove(channelObj);
            this.getDeviceInfo().roomId = channelObj.roomId;
            this.getDeviceInfo().host = channelObj.host;
            this.getDeviceInfo().channelID = channelObj.channelID;
            this.getDeviceInfo().hostInfo = channelObj.hostInfo;

            demobo.communicationLayer.options.timeout = null;
            demobo.communicationLayer.add(channelObj, this.onSuccess, this.onFailure);
            console.log('connectWIFI');
        }
    };

    //----------------- End of Code Pairing Methods -----------------//



    //-----------------------------------------------------

//    Discovery.prototype.enableSampleCollect = function(){
//        simpleBump.enableSampleCollect();
//    };
//
//    Discovery.prototype.disableSampleCollect = function(){
//        simpleBump.disableSampleCollect();
//    };



    demobo.Discovery = Discovery;
})();