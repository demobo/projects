// Use this file to test out newer controls or just to play around
define(function(require, exports, module) {
    var UIButtonBase = require('controls/UIButtonBase');
    var UIApplication = require('containers/UIApplication');

    var app = new UIApplication({
        children: [
            new UIButtonBase({
                iconPlacement: 'bottom',
                size: [200, 200]
            }).center()
        ]
    });
});
