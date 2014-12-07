// TODO: refactor to follow UISlider style ~ Imti
define(function(require, exports, module) {
    var UIComponent = require('../core/UIComponent');
    var UIElement = require('../core/UIElement');

    var VerticalBar = UIElement.extend( /** @lends UIElement.prototype */ {
        constructor: function(options) {
            UIElement.prototype.constructor.call(this, {
                style: {
                    background: 'red'
                }
            });
        }
    });

    var UIPlus = UIComponent.extend( /** @lends UIComponent.prototype */ {
        constructor: function(options) {
            this._callSuper(UIComponent, 'constructor', options);

            this._addChild(new VerticalBar());
        }
    });

    module.exports = UIPlus;
});
