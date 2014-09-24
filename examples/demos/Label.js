/*globals define*/
define(function(require, exports, module) {
    var UILabel = require('controls/UILabel');
    var UIComponent = require('core/UIComponent');

    var demoLabel = new UILabel({
        content: 'Test',
        style: {
            background: 'red'
        }
    });

    var container = new UIComponent();
    container._addChild(demoLabel);

    module.exports = container;
});
