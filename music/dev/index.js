define(function(require, exports, module) {
    var UIApplication = require('containers/UIApplication');
    var UIElement = require('core/UIElement');

    var LabelArea = require('./js/components/LabelArea');
    var TouchArea = require('./js/components/TouchArea');

    var config = [
        {title: "Volume", step:.1, color: "green"},
        {title: "Frequency", step:.1, color: "yellow"},
        {title: "Station", step:10, color: "red"},
    ];

    var background = new UIElement({
        style: {
            background: '#333'
        }
    });

    var labelArea = new LabelArea();

    var touchArea = new TouchArea();

    var TouchModel = Backbone.DemoboStorage.Model.extend({
        demoboID: 'touchModel'
    });
    var touchData = new TouchModel({
        id: 'touchModel'
    });
    touchData.on("change", function(model) {
        labelArea.show();
        var data = model.attributes;
        labelArea.update(data);
    });

    touchArea.on("fingerChange", function(data){
        touchData.save(data);
    });
    touchArea.on("fingerHide", function(data){
        labelArea.setDelay(800).hide();
    });
    touchArea.on("fingerShow", function(data){
        labelArea.show();
    });

    var app = new UIApplication();
    app.addChild(background);
    app.addChild(labelArea);
    app.addChild(touchArea);

    initDemobo();

    function initDemobo() {
//        demobo_guid = demobo.Utils.generateCode(5);
        demobo.init({
            isHost: demobo.Utils.isMobile()?true:false,
            appName: "demoboMusic",
            method: "code",
            layers: ["firebase"],
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
