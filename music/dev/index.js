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
    });

    var background = new UIElement({
        style: {
            background: '#333'
        }
    });

    var labelArea = new LabelArea({
        model: touchData
    });

    var touchArea = new TouchArea({
        model: touchData
    });

    var meter = new Meter();

    var count = 0;
    var pos = [0];
    var dir = [0];
    touchData.on("change", function(model) {
        labelArea.show();
        var data = model.attributes; console.log(data.direction)
        labelArea.update(data);
        if (data.direction == 'y') {
            touchArea.show();
            if (count == 6) {
                meter.show(data);
            } else if (count > 6) {
                meter.update(data);
            }
        } else {
            touchArea.hideLine();
        }
    });
    touchArea.on("fingerChange", function(data){
        processTouchData(data, count, pos, dir);
        count++;
    });
    touchArea.on("fingerTap", function(data){
        processTouchData(data, count, pos, dir); console.log('tap')
    });
    touchArea.on("fingerHide", function(){
        console.log('finger hide')
        touchEnd();
        labelArea.hide();
        meter.hide();
    });
    touchArea.on("fingerShow", function() {
        labelArea.show();
    });

    var app = new UIApplication();
    app.addChild(background);
    app.addChild(labelArea);
    app.addChild(touchArea);
    app.addChild(meter);

    initDemobo();

    function processTouchData(data, count, pos, dir) {
        var action = "";
        var value = "";
        var direction = "undefined";
        var initPos = [];

        if (data.tap && data.count == 1) {
            direction = 't';
        } else {
            pos[count] = touchStart(data);
            if (count >= 5) {
                initPos = pos[5];
            }

            dir[count] = touchFix(data, initPos);
            if (count >= 6) {
                direction = dir[6];
            }
        }

        if (direction == 'x') {
//            value = data.value[0];
//            if (data.count == 1) {
//                action = "Next";
//            } else if (data.count == 2) {
//                action = "Thumb";
//            } else if (data.count == 3) {
//                action = "";
//            }
        } else if (direction == 'y') {
            value = data.value[1];
            if (data.count == 1) {
                action = "Volume";
            } else if (data.count == 2) {
                action = "Playlist";
            } else if (data.count == 3) {
                action = "Source";
            }
        } else if (direction == 't') {
            action = "Play";
        }

        var tData = {
            action: action,
            value: value,
            color: data.color,
            direction: direction,
            y: data.y,
            count: data.count,
        };
        touchData.save(tData);
    }

    function touchStart(data) {
        var pos = [data.x, data.y];
        return pos;
    }

    function touchFix(data, initPos) {
        var dx = Math.abs(data.x - initPos[0]);
        var dy = Math.abs(data.y - initPos[1]);

        if (dx > dy) {
            var direction = 'x';
        } else if (dx < dy) {
            direction = 'y';
        } else if (dx == 0 && dy == 0) {
            direction = 't';
        } else {
            direction = 'u';
        }
        return direction;
    }

    function touchEnd() {
        count = 0;
        pos = [0];
        dir = [0];
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
