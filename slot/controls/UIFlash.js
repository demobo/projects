define(function(require, exports, module) {
    var UIComponent = require('../core/UIComponent');
    var UIElement = require('../core/UIElement');

    var UIFlash = UIComponent.extend( /** @lends UIComponent.prototype */ {
        /*
        * A Flash component that creates an ink effect when a 'flash' event is emitted
        *
        * @name Flash Component
        * @constructor
        *
        * @param {Object} options to applied to UIFlash
        * @param {Array} [options.size] flash size
        * @param {String} [options.color] flash color
        * @param {Number} [options.opacity] flash opacity
        */
        constructor: function(options) {
            this._callSuper(UIComponent, 'constructor', options);

            // options style
            this.size       = this.options.size     || [100, 100];
            this.color      = this.options.color    || 'purple';
            this.opacity    = this.options.opacity  || 0.4;

            // Create UIElements and bind events
            this._createFlash();
            this._bindEvents();
        },

        /**
         * Creates a flash UIElement
         *
         * @protected
         * @method _createFlash
         */
        _createFlash: function () {
            this.flash = new UIElement({
                size: this.size,
                origin: [0.5, 0.5],
                opacity: 0,
                style: {
                    backgroundColor: this.color,
                    borderRadius: this.size[0] + 'px'
                }
            });
            this._addChild(this.flash);
        },

        /**
         * Bind Events
         *
         * @protected
         * @method _bindEvents
         */
        _bindEvents: function () {
            this.on('flash', function(e) {
               this._flash({x: e.x, y: e.y});
            }.bind(this));
        },

        /**
         * Creates flash animation
         *
         * @protected
         * @method _flash
         *
         * @param {Object} pos position object with x and y style
         */
        _flash: function(pos) {
            this.isFlashing = true;
            this.flash.setPosition(pos.x, pos.y, 0);
            this.flash.setOpacity(this.opacity, { duration: 100 }, function() {
                this.flash.setOpacity(0, { duration: 100 });
            }.bind(this));
        }
    });
    module.exports = UIFlash;
});
