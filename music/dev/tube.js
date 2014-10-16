define(function(require, exports, module) {
    var UIApplication = require('containers/UIApplication');
    var Tube = require('./js/components/Tube');
    var LabelArea = require('./js/components/LabelArea');

    var TubeModel = Backbone.DemoboStorage.Model.extend({
        demoboID: 'tube1'
    });
    var tubeModel1 = new TubeModel({
        id: 'tube1'
    });
    var tube1 = new Tube({
        id: 'tube1',
        model: tubeModel1
    });
    window.tube1 = tube1;

    var tubeLabel = new LabelArea({
        id: 'tube1',
        model: tubeModel1
    });
    tubeLabel.setPosition(0,0,1);
    window.tubeLabel = tubeLabel;

    var app = new UIApplication();
    app.addChild(tube1);
    app.addChild(tubeLabel);

    tubeModel1.on('change', function(model){
       var data = model.attributes;
       tubeLabel.show();
       tubeLabel.update(data);
    });

    tubeLabel.on('hide', function() {
        tubeLabel.setDelay(300, tubeLabel.hide.bind(tubeLabel));
    });

    initDemobo();
    function initDemobo() {
        console.log('init')
        demobo.init({
            isHost: demobo.Utils.isMobile()?true:false,
            appName: "demoboMusic",
            method: "code",
            layers: ["webrtc"],
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
        setTimeout(function() {
            demobo.discovery.enable();
            demobo.discovery.enterCode(1234);
        }, 2000);
    }

});
