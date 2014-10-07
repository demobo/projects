var demobo = demobo || {};

(function() {
    var FireModel = demobo.FireModel;

    var FireCollection = Backbone.Firebase.Collection.extend({
        model: FireModel
    });
    demobo.FireCollection = FireCollection;
})();