/*globals define*/
define(function(require, exports, module) {
    var UIDialog = require('controls/UIDialog');
    var UIElement = require('core/UIElement');

    var demoDialog = new UIDialog({
        popupSize: [500, 100],
        opened: false,
        backdropColor: 'green'
    });

    demoDialog.on('hidden', function() {
        demoDialog.show();
    });

    demoDialog.popup._addChild(new UIElement({
        style: {
            background: 'red'
        }
    }));

    module.exports = demoDialog;
});
