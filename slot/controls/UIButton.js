/**
 * @deprecated use future simple button instead
 */
define(function(require, exports, module) {

    var UIComponent = require('../core/UIComponent');
    var UIElement = require('../core/UIElement');
    // var UIBoundingBox = require('../core/UIBoundingBox');
    var UILabel = require('./UILabel');

    var UIButton = UIComponent.extend( /** @lends UIComponent.prototype */ {
        /**
         * A basic button
         *
         * @name UIButton
         * @constructor
         *
         * @param {Object} [options] options to be set on UIButton
         * @param {Array} [options.size] button size
         * @param {Boolean} [options.raised] boxShadow added if true
         * @param {String} [options.background] button color
         * @param {String} [options.textColor] button text color
         * @param {label} [options.label] button text
         * @param {Booleane} [options.uppercase] uppercase style on text added
         */
        constructor: function(options) {
            options = options || {};
            options.size = options.size || [135, 35];
            this._callSuper(UIComponent,'constructor', options);
//            this._callSuper(UIComponent, 'constructor', options);

            // Values exposed to user via options object
            this.background   = this.options.background    || '#5677fc';
            this.color        = this.options.color         || '#fff';
            this.raised       = this.options.raised        || true;
            this.fontSize     = this.options.fontSize      || '12px';
            this.fontFamily   = this.options.fontFamily    || 'Helvetica';
            this.content      = this.options.content       || 'Click me';
            this.uppercase    = this.options.uppercase     || false;
            this.labelAlign   = this.options.labelAlign    || [0.5, 0.5];
            this.labelOrigin  = this.options.labelOrigin   || [0.5, 0.5];
            this.boxShadow    = this.options.boxShadow     || '0 2px 10px 0 rgba(0, 0, 0, 0.16)';
            this.cursor       = this.options.cursor        || 'pointer';
            this.textShadow   = this.options.textShadow    || '0 0 1px #000';
            this.borderRadius = this.options.borderRadius  || '2px';

            this._createBackgroundElement();
            this._createLabel();
            this._bindEvents();
        },


        _createBackgroundElement: function _createButton() {
            this._backgroundElement = new UIElement({
                style: {
                    background: this.background,
                    boxShadow: this.raised ? this._boxShadow : 'none',
                    borderRadius: this.options
                },
                classes: ['backfaceVisibility']
            });
            this._addChild(this._backgroundElement);

        },

        _createLabel: function _createLabel() {
            // TODO Make real label
            this._label = new UIElement({
                content: this.content,
                style: {
                    textAlign: 'center',
                    lineHeight: this.getSize()[1] + 'px',
                    fontSize: this.fontSize,
                    color: this.color,
                    textTransform: this.uppercase ? 'uppercase' : 'none',
                    cursor: this.cursor,
                    textShadow: this.textShadow
                },
               classes: ['backfaceVisibility']
            });
            this._label.setPosition(0, 0, 1);
            this._addChild(this._label);
        },

        _bindEvents: function  _bindEvents() {
            this._label.on('click', function(event) {
                this.emit('click', event);
            }.bind(this));
        }
    });

    module.exports = UIButton;
});
