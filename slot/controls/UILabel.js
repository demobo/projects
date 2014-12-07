define(function(require, exports, module) {
    var UIElement = require('../core/UIElement');
    var UIComponent = require('../core/UIComponent');
    var Engine = require('famous/core/Engine');
    var Timer = require('famous/utilities/Timer');

    /**
     * A basic label element
     * @param {Object} [options] options to be applied to UIElement
     * @param {String} [options.text] Text to set the label with
     * @param {Array | Strings} [options.classes] Classes to set on the label
     * @param {Object} [options.style] Style to set on the label
     *
     * @example
     *  var app = new UIApplication({
     *      children: [ 
     *          new UILabel({ 
     *              text: 'Layouts',
     *              classes: ['ui-label'],
     *              style: {
     *                  'color' : 'red'
     *              }
     *          })
     *      ]
     *  });
     *
     * @class Label
     * @constructor
     */
    var UILabel = UIComponent.extend({
        constructor: function (options) {
            this._callSuper(UIComponent, 'constructor', options);
            this._size = [];
            this._measuredSize = this.options.size ? false : true;

            this._element = new UIElement({
                content: this.options.text,
                classes: this.options.classes,
                style: this.options.style
            });
            this._element._surface.setSize([true, true]);

            if (this.options.size) {
                this._element._surface.setSize(this.options.size);
            }

            this._addChild(this._element);
            _bindEvents.call(this);
        },

        /**
         * Read size from the current element
         * @method _readSize
         * @protected
         */
        _readSize: function () {
            this._size[0] = this._element._surface._currentTarget.clientWidth;
            this._size[1] = this._element._surface._currentTarget.clientHeight
            this.emit('sizeChange', this._size);
        },

        /**
         * Invalidate surface's content flag, allowing a deploy event.
         * @method _readSize
         * @protected
         */
        _invalidateSurface: function () {
            this._element._surface._contentDirty = true; // force redeploy for read.
        },

        /**
         * Return the current known size of the Label. Will not be accurate on the
         * first frame, recommended usage is to listen for sizeChange events
         * instead of direct querying.
         * @method getSize
         */
        getSize: function () {
            return this._size.slice(0);
        },

        /**
         * Set the desired size of the label.
         * @param {Array | 2D} Size in pixels
         * @method setSize
         */
        setSize: function (size) {
            if (!this._element) return;
            this._invalidateSurface();
            this._element._surface.setSize([undefined, undefined]);
            this._element.setSize(size);
            this._measuredSize = false;
            return this;
        },

        /**
         *  If an absolute size is set, return to reading the measured size
         *  from the label.
         *  @method setAutoSize
         */
        setAutoSize: function () {
            if (this._measuredSize) return;
            this._invalidateSurface();
            this._element._surface.setSize([true, true]);
            this._measuredSize = true;
        },

        /**
         * Set the current classes on the Label
         * @method setClasses
         * @param classList {Array | String} Array of classes to set
         */
        setClasses: function (classList) {
            this._invalidateSurface();
            return this._element.setClasses.apply(this._element, arguments);
        },

        /**
         * Set the current CSS style on the Label
         * @method setStyle
         * @param style {Object} Object of style properties and values
         */
        setStyle: function () {
            this._invalidateSurface();
            return this._element.setStyle.apply(this._element, arguments);
        },

        /**
         *  @method getStyle
         *  @return {Object} Object of current CSS Styles
         */
        getStyle: function () {
            return this._element.getStyle();
        },

        /**
         * Set the current text on the label
         * @method setText
         * @param text {String} HTML String
         */
        setText: function (text) {
            this._element.setContent(text);
        },

        /**
         * Get the current text of the label
         * @method getText
         * @return {string} current text.
         */
        getText: function () {
            return this._element.getContent();
        }
    });

    function _bindEvents () {
        var self = this;
        this._element.on('deploy', function (e) {
            self._readSize();
        });
    }

    module.exports = UILabel;
});
