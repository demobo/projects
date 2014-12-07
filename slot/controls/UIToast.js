define(function(require, exports, module) {
    var UIComponent = require('../core/UIComponent');
    var UIElement = require('../core/UIElement');

    var UIToast = UIComponent.extend( /** @lends UIComponent.prototype */ {
        /**
         * A basic Android toast
         *
         * @name UIToast
         * @constructor
         *
         * @param {Object} [options] options to be set on UIToast
         * @param {String} [options.text] Toast text
         * @param {String} [options.color] Toast color
         * @param {Number} [options.popDuration] duration of pop in/out
         * @param {Number} [options.delayDuration] duration of delay before
         *   fading out
         */
        constructor: function(options) {
            this._callSuper(UIComponent, 'constructor', options);

            // Values exposed to user via options object
            this.content         = this.options.content         || '';
            this.backgroundColor = this.options.backgroundColor || '#373737';
            this.color           = this.options.color           || '#ffeb3b';
            this.popDuration     = this.options.popDuration     || 1000;
            this.delayDuration   = this.options.delayDuration   || 3000;
            this.inCurve         = this.options.inCurve         || 'outExpo';
            this.outCurve        = this.options.outCurve        || 'inExpo';

            // Default toast values
            this._opacity        = 0.8;
            this._borderRadius   = '5px';
            this._paddingLeft    = '10px';
            this._textAlign      = 'left';
            this._lineHeight     = this.getSize()[1] + 'px';

            this._createToast();
            this._layout();
            this._bindEvents();
        },

        /**
         * Creates toast
         *
         * @protected
         * @method _createToast
         */
        _createToast: function _createToast() {
            this.toast = new UIElement();
            this.toast.setContent(this.content);
            this.toast.setStyle({
                color: this.color,
                backgroundColor: this.backgroundColor,
                opacity: this._opacity,
                borderRadius: this._borderRadius,
                paddingLeft: this._paddingLeft,
                textAlign: this._textAlign,
                lineHeight: this._lineHeight,
            });
            this._addChild(this.toast);
        },

        /**
         * Sets toast layout
         *
         * @protected
         * @method _layout
         */
        _layout: function _layout() {
            this.setAlign([0.01, 1]);
            this.setOrigin([0, 0]);
        },

        /**
         * Creates toast events
         *
         * @protected
         * @method _bindEvents
         */
        _bindEvents: function _bindEvents() {
            this.on('pop', function() {
              _popToast();
            });

            var _popToast = function() {
                var height = -(this.getSize()[1] + this.getSize()[1] * 0.2);
                    this.toast.setPosition(0, height, 0, {duration: this.popDuration, curve: this.inCurve}, function() {
                        this.toast.setDelay(this.delayDuration, function() {
                            this.toast.setPosition(0, 0, 0, {duration: this.popDuaration, curve: this.outCurve});
                    }.bind(this));
                }.bind(this));
            }.bind(this);
        }
    });

    module.exports = UIToast;
});
