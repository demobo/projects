define(function(require, exports, module) {
    var UIButton            = require('controls/UIButton');
    var UIApplication       = require('containers/UIApplication');
    var Slider              = require('controls/UISlider');

    // Create a new demoButton
    var demoButton = new UIButton({
        origin: [0.5, 0.5],
        align: [0.5, 0.35],
        size: [160, 35]
    });

    var x = 0, y = 0, z = 0;

    // 3D rotations - just for fun
    // Transformations are chainable
    var slider = new Slider({
        origin: [0.5, 0.5],
        align: [0.5, 0.55],
    });
    slider.setSize(300, 40);
    slider.on('change', function (argument) {
        x = 2*Math.PI*(argument.value/100);
        demoButton.setRotation(x, y, z);
    });

    var slider2 = new Slider({
        origin: [0.5, 0.5],
        align: [0.5, 0.65],
    });
    slider2.setSize(300, 40);
    slider2.on('change', function (argument) {
        y = 2*Math.PI*(argument.value/100);
        demoButton.setRotation(x, y, z);
    });

    var slider3 = new Slider({
        origin: [0.5, 0.5],
        align: [0.5, 0.75]
    });
    slider3.setSize(300, 40);
    slider3.on('change', function (argument) {
        z = 2*Math.PI*(argument.value/100);
        demoButton.setRotation(x, y, z);
    });

    var app = new UIApplication({
        children: [ demoButton, slider, slider2, slider3 ]
    });
});
