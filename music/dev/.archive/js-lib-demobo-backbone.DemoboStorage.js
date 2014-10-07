(function(e,d){"function"===typeof define&&define.amd?define(["underscore","backbone"],function(f,g){return d(f||e._,g||e.Backbone)}):d(_,Backbone)})(this,function(e,d){function f(){return(65536*(1+Math.random())|0).toString(16).substring(1)}function g(a){return a&&JSON.parse(a)}var l=demobo.communicationLayer,m=l.rpc.bind(l),h={};(function(){function a(a,c){var d=new CustomEvent("storage");d.key=a;d.newValue=c;window.dispatchEvent(d)}function c(a){e(h).map(function(c){c.onStorage.call(c,a)})}l.onMessage.call(l,
function(b){b=g(b);var c=b[0],d=b[1][0];"_remoteSync"==c?d?(b=h[d])&&b.localStorage._remoteSync.call(b.localStorage):e(h).map(function(a){a.localStorage._remoteSync.call(a.localStorage)}):"_remoteSyncStart"==c?(b=h[d])&&b.localStorage._clear.call(b.localStorage):"_setItem"==c?(b=e.toArray(b[1]),1<e(l.targets).size()&&localStorage.__proto__.setItem.apply(localStorage,b)||localStorage.__proto__._setItem.apply(localStorage,b),a.apply(window,b)):"_removeItem"==c?(b=e.toArray(b[1]),1<e(l.targets).size()&&
localStorage.__proto__.removeItem.apply(localStorage,b)||localStorage.__proto__._removeItem.apply(localStorage,b),a.apply(window,b)):"_remoteSyncEnd"==c?(b=h[d])&&b.fetch.call(b):"_debug"==c&&console.log("_debug",b)});window.addEventListener?window.addEventListener("storage",c,!1):window.attachEvent("onstorage",c)})();d.DemoboStorage=function(a){this.name="DemoboStorage-"+a.name;this.restore()};e.extend(d.DemoboStorage.prototype,{restore:function(){var a=this.localStorage().getItem(this.name);this.records=
a&&a.split(",")||[]},save:function(){this.localStorage().setItem(this.name,this.records.join(","))},create:function(a){a.id||(a.id=f()+f()+"-"+f()+"-"+f()+"-"+f()+"-"+f()+f()+f(),a.set(a.idAttribute,a.id));this.localStorage().setItem(this.name+"-"+a.id,JSON.stringify(a));this.records.push(a.id.toString());this.save();return this.find(a)},update:function(a){this.localStorage().setItem(this.name+"-"+a.id,JSON.stringify(a));e.include(this.records,a.id.toString())||this.records.push(a.id.toString());
this.save();return this.find(a)},find:function(a){return g(this.localStorage().getItem(this.name+"-"+a.id))},findAll:function(){return e(this.records).chain().map(function(a){return g(this.localStorage().getItem(this.name+"-"+a))},this).compact().value()},destroy:function(a){if(a.isNew())return!1;this.localStorage().removeItem(this.name+"-"+a.id);this.records=e.reject(this.records,function(c){return c===a.id.toString()});this.save();return a},localStorage:function(){return localStorage},_clear:function(){var a=
this.localStorage(),c=RegExp("^"+this.name+"-");a._removeItem(this.name);e.chain(a).keys().filter(function(a){return c.test(a)}).each(function(b){a._removeItem(b)})},_storageSize:function(){return this.localStorage().length},_remoteSync:function(){m("_remoteSyncStart",[this.name]);setTimeout(function(){var a=this.localStorage(),c=RegExp("^"+this.name+"-");m("_setItem",[this.name,a.getItem(this.name)]);e.chain(a).keys().filter(function(a){return c.test(a)}).each(function(b){m("_setItem",[b,a.getItem(b)])});
m("_remoteSyncEnd",[this.name])}.bind(this),1E3)}});d.DemoboStorage.sync=d.localSync=function(a,c,b){var e=c.localStorage||c.collection.localStorage,f,k,g=$.Deferred&&$.Deferred();try{switch(a){case "read":f=void 0!=c.id?e.find(c):e.findAll();break;case "create":f=e.create(c);break;case "update":f=e.update(c);break;case "delete":f=e.destroy(c)}}catch(h){k=h.code===DOMException.QUOTA_EXCEEDED_ERR&&0===e._storageSize()?"Private browsing is unsupported":h.message}f?(c.trigger("sync",c,f,b),b&&b.success&&
("0.9.10"===d.VERSION?b.success(c,f,b):b.success(f)),g&&g.resolve(f)):(k=k?k:"Record Not Found",c.trigger("error",c,k,b),b&&b.error&&("0.9.10"===d.VERSION?b.error(c,k,b):b.error(k)),g&&g.reject(k));b&&b.complete&&b.complete(f);return g&&g.promise()};d.ajaxSync=d.sync;d.getSyncMethod=function(a){return a.localStorage||a.collection&&a.collection.localStorage?d.localSync:d.ajaxSync};d.sync=function(a,c,b){return d.getSyncMethod(c).apply(this,[a,c,b])};localStorage.__proto__._setItem=localStorage.__proto__.setItem;
localStorage.__proto__.setItem=function(){var a=arguments[0],c=arguments[1];if(localStorage.getItem(a)==c)return!1;0==a.indexOf("DemoboStorage-")&&m("_setItem",arguments);localStorage.__proto__._setItem.apply(this,arguments);return!0};localStorage.__proto__._removeItem=localStorage.__proto__.removeItem;localStorage.__proto__.removeItem=function(){var a=arguments[0],c=arguments[1];if(localStorage.getItem(a)==c)return!1;0==a.indexOf("DemoboStorage-")&&m("_removeItem",arguments);localStorage.__proto__._removeItem.apply(this,
arguments);return!0};d.DemoboStorage.Collection=d.Collection.extend({initialize:function(){this.localStorage=new d.DemoboStorage({name:this.demoboID});h[this.localStorage.name]=this},handleStorageEvent:function(a,c){if(a===this.localStorage.name)this.localStorage.restore();else{var b=a.split(this.localStorage.name+"-")[1];b&&(c?(b=g(c),this.add.call(this,[b],{silent:!1,merge:!0})):(b=this.get(b))&&b.trigger("destroy",b,this))}},onStorage:function(a){var c=a.key;a=this.localStorage.localStorage().getItem(a.key);
this.handleStorageEvent.call(this,c,a)}});d.DemoboStorage.Model=d.Model.extend({initialize:function(){this.localStorage=new d.DemoboStorage({name:this.demoboID});h[this.localStorage.name]=this},handleStorageEvent:function(a,c){if(a===this.localStorage.name)this.localStorage.restore();else if(a.split(this.localStorage.name+"-")[1]==this.id)if(c){var b=g(c);this.save(b)}else this&&this.trigger("destroy",this,this)},onStorage:function(a){var c=a.key;a=this.localStorage.localStorage().getItem(a.key);
this.handleStorageEvent.call(this,c,a)}});return d.DemoboStorage});