var demobo=demobo||{};(function(){demobo.init=function(a){Object.apply(this,arguments);demobo.discovery=new demobo.Discovery(a);demobo.discovery.search(function(a){a.channelID&&a.connectionID&&a.layers.length?demobo.communicationLayer.add(a,demobo.discovery.onSuccess,demobo.discovery.onFailure):(demobo.discovery.onFailure(),console.log("Connection failed: no channecl/layer available."))}.bind(this),function(a){demobo.discovery.onFailure();console.log("Connection failed: error ",a)})}})();
if("undefined"==typeof DemoboWebsocket){var DemoboWebsocket=function(a){this.channel=a.channel;this.id=a.id;this.isHost=a.isHost;this.port=a.port;this.internalIP=a.internalIP;setTimeout(this.init.bind(this),1E3)};DemoboWebsocket.prototype=Object.create(Object.prototype);DemoboWebsocket.prototype.constructor=DemoboWebsocket}
DemoboWebsocket.prototype.init=function(){this.socket=new WebSocket("ws://"+this.internalIP+":"+this.port);this.socket.onmessage=this.socketonmessage;this.socket.onopen=this.socketonopen;this.socket.onclose=this.socketonclose};DemoboWebsocket.prototype.send=function(a){this.socket.send(JSON.stringify(a))};DemoboWebsocket.prototype.onMessage=function(a){this.socketonmessage=function(b){a(JSON.parse(b.data))}};DemoboWebsocket.prototype.offMessage=function(){this.socket&&delete this.socket.onmessage};
_.mixin({compactObject:function(a){var b=_.clone(a);_.each(b,function(a,c){a||delete b[c]});return b}});
