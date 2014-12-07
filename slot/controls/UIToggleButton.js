define(function(require, exports, module) {
    var UIComponent = require('../core/UIComponent');
    var UIElement = require('../core/UIElement');
    var UIBoundingBox = require('./UIBoundingBox');

    var UIToggleButton = UIComponent.extend( /** @lends UIComponent.prototype */ {
        /**
         * A basic toggle button
         *
         * @name ToggleButton
         * @constructor
         *
         * @params {Object} [options] options to be applied to UIToggleButton
         * @params {String} [options.inactiveColor] color of thumb when inactive
         * @params {String} [options.activeColor] color of thumb when active
         * @params {String} [options.duration] duration of animation
         * @params {String} [options.curve] easing curve of anmiation
         */
        constructor: function(options) {
            this._callSuper(UIComponent, 'constructor', options);

            // Values exposed to user via options object
            this.inactiveColor   = this.options.inactiveColor || '#9c9c9c';
            this.activeColor     = this.options.activeColor   || '#0f9d58';
            this.duration        = this.options.duration      || 500;
            this.curve           = this.options.curve         || 'outExpo';

            // Default thumb values
            this._thumbHeight    = 20;
            this._thumbWidth     = 20;
            this._innerThumbFill = '#ffffff';
            this._borderRadius   = '50%';
            this._borderStyle    = 'solid';
            this._borderWidth    = '2px';

            // Default bar values
            this._barHeight      = 2;

            // Default values
            this._toggle         = false;

            this._createInactiveBar();
            this._createActiveBar();
            this._createBoundingBox();
            this._createInactiveThumb();
            this._createActiveThumb();

            this._layout();
            this._bindEvents();
        },

        /*
        * Creates a UIElement for inactive bar
        *
        * @protected
        * @method _createInactiveBar
        */
        _createInactiveBar: function _createInactiveBar() {
            this.inactiveBar = new UIElement();
            this.inactiveBar.setStyle({
                backgroundColor: this.inactiveColor
            });
            this._addChild(this.inactiveBar);
        },

        /*
        * Creates a UIElement for inactive bar
        *
        * @protected
        * @method _createActiveBar
        */
        _createActiveBar: function _createActiveBar() {
            this.activeBar = new UIElement();
            this.activeBar.setStyle({
                backgroundColor: this.activeColor
            });
            this._addChild(this.activeBar);
        },

        /*
        * Creates a UIBoundingBox
        *
        * @protected
        * @method _createBoundingBox
        */
        _createBoundingBox: function _createBoundingBox() {
            this._boundingBox = new UIBoundingBox();
            this._addChild(this._boundingBox);
        },

        /*
        * Creates a UIElement for inactive thumb
        *
        * @protected
        * @method _createInactiveThumb
        */
        _createInactiveThumb: function _createInactiveThumb() {
            this.inactiveThumb = new UIElement();
            this.inactiveThumb.setStyle({
                backgroundColor: this._innerThumbColor,
                borderRadius: this._borderRadius,
                borderStyle: this._borderStyle,
                borderWidth: this._borderWidth,
                borderColor: this.inactiveColor
            });
            this._addChild(this.inactiveThumb);
        },

        /**
        * Creates a UIElement for active thumb
        *
        * @protected
        * @method _createActiveThumb
        */
        _createActiveThumb: function _createActiveThumb() {
            this.activeThumb = new UIElement();
            this.activeThumb.setStyle({
                backgroundColor: this.activeColor,
                borderRadius: this._borderRadius
            });
            this._addChild(this.activeThumb);
        },

        /**
         * Sets the layout for the toggle button component
         *
         * @protected
         * @method _layout
         */
        _layout: function() {
            var toggleButtonSize = this.getSize();

            this.inactiveBar.setSize(toggleButtonSize[0], this._barHeight);
            this.inactiveBar.setPosition(0, (toggleButtonSize[1] - this._barHeight) / 2, 0);
            this.activeBar.setSize(0, this._barHeight);
            this.activeBar.setPosition(0, (toggleButtonSize[1] - this._barHeight) / 2, 0);

            this._boundingBox.setSize(toggleButtonSize[0], toggleButtonSize[1]);

            this.inactiveThumb.setSize(this._thumbWidth, this._thumbHeight);
            this.inactiveThumb.setPosition(0 - this._thumbWidth, (toggleButtonSize[1] - this._thumbHeight) / 2, 0);
            this.activeThumb.setSize(0, 0);
            this.activeThumb.setPosition(0 - this._thumbWidth / 2 , (toggleButtonSize[1] - this._thumbHeight) / 2, 0);
            this.activeThumb.setOrigin([0.5, 0.5]);
            this.activeThumb.setAlign([0, 0.5]);
        },

        /**
         * Sets events for the toggle button component
         *
         * @protected
         * @method _bindEvents
         */
        _bindEvents: function() {
            this._boundingBox.on('click', function() {
                _toggle();
            });

            this.inactiveThumb.on('click', function(event) {
                _toggle();
            });

            this.activeThumb.on('click', function(event) {
                _toggle();
            });

            var _toggle = function() {
                var toggleButtonSize = this.getSize();

                if (!this._toggle) {
                    this.inactiveThumb.setPosition(toggleButtonSize[0], (toggleButtonSize[1] - this._thumbHeight) / 2, 0, {duration: this.duration, curve: this.curve});
                    this.activeThumb.setPosition(toggleButtonSize[0] + this._thumbHeight / 2, (toggleButtonSize[1] - this._thumbHeight) / 2, 0, {duration: this.duration, curve: this.curve});
                    this.activeThumb.setSize(this._thumbHeight, this._thumbWidth, {duration: 250});
                    this.activeBar.setSize(toggleButtonSize[0], this._barHeight, {duration: 250});
                } else {
                    this.inactiveThumb.setPosition(0 - this._thumbWidth, (toggleButtonSize[1] - this._thumbHeight) / 2, 0, {duration: this.duration, curve: this.curve});
                    this.activeThumb.setPosition(0 - this._thumbWidth / 2, (toggleButtonSize[1] - this._thumbHeight) / 2, 0, {duration: this.duration, curve: this.curve});
                    this.activeThumb.setSize(0, 0, {duration: 250});
                    this.activeBar.setSize(0, this._barHeight, {duration: 250});
                }

                this._toggle = !this._toggle;
                this.emit('toggle', this._toggle);
            }.bind(this);
        }
    });

    module.exports = UIToggleButton;
});
