/* globals define */
define(function(require, exports, module) {
    var UIButton = require('controls/UIButton');
    var UIApplication = require('containers/UIApplication');

    var app = new UIApplication({
        children: [
            new UIButton({
                     size: [160, 35]
                }).center()
        ]
    });

    var demoButton = app.getChildren()[0];
    demoButton.on('click', function() {
        constantRotation();
        constantRepositioning();
        constantOriginTransform();
    });


    function constantRotation() {
        var randDeg = Math.PI*Math.random();
        demoButton.setRotation(randDeg*0.9, randDeg*5, randDeg*5, {
            duration: 2000*Math.random(),
            curve: 'spring'
        }, constantRotation);
    }

    function constantRepositioning() {
        demoButton.setPosition(Math.random()*100-Math.random()*100, Math.random()*100-Math.random()*100, Math.random()*100, {
            duration: 3000*Math.random(),
            curve: 'spring'
        }, constantRepositioning);
    }

    function constantOriginTransform() {
        demoButton.setOrigin(Math.random(), Math.random(), {
            duration: 2000*Math.random(),
            curve: 'spring'
        }, constantOriginTransform);
    }
});
