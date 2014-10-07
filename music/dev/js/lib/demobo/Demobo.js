var demobo = demobo || {};

(function() {

    demobo.init = function(options) {
        Object.apply(this, arguments);
        demobo.discovery = new demobo.Discovery(options);
        demobo.discovery.search(function(channelObj){
            if (channelObj.channelID && channelObj.connectionID && channelObj.layers.length) {
                demobo.communicationLayer.add(channelObj,demobo.discovery.onSuccess, demobo.discovery.onFailure);
            } else {
                demobo.discovery.onFailure();
                console.log("Connection failed: no channecl/layer available.");
            }
        }.bind(this), function(err){
            demobo.discovery.onFailure();
            console.log("Connection failed: error ", err);
        });
    };

})();

if (typeof(DemoboWebsocket) == "undefined") {
    function DemoboWebsocket(options) {
        this.channel = options.channel;
        this.id = options.id;
        this.isHost = options.isHost;
        this.port = options.port;
        this.internalIP = options.internalIP;
        setTimeout(this.init.bind(this), 1000);
    }
    DemoboWebsocket.prototype = Object.create(Object.prototype);
    DemoboWebsocket.prototype.constructor = DemoboWebsocket;
}

DemoboWebsocket.prototype.init = function(){
    this.socket =  new WebSocket("ws://" + this.internalIP + ":" + this.port);
    this.socket.onmessage = this.socketonmessage;
    this.socket.onopen = this.socketonopen;
    this.socket.onclose = this.socketonclose;
};

DemoboWebsocket.prototype.send = function(message){
    this.socket.send(JSON.stringify(message));
};
DemoboWebsocket.prototype.onMessage = function(callback){
    this.socketonmessage = function(evt) {
        callback(JSON.parse(evt.data));
    };
};
DemoboWebsocket.prototype.offMessage = function(){
    if (this.socket) delete this.socket.onmessage;
};

_.mixin({
    compactObject : function(o) {
        var clone = _.clone(o);
        _.each(clone, function(v, k) {
            if(!v) {
                delete clone[k];
            }
        });
        return clone;
    }
});