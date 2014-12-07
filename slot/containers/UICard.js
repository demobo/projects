define(function(require, exports, module) {
    var UIContainer = require('./UIContainer');
    var UIElement = require('../core/UIElement');

    var UICard = UIContainer.extend({ /** @lends UIContainer.prototype */
        
        /**
         * A basic Card
         *
         * @name UICard
         * @constructor
         *
         * @param {Object} [options] options to be set on UICard
         * @param {String} [options.background] background
         * @param {String} [options.boxShadow] box shadow
         * @param {String} [options.borderRadius] border radius
         * @param {String} [options.content] card content
         * @param {String} [options.textAlign] text orientation
         * @param {String} [options.lineHeight] line height
         */
        constructor: function(options) {
            this._callSuper(UIContainer, 'constructor', options);

            // Values exposed to user via options object
            this.background    = this.options.background   || '#fff';
            this.boxShadow     = this.options.boxShadow    || '0 2px 10px 0 rgba(0, 0, 0, 0.16)';
            this.borderRadius  = this.options.borderRadius || '2px';
            this.content       = this.options.content      || '';
            this.textAlign     = this.options.textAlign    || 'center';
            this.lineHeight    = this.options.lineHeight   || this.getSize()[1] + 'px';

            // Default values
            this._height       = 300;
            this._width        = 300;

            this._createCard();
            this._layout();
        },

        /**
         * Creates a card UIElement
         *
         * @private
         * @method _createCard
         */
        _createCard: function(options) {
            this.cardBackground = new UIElement();
            this.cardBackground.setStyle({
                background: this.background,
                boxShadow: this.boxShadow,
                borderRadius: this.borderRadius,
                textAlign: this.textAlign,
                lineHeight: this.lineHeight
            });
            this.cardBackground.setContent(this.content);
            // note, not an external-facing child
            this._addChild(this.cardBackground);
        },

        /**
         * Lays out the UICard
         *
         * @private
         * @method _layout
         */
        _layout: function(options) {
            var cardSize = this.getSize();
            if (!cardSize[0]) cardSize[0] = this._width;
            if (!cardSize[1]) cardSize[1] = this._height;
            this.setSize(cardSize[0], cardSize[1]);
        },

        /**
         * On event for UICard
         *
         * @method on
         * @params {String} type
         * @params {Function} handler callback function
         * @return {UICard} this
         */
        on: function(type, handler) {
            return this.cardBackground.on(type, handler);
        }
    });

    module.exports = UICard;
});
