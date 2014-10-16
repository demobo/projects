define(function(require, exports, module) {
    var UIApplication = require('containers/UIApplication');
    var UIElement = require('core/UIElement');

    var LabelArea = require('./js/components/LabelArea');
    var TouchArea = require('./js/components/TouchArea');
    var Meter = require('./js/components/testMeter');

    var info = [[{title: 'Volume', value: 0}],
                [{title: 'ESPN', value: 'kDybIiiYBQQ'}, {title: 'BBC', value: 'MVM0ny8TYwE'}, {title: 'MTV', value: 'XBf0yJVMSzI'}, {title: 'CollegeHumor', value: 'vd7U3OYziHY'}, {title: 'Comedy', value: 'bCEE0XFNtS0'}],
                [{title: 'GreyScale', value: 1}, {title: 'Sepia', value: 2}, {title: 'Blur', value: 3}, {title: 'Tint', value: 4}, {title: 'Invert', value: 5}],
                [{title: 'Play', value: 0}]];

//    var config = [
//        {title: "Volume", step:.1, color: "green"},
//        {title: "Frequency", step:.1, color: "yellow"},
//        {title: "Station", step:10, color: "red"}
//    ];
    var TouchModel = Backbone.DemoboStorage.Model.extend({
        demoboID: 'touchModel'
    });
    var touchData = new TouchModel({
    });

    var TubeModel = Backbone.DemoboStorage.Model.extend({
        demoboID: 'tube1'
    });
    var tubeModel1 = new TubeModel({
        id: 'tube1'
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
        var data = model.attributes;
        labelArea.update(data);
        if (data.direction == 'y') {
            if (data.count == 1){
                console.log('----volume', info[0][0].value);
                tubeModel1.save('volume',info[0][0].value);
            } else if (count > 6) {
                if (data.count == 2) {
                    console.log('-----video', info[1][data.value].title, info[1][data.value].value);
                    tubeModel1.save('video',info[1][data.value].value); //console.log(data.value);
                } else if (data.count == 3) {
                    console.log('------effect', info[2][data.value].title, info[2][data.value].value);
                    tubeModel1.save('effect',info[2][data.value].value);
                }
            }
            touchArea.show();
            if (count == 6) {
                meter.show(data);
            } else if (count > 6) {
                meter.update(data);
            }
        } else {
            if (data.direction == 't'){
                console.log('------playPause', Date.now())
                tubeModel1.save('playPause', Date.now())
            }
            touchArea.hideLine();

        }
    });
    touchArea.on("fingerChange", function(data){
        processTouchData(data, count, pos, dir);
        count++;
    });
    touchArea.on("fingerTap", function(data){
        processTouchData(data, count, pos, dir);
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
            if (data.count == 1) {
                action = "Volume";
                value = data.value[1];
                info[0][0].value = data.value[1];
            } else if (data.count == 2) {
                action = "Video";
                value = Math.abs((data.value[1])%5);
            } else if (data.count == 3) {
                action = "Effect";
                value = (data.value[1])%5;
            }
        } else if (direction == 't') {
            action = "Play";
            info[3][0].value = Date.now();
        }

        var tData = {
            action: action,
            value: value,
            color: data.color,
            direction: direction,
            y: data.y,
            count: data.count
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
