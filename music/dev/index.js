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
    var TouchModel = Backbone.DemoboStorage.Model.extend({
        demoboID: 'touchModel'
    });
    var touchData = new TouchModel({
        id: 'touchModel'
    });

    var background = new UIElement({
        style: {
            background: '#333'
        }
    });

    var labelArea = new LabelArea({
        model: TouchModel
    });

    var touchArea = new TouchArea();

    var meter = new Meter();



    var count = 0;
    touchData.on("change", function(model) {
        labelArea.show();
        var data = model.attributes;
        labelArea.update(data);
        if (count == 0) {
            meter.emit('eventstart', data)
        } else if (count > 0) {
            meter.emit('eventupdate', data)
        }
    });
    touchArea.on("fingerChange", function(data){
        processTouchData(data, count);
        count++;
    });
    touchArea.on("tap", function(data){
        processTouchData(data, count);
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

    function processTouchData(data, count) {
        var action = "";
        var value = "";
        var direction = "undefined"

        if (count == 0) {
            initPos = [data.x, data.y];
        }

        var dx = Math.abs(data.x - initPos[0]);
        var dy = Math.abs(data.y - initPos[1]);
        if (dx >= dy) {
            direction = 'x';
        } else if (dx < dy) {
            direction = 'y';
        }


        if (direction == 'x') {
            value = data.value[0];
            if (data.count == 1) {
                action = "Next";
            } else if (data.count == 2) {
                action = "Thumb";
            } else if (data.count == 3) {
                action = "";
            }
        } else if (direction == 'y') {
            value = data.value[1];
            if (data.count == 1) {
                action = "Volume";
            } else if (data.count == 2) {
                action = "Playlist";
            } else if (data.count == 3) {
                action = "Source";
            }
        }

        // do some processing figuring out action and value
        var tData = {
            action: action,
            value: value,
            color: data.color
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
