define(function(require, exports, module) {
    var UIElement            = require('core/UIElement');
    var UIComponent          = require('core/UIComponent');

    var PushButton = UIComponent.extend({
        constructor:function(options) {
            options = options || {};

            this._callSuper(UIComponent, 'constructor', {

            });

        }
    });

    module.exports = PushButton;

});