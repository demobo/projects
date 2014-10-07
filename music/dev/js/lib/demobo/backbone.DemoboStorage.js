/**
 * Backbone DemoboStorage Adapter
 * Version 1.0.0
 *
 */
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

    var communicationLayer = demobo.communicationLayer;
    var rpc = communicationLayer.rpc.bind(communicationLayer);
    var instances = {};
    var prefix = "DemoboStorage-";

    function initialize() {
        function onMessage(message) {
            var data = jsonData(message);
            var method = data[0];
            var localStorageName = data[1][0];
            if (method=="_remoteSync") {
                if (!localStorageName) {
                    _(instances).map(function(instance) {
                        instance.localStorage._remoteSync.call(instance.localStorage);
                    });
                } else {
                    var instance = instances[localStorageName]
                    if (instance) instance.localStorage._remoteSync.call(instance.localStorage);
                }
            } else if (method=="_remoteSyncStart") {
                var instance = instances[localStorageName]
                if (instance) instance.localStorage._clear.call(instance.localStorage);
            } else if (method=="_setItem") {
                var storageArguments = _.toArray(data[1]);
                if (_(communicationLayer.targets).size()>1 && localStorage.__proto__.setItem.apply(localStorage, storageArguments)) {
//                    _(instances).map(function(instance) {
//                        instance.handleStorageEvent.apply(instance, storageArguments);
//                    });
                    emitStorageEvt.apply(window, storageArguments);
                } else {
                    localStorage.__proto__._setItem.apply(localStorage, storageArguments);
//                    _(instances).map(function(instance) {
//                        instance.handleStorageEvent.apply(instance, storageArguments);
//                    });
                    emitStorageEvt.apply(window, storageArguments);
                }
            } else if (method=="_removeItem") {
                var storageArguments = _.toArray(data[1]);
                if (_(communicationLayer.targets).size()>1 && localStorage.__proto__.removeItem.apply(localStorage, storageArguments)) {
//                    _(instances).map(function(instance) {
//                        instance.handleStorageEvent.apply(instance, storageArguments);
//                    });
                    emitStorageEvt.apply(window, storageArguments);
                } else {
                    localStorage.__proto__._removeItem.apply(localStorage, storageArguments);
//                    _(instances).map(function(instance) {
//                        instance.handleStorageEvent.apply(instance, storageArguments);
//                    });
                    emitStorageEvt.apply(window, storageArguments);
                }
            } else if (method=="_remoteSyncEnd") {
                var instance = instances[localStorageName]
                if (instance) instance.fetch.call(instance);
            } else if (method=="_debug") {
                console.log("_debug", data);
            }
        }
        communicationLayer.onMessage.call(communicationLayer, onMessage);

        function emitStorageEvt(storageKey, storageValue) {
            var event = new CustomEvent("storage");
            event.key = storageKey;
            event.newValue = storageValue;
            window.dispatchEvent(event);
        }

        function onStorage(evt) {
            _(instances).map(function(instance) {
                instance.onStorage.call(instance, evt);
            });
        }
        if (window.addEventListener) {
            window.addEventListener('storage', onStorage, false);
        }
        else {
            window.attachEvent('onstorage', onStorage);
        }
    }
    initialize();

    // Generate four random hex digits.
    function S4() {
        return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };

    // Generate a pseudo-GUID by concatenating random hexadecimal.
    function guid() {
        return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
    };

    function jsonData(data) {
        return data && JSON.parse(data);
    };

    // Our Store is represented by a single JS object in *localStorage*. Create it
    // with a meaningful name, like the name you'd give a table.
    Backbone.DemoboStorage = function(options) {
        this.name = prefix + options.name;
        this.restore();
    };

    _.extend(Backbone.DemoboStorage.prototype, {
        // Updates this.records
        restore: function () {
            var store = this.localStorage().getItem(this.name);
            this.records = (store && store.split(",")) || [];
        },

        // Save the current state of the **Store** to *localStorage*.
        save: function() {
            this.localStorage().setItem(this.name, this.records.join(","));
        },

        // Add a model, giving it a (hopefully)-unique GUID, if it doesn't already
        // have an id of it's own.
        create: function(model) {
            if (!model.id) {
                model.id = guid();
                model.set(model.idAttribute, model.id);
            }
            this.localStorage().setItem(this.name+"-"+model.id, JSON.stringify(model));
            this.records.push(model.id.toString());
            this.save();
            return this.find(model);
        },

        // Update a model by replacing its copy in `this.data`.
        update: function(model) {
            this.localStorage().setItem(this.name+"-"+model.id, JSON.stringify(model));
            if (!_.include(this.records, model.id.toString()))
                this.records.push(model.id.toString()); this.save();
            return this.find(model);
        },

        // Retrieve a model from `this.data` by id.
        find: function(model) {
            return jsonData(this.localStorage().getItem(this.name+"-"+model.id));
        },

        // Return the array of all models currently in storage.
        findAll: function() {
            return _(this.records).chain()
                .map(function(id){
                    return jsonData(this.localStorage().getItem(this.name+"-"+id));
                }, this)
                .compact()
                .value();
        },

        // Delete a model from `this.data`, returning it.
        destroy: function(model) {
            if (model.isNew())
                return false;
            this.localStorage().removeItem(this.name+"-"+model.id);
            this.records = _.reject(this.records, function(id){
                return id === model.id.toString();
            });
            this.save();
            return model;
        },

        localStorage: function() {
            return localStorage;
        },

        // Clear localStorage for specific collection.
        _clear: function() {
            var local = this.localStorage(),
                itemRe = new RegExp("^" + this.name + "-");

            // Remove id-tracking item (e.g., "foo").
            local._removeItem(this.name);

            // Match all data items (e.g., "foo-ID") and remove.
            _.chain(local).keys()
                .filter(function (k) { return itemRe.test(k); })
                .each(function (k) { local._removeItem(k); });
        },

        // Size of localStorage.
        _storageSize: function() {
            return this.localStorage().length;
        },

        _remoteSync: function() {
            rpc("_remoteSyncStart", [this.name]);
            setTimeout(function() {
                var local = this.localStorage(),
                    itemRe = new RegExp("^" + this.name + "-");
                rpc("_setItem", [this.name, local.getItem(this.name)]);
                _.chain(local).keys()
                    .filter(function (k) { return itemRe.test(k); })
                    .each(function (k) {
                        rpc("_setItem", [k, local.getItem(k)]);
                    });
                rpc("_remoteSyncEnd", [this.name]);
            }.bind(this), 1000);
        }

    });

    // localSync delegate to the model or collection's
    // *localStorage* property, which should be an instance of `Store`.
    Backbone.DemoboStorage.sync = Backbone.localSync = function(method, model, options) {
        var store = model.localStorage || model.collection.localStorage;
        var resp, errorMessage, syncDfd = $.Deferred && $.Deferred(); //If $ is having Deferred - use it.

        try {

            switch (method) {
                case "read":
                    resp = model.id != undefined ? store.find(model) : store.findAll();
                    break;
                case "create":
                    resp = store.create(model);
                    break;
                case "update":
                    resp = store.update(model);
                    break;
                case "delete":
                    resp = store.destroy(model);
                    break;
            }

        } catch(error) {
            if (error.code === DOMException.QUOTA_EXCEEDED_ERR && store._storageSize() === 0)
                errorMessage = "Private browsing is unsupported";
            else
                errorMessage = error.message;
        }

        if (resp) {
            model.trigger("sync", model, resp, options);
            if (options && options.success)
                if (Backbone.VERSION === "0.9.10") {
                    options.success(model, resp, options);
                } else {
                    options.success(resp);
                }
            if (syncDfd)
                syncDfd.resolve(resp);

        } else {
            errorMessage = errorMessage ? errorMessage : "Record Not Found";

            model.trigger("error", model, errorMessage, options);
            if (options && options.error)
                if (Backbone.VERSION === "0.9.10") {
                    options.error(model, errorMessage, options);
                } else {
                    options.error(errorMessage);
                }
            if (syncDfd)
                syncDfd.reject(errorMessage);
        }

        // add compatibility with $.ajax
        // always execute callback for success and error
        if (options && options.complete) options.complete(resp);

        return syncDfd && syncDfd.promise();
    };

    Backbone.ajaxSync = Backbone.sync;

    Backbone.getSyncMethod = function(model) {
        if(model.localStorage || (model.collection && model.collection.localStorage)) {
            return Backbone.localSync;
        }
        return Backbone.ajaxSync;
    };

    // Override 'Backbone.sync' to default to localSync,
    // the original 'Backbone.sync' is still available in 'Backbone.ajaxSync'
    Backbone.sync = function(method, model, options) {
        return Backbone.getSyncMethod(model).apply(this, [method, model, options]);
    };

    /* demobo remote rpc add on */
    localStorage.__proto__._setItem = localStorage.__proto__.setItem;
    localStorage.__proto__.setItem = function() {
        var key = arguments[0];
        var value = arguments[1];
        if (localStorage.getItem(key) == value)
            return false;
        if (key.indexOf(prefix)==0) {
//            console.log(value.length);
//            if (value.length>5000) {
//                rpc("_setBigItem", arguments);
//                return false;
//            }
            rpc("_setItem", arguments);
        }
        localStorage.__proto__._setItem.apply(this, arguments);
        return true;
    };

    localStorage.__proto__._removeItem = localStorage.__proto__.removeItem;
    localStorage.__proto__.removeItem = function() {
        var key = arguments[0];
        var value = arguments[1];
        if (localStorage.getItem(key) == value)
            return false;
        if (key.indexOf(prefix)==0)
            rpc("_removeItem", arguments);
        localStorage.__proto__._removeItem.apply(this, arguments);
        return true;
    };

    Backbone.DemoboStorage.Collection = Backbone.Collection.extend({
        initialize: function() {
            this.localStorage = new Backbone.DemoboStorage({
                name: this.demoboID
            });
            instances[this.localStorage.name] = this;
        },
        handleStorageEvent: function(storageKey,storageValue) {
            if (storageKey === this.localStorage.name) {
                this.localStorage.restore();
            } else {
                var modelID = storageKey.split(this.localStorage.name + "-")[1];
                if (modelID) {
                    if (storageValue) {
                        var modelAttr = jsonData(storageValue);
                        this.add.call(this, [modelAttr], {silent: false, merge: true});
                    } else {
                        var instance = this.get(modelID);
                        if (instance) {
                            instance.trigger('destroy', instance, this);
                        }
                    }
                }
            }
        },
        onStorage : function (evt) {
            var storageKey = evt.key;
            var storageValue = this.localStorage.localStorage().getItem(evt.key);
            this.handleStorageEvent.call(this, storageKey, storageValue);
        }
    });

    Backbone.DemoboStorage.Model = Backbone.Model.extend({
        initialize: function() {
            this.localStorage = new Backbone.DemoboStorage({
                name: this.demoboID
            });
            instances[this.localStorage.name] = this;
        },
        handleStorageEvent: function(storageKey,storageValue) {
            if (storageKey === this.localStorage.name) {
                this.localStorage.restore();
            } else {
                var modelID = storageKey.split(this.localStorage.name + "-")[1];
                if (modelID == this.id) {
                    if (storageValue) {
                        var modelAttr = jsonData(storageValue);
                        this.save(modelAttr);
                    } else {
                        var instance = this;
                        if (instance) {
                            instance.trigger('destroy', instance, this);
                        }
                    }
                }
            }
        },
        onStorage : function (evt) {
            var storageKey = evt.key;
            var storageValue = this.localStorage.localStorage().getItem(evt.key);
            this.handleStorageEvent.call(this, storageKey, storageValue);
        }
    });

    return Backbone.DemoboStorage;
}));