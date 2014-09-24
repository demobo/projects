define(function(require, exports, module) {
    var UIApplication = require('containers/UIApplication');
    var UIElement = require('core/UIElement');

    var LabelArea = require('./components/LabelArea');
    var TouchArea = require('./components/TouchArea');

    var Transitionable = require('famous/transitions/Transitionable');

    var background = new UIElement({
        style: {
            background: '#333'
        }
    });

    var labelArea = new LabelArea();

    var touchArea = new TouchArea();

    touchArea.on("fingerChange", function(data){
        labelArea.update(data);
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

});
