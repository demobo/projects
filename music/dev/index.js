define(function(require, exports, module) {
    var UIApplication = require('containers/UIApplication');
    var UIElement = require('core/UIElement');

    var LabelArea = require('./js/components/LabelArea');
    var TouchArea = require('./js/components/TouchArea');
    var Meter = require('./js/components/testMeter');

    var config = [
        {title: "Volume", step:.1, color: "green"},
        {title: "Frequency", step:.1, color: "yellow"},
        {title: "Station", step:10, color: "red"}
    ];

    var touchData = new TouchModel({
        id: 'touchModel'
    });

    var background = new UIElement({
        style: {
            background: '#333'
        }
    });

    var labelArea = new LabelArea({
        model: touchModel
    });

    var touchArea = new TouchArea();

    var meter = new Meter();

    var TouchModel = Backbone.DemoboStorage.Model.extend({
        demoboID: 'touchModel'
    });

    var count = 0;
    touchData.on("change", function(model) {
        labelArea.show();
        var data = model.attributes;
        labelArea.touchStart(data,count);
        labelArea.touchCount(data,count);
        labelArea.update(data);
        if (count == 0) {
            meter.emit('eventstart', data)
        } else if (count > 0) {
            meter.emit('eventupdate', data)
        }
    });
    touchArea.on("fingerChange", function(data){
        processTouchData(data);
        count++;
    });
    touchArea.on("tap", function(data){
        processTouchData(data);
        count = 0;
    });
    touchArea.on("fingerHide", function(data){
        labelArea.touchEnd();
        labelArea.setDelay(600).hide();
        count = 0;
        meter.emit('eventend')
    });
    touchArea.on("fingerShow", function(data){
        labelArea.show();
    });

    var app = new UIApplication();
    app.addChild(background);
    app.addChild(labelArea);
    app.addChild(touchArea);
    app.addChild(meter);

    initDemobo();

    function processTouchData(data) {
        // do some processing figuring out action and value
        var tData = {
            action: "volume",
            value: 50,
            color: "yellow"
        };
        touchData.save(tData);
    }

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
