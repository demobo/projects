define(function(require, exports, module) {
    var UIApplication = require('containers/UIApplication');
    var UIElement = require('core/UIElement');

    var LabelArea = require('./js/components/LabelArea');
    var TouchArea = require('./js/components/TouchArea');
    var Meter = require('./js/components/testMeter');

    var info = [[{title: 'Volume', value: 0}],
                [{title: 'BBC Animals', value: 'EQ1HKCYJM5U'}, {title: 'Lindsey Stirling', value: 'aHjpOzsQ9YI'}, {title: 'CollegeHumor', value: 'X-YCdcnf_P8'}, {title: 'Supernatural', value: 'vDYBrWP1Iwg'}, {title: 'Sam Tsui', value: 'a2RA0vsZXf8'},
                 {title: 'Ellen Show', value: 'In9XbjyCbnY'}, {title: 'Disney', value: '8IdMPpKMdcc'}, {title: 'Pokemon', value: 'Eghk9bVNN9M'}, {title: 'Omelette', value: 'jXFldV3ImU0'}, {title: 'ESPN', value: '3GFSnsWwn8k'}],
                [{title: 'Normal', value: 0}, {title: 'GreyScale', value: 1}, {title: 'Sepia', value: 2}, {title: 'Blur', value: 3}, {title: 'Invert', value: 4}],
                [{color: '#ddd'}, {color: "#00d8ff"}, {color: "#C4CF47"}]];

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
        model: tubeModel1
    });

    var touchArea = new TouchArea({
        model: touchData
    });

    var meter = new Meter();

    var count = 0;
    var pos = [0];
    var dir = [0];
    touchData.on("change", function(model) {
        var data = model.attributes;
//        labelArea.show(data);
//        labelArea.update(data);

        if (data.direction == 'y') {
            if (data.count == 1){
//                console.log('----volume', info[0][0].value);
                tubeModel1.save('volume',info[0][0].value);
                tubeModel1.save('color', info[3][0].color);
            } else if (count > 6) {
                if (data.count == 2) {
//                    console.log('-----video', info[1][data.value].title, info[1][data.value].value);
                    tubeModel1.save('video',info[1][data.value].value);
                    tubeModel1.save('channel', info[1][data.value].title);
                    tubeModel1.save('color', info[3][1].color);
                } else if (data.count == 3) {
//                    console.log('------effect', info[2][data.value].title, info[2][data.value].value);
                    tubeModel1.save('effect', info[2][data.value].value);
                    tubeModel1.save('effectName', info[2][data.value].title)
                    tubeModel1.save('color', info[3][2].color);
                }
            }
            touchArea.showLine();
            if (count == 6) {
                meter.show(data);
            } else if (count > 6) {
                meter.update(data);
            }
        } else {
            if (data.direction == 't'){
//                console.log('------playPause', Date.now())
                tubeModel1.save('playPause', Date.now())
                tubeModel1.save('color', info[3][0].color);
            }
            touchArea.hideLine();
        }
    });
    tubeModel1.on("change", function(model) {
        var data = model.attributes;
        labelArea.show();
        labelArea.update(data);
    });

    touchArea.on("fingerChange", function(data){
        processTouchData(data, count, pos, dir);
        count++;
    });
    touchArea.on("fingerTap", function(data){
        processTouchData(data, count, pos, dir);
    });
    touchArea.on("fingerHide", function(){
        touchEnd();
        labelArea.hide();
//        labelArea.setDelay(300, labelArea.hide.bind(labelArea));
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
                value = data.value[1];
                info[0][0].value = data.value[1];
            } else if (data.count == 2) {
                value = Math.abs((data.value[1])%10);
            } else if (data.count == 3) {
                value = (data.value[1])%5;
            }
        }

        var tData = {
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
