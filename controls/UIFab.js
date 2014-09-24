define(function(require, exports, module) {
    var UIComponent = require('../core/UIComponent');
    var UIElement   = require('../core/UIElement');

    var UIFab = UIComponent.extend( /** @lends UIComponent.prototype */ {
        /**
         * A fab icon
         *
         * @name UIFab
         * @constructor
         *
         * @param {Object} [options] options to be set on UIBoundingBox
         * @param {Number} [options.radius] radius of fab
         * @param {Number} [options.shadowDepth] depth of box shadow
         * @param {String} [options.radius] fab radius
         */
        constructor: function(options) {
          
            // exposed values
            options           = options             || {};
            this._radius      = options.radius      || 25;
            this._shadowDepth = options.shadowDepth || 1;
            this._icon        = options.icon;
            this._iconColor   = options.iconColor   || 'rgba(255, 255, 255, 0.95)';
            this._background  = options.background  || '#0066cc';
            options.size      = [this._radius*2, this._radius*2];

            this._callSuper(UIComponent, 'constructor', options);
            this._createBackground({
                style: {
                    boxShadow: this._shadowDepthToBoxShadow(this._shadowDepth),
                    background: this._background,
                    borderRadius: this._radius + 'px'
                }
            });
            this._createIcon({ type: this._icon });

            this._initEventing();
        },

        /**
         * Creates background
         *
         * @protected
         * @method _createBackground
         */
        _createBackground: function(options) {
            this._backgroundElement = new UIElement(options);
            this._addChild(this._backgroundElement);
        },

        /**
         * Creates icon
         *
         * @protected
         * @method _createIcon
         */
        _createIcon: function() {
            this._iconElement = new UIElement({
                style: {
                    textAlign: 'center',
                    color: this._iconColor,
                    fontSize: this._radius + 'px',
                    lineHeight: this._radius*2 + 'px',
                    cursor: 'pointer'
                },
                classes: ['icon', 'ion-arrow-right-a']
            });
            this._addChild(this._iconElement);
        },

        /**
         * Converts shadow depth to CSS box shadow format
         *
         * @protected
         * @method _shadowDepthToBoxShadow
         *
         * @param {Number} shadowDepth depth of box shadow
         * @return {String} CSS box shadow
         */
        _shadowDepthToBoxShadow: function(shadowDepth) {
            return '0 ' + shadowDepth*6 + 'px ' + shadowDepth*12 + 'px 0 rgba(0, 0, 0, 0.25)';
        },

        /**
         * Initializes events
         *
         * @protected
         * @method _initEventing
         */
        _initEventing: function() {
            this._backgroundElement.on('click', function(event) {
                console.log('yolo');
            }.bind(this));
        },

        /**
         * Converts range
         *
         * @protected
         * @method _convertRange
         *
         * @param {Number} oldValue
         * @param {Number} oldRange
         * @param {Number} newRange
         * @return {Number} converted range
         */
        _convertRange: function(oldValue, oldRange, newRange) {
            var oldMin = Math.min.apply(null, oldRange);
            var newMin = Math.min.apply(null, newRange);

            var oldMax = Math.max.apply(null, oldRange);
            var newMax = Math.max.apply(null, newRange);

            return (((oldValue - oldMin) * (newMax - newMin)) / (oldMax - oldMin)) + newMin;
        }
    });

    module.exports = UIFab;
});
