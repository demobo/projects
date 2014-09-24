/*globals define*/
define(function(require, exports, module) {
    var IconElement = require('elements/IconElement');

    var Transform = require('famous/core/Transform');
    var Easing = require('famous/transitions/Easing');

    var demoIconElement = new IconElement();

    demoIconElement.setTransform(Transform.translate(100, 100), {
        curve: Easing.outBounce,
        duration: 1000
    });

    module.exports = demoIconElement;
});
