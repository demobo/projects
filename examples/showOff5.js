/* globals define */
define(function(require, exports, module) {
    var UIApplication       = require('containers/UIApplication');
    var UIElement           = require('core/UIElement');

    // Create a new app
    var app = new UIApplication({
        size: [50, 50]
    }).center();

    var num = 100;
    var demoElement;
    for (var i = 0; i < num; i++) {
        demoElement = new UIElement({
            style: {
                backgroundColor: "hsl(" + (i * 360 / 40) + ", 100%, 50%)"
            },
            opacity: 0.1,
            classes: ['backfaceVisibility'],
            size: [i+5, i+5]
        }).center();
        demoElement.setPosition(0, 0, -num*3*0.5 + i*3);
        app.addChild(demoElement);
    }

    demoElement.on('dragUpdate', function dragUpdate(event) {
        event.clientX = event.clientX / 2;
        event.clientY = event.clientY / 2;
        app.setRotation(event.clientX/100 % Math.PI, event.clientY/100 % Math.PI, 0);
        var demoElements = app.getChildren();
        for (var i = 0; i < demoElements.length; i++) {
            var offset = (event.clientX/100) / (event.clientY/100);
            demoElements[i].setPosition(0, 0, -num*offset*0.5 + i*offset);
        }
    });
    demoElement.on('dragEnd', function dragEnd(event) {
        var demoElements = app.getChildren();
        for (var i = 0; i < demoElements.length; i++) {
            demoElements[i].setPosition(0, 0, -num*3*0.5 + i*3, {method : 'spring',   dampingRatio : 0.5, period : 500});
        }
        app.setRotation(0, 0, 0, {method : 'wall',   dampingRatio : 0.5, period : 500});
    });
});
