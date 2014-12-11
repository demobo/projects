define(function(require, exports, module) {
    var UIApplication = require('containers/UIApplication');
    var TouchArea = require('./js/components/TouchArea');
    var InputArea = require('./js/components/InputArea');
    var LabelArea = require('./js/components/LabelArea');

    var DataModel = Backbone.DemoboStorage.Model.extend({});

    var dataModel1 = new DataModel({
    });

    var inputArea = new InputArea({
        model: dataModel1
    });

    var labelArea = new LabelArea({
        model: dataModel1
    });

    var app = new UIApplication();

    app.addChild(inputArea);
    app.addChild(labelArea);

    dataModel1.on("change", function(model) {
        var data = model.attributes;
//        console.log(data);
    });


    initDemobo();

    function processTouchData(data, count, pos, dir) {
        var action = "";
        var value = "";
        var direction = "undefined";
        var initPos = [];

//       console.log(data.tap, count, data.count);
        pos[count] = touchStart(data);
        if (data.tap && pos[2] == 0) {
            direction = 't';
        }
        if (count >= 5) {
            initPos = pos[5];
        }

        dir[count] = touchFix(data, initPos);
        if (count >= 6) {
            direction = dir[6];
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
            tap: data.tap
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
        pos = [0,0,0,0,0];
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
