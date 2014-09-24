define(function(require, exports, module) {
    var UIComponent   = require('../core/UIComponent');
    var UIElement     = require('../core/UIElement');
    var UIBoundingBox = require('./UIBoundingBox');
    var Easing        = require('famous/transitions/Easing');

    var UISlider = UIComponent.extend( /** @lends UIComponent.prototype */ {
        /**
         * A basic slider
         *
         * @name UISlider
         * @constructor
         *
         * @param {Object} [options] options to be set on UISlider
         * @param {Number} [options.min] min value
         * @param {Number} [options.max] max value
         * @param {Number} [options.step] step interval
         * @param {String} [options.direction] direction
         * @param {Boolean} [options.disabled] disabled setting
         * @param {String} [options.thumbColor] color of thumb
         * @param {String} [options.barColor] color of bar
         */
        constructor: function(options) {
            this._callSuper(UIComponent, 'constructor', options);

            // Values exposed to user via options object
            this._min          = options.min || 0;
            this._max          = options.max || 100;
            this._step         = options.step || 1;
            this._direction    = options.direction || 'x';
            this._disabled     = options.disabled || 'false';
            this._thumbColor   = options.thumbColor || '#0f9d58';
            this._barColor     = options.barColor || '#9c9c9c';

            // Default values for thumb
            this._thumbHeight = 15;
            this._thumbWidth  = 15;

            // Default values for bar
            this._barHeight   = 3;

            // Default values
            this._value       = (options.value!=null) ? options.value : this._min;

            // Create UIComponents and UIElements
            this._createBar();
            this._boundingBox = new UIBoundingBox();
            this._addChild(this._boundingBox);
            this._createThumb();

            this._layout();
            this._bindEvents();
            this._updateThumb();
        },

        /**
         * Gets the current value of the slider
         *
         * @method getValue
         * @returns {Number} current value
         */
        getValue: function() {
            return this._value;
        },

        /**
         * Overrides UIComponent's setSize method to allow for resizing
         * and automatic layout updating afterwards
         *
         * @method setSize
         *
         * @param {Number} width width to set
         * @param {Number} height height to set
         */
        setSize: function(width, height) {
            this._callSuper(UIComponent, 'setSize', width, height);
            this._layout();
        },

        /**
         * Creates a UIElement for thumb
         *
         * @protected
         * @method _createThumb
         */
        _createThumb: function() {
            this._thumb = new UIElement();
            this._thumb.setStyle({
                backgroundColor: this._thumbColor,
                borderRadius: '50%'
            });
            this._addChild(this._thumb);
        },

        /**
         * Creates a UIElement for bar
         *
         * @protected
         * @method _createBar
         */
        _createBar: function() {
            this._bar = new UIElement();
            this._bar.setStyle({
                backgroundColor: this._barColor
            });
            this._addChild(this._bar);
        },

        /**
         * Sets the layout for the slider component
         *
         * @protected
         * @method _layout
         */
        _layout: function() {
            if (this._bar == null) return;
            var sliderSize = this.getSize();

            this._bar.setSize(sliderSize[0], this._barHeight);
            this._bar.setPosition(0, (sliderSize[1] - this._barHeight) / 2, 0);

            this._boundingBox.setSize(sliderSize[0], sliderSize[1]);

            this._thumb.setSize(this._thumbWidth, this._thumbHeight);
            this._thumbY = (sliderSize[1] - this._thumbHeight) / 2;
            this._thumb.setPosition(0, this._thumbY);
        },

        /**
         * Sets events for the slider component
         *
         * @protected
         * @method _bindEvents
         */
        _bindEvents: function _bindEvents() {
            this._thumb.on('dragUpdate', function(event) {
                this._onDrag(event);
            }.bind(this));

            this._thumb.on('dragStart', function() {
                this._initialThumbX = this._thumb.getPosition()[0];
            }.bind(this));

            this._thumb.on('dragEnd', function() {
                this._lastValue = this._lastValue + this.currentValue;
            }.bind(this));

            this._boundingBox.on('click', function(event) {
                this._value = this._mouseXToValue(event.offsetX);
                this._updateThumb(500);
                this.emit('change', {value: this._value});
            }.bind(this));
        },

        /**
         * Updates and emits value on drag
         *
         * @protected
         * @method _onDrag
         *
         * @param {Object} event event that has a position property
         */
        _onDrag: function(event) {
            var mouseX   = event.position[0] + this._initialThumbX;
            var barX     = this._bar.getPosition()[0];
            var barWidth = this._bar.getSize()[0];
            this._value  = this._mouseXToValue(event.position[0] + this._initialThumbX);
            this.emit('change', {value: this._value});
            this._updateThumb();
        },

        /**
         * Converts the mouseX position to a value
         *
         * @protected
         * @method _mouseXToValue
         *
         * @param {Number} mouseX mouseX position to convert to value
         * @return {Number} converted mouseX value
         */
        _mouseXToValue: function(mouseX) {
            var barX     = this._bar.getPosition()[0];
            var barWidth = this._bar.getSize()[0];
            return Math.round(Math.max(this._min, Math.min(this._max, (mouseX - barX) / barWidth * (this._max - this._min) + this._min)));
        },

        /**
         * Updates thumb position on slider
         *
         * @protected
         * @method _updateThumb
         *
         * @param {Number} [duration] duration to set a position
         */
        _updateThumb: function(duration) {
            var barX     = this._bar.getPosition()[0];
            var barWidth = this._bar.getSize()[0];

            if (duration === undefined) 
                this._thumb.setPosition(barX + barWidth * this._value / this._max, this._thumbY);
            else 
                this._thumb.setPosition(barX + barWidth * this._value / this._max, this._thumbY, 0, {duration: duration, curve: Easing.outExpo});
        }
    });

    module.exports = UISlider;
});
