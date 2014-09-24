/* globals define */
define(function(require, exports, module) {
    var UIButton = require('controls/UIButton');
    var UIApplication = require('containers/UIApplication');
    var UIElement = require('core/UIElement');
    var Timer = require('famous/utilities/Timer');

    // Create a new app
    var app = new UIApplication({
      size: [50, 50]
    }).center();

    var num = 30;
    for (var i = 0; i < num; i++) {
        var demoElement = new UIElement({
            style: {
                backgroundColor: "hsl(" + (i * 360 / 40) + ", 100%, 50%)"
            },
            opacity: 0.1,
            classes: ['backfaceVisibility']
        }).center();
        demoElement.setPosition(0, 0, i - (num / 2));
        app.addChild(demoElement);
    }

    resetClick();

    function randDeg() {
        return Math.PI*Math.random();
    }

    function constantRotation() {
        app.setRotation(randDeg(), randDeg(), randDeg(), {
            duration: 5000*Math.random(),
            curve: 'spring'
        }, constantRotation);
    }

    constantRotation();

    function constantRepositioning() {
        app.setPosition(-Math.random()*100, -Math.random()*100, -Math.random()*100, {
            duration: 5000*Math.random(),
            curve: 'spring'
        }, constantRepositioning);
    }

    constantRepositioning();

    function constantOriginTransform() {
        app.setOrigin(Math.random(), Math.random(), {
            duration: 5000*Math.random(),
            curve: 'spring'
        }, constantOriginTransform);
    }

    constantOriginTransform();

    function click() {
        var demoElements = app.getChildren();
        for (var i = 0; i < demoElements.length; i++) {
            demoElements[i].setPosition(0, 0, Math.pow(i - (demoElements.length/2), 2), {
                duration: 1000,
                curve: 'spring'
            });
            var size = demoElements[i].getSize();
            demoElements[i].setSize(size[0] - i, size[1] - i, {
                duration: 1000,
                curve: 'outElastic'
            });
        }
        Timer.setTimeout(resetClick, 1200);
    }

    function resetClick() {
        var demoElements = app.getChildren();
        for (var i = 0; i < demoElements.length; i++) {
            demoElements[i].setPosition(0, 0, i - (demoElements.length/2), {
                duration: 1000,
                curve: 'spring'
            });
            var size = demoElements[i].getSize();
            demoElements[i].setSize(size[0] + i, size[1] + i, {
                duration: 1000,
                curve: 'outElastic'
            });
        }
        Timer.setTimeout(click, 1200);
    }
});
