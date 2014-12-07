define(function(require, exports, module) {
    var UIComponent = require('../core/UIComponent');
    var UIElement = require('../core/UIElement');
    var Transform = require('famous/core/Transform');
    var Easing = require('famous/transitions/Easing');
    var UIBoundingBox = require('./UIBoundingBox');

    var UIRadioButton = UIComponent.extend( /** @lends UIComponent.prototype */ {
        /**
         * A radio button
         *
         * @name UIRadioButton
         * @constructor
         *
         * @param {Object} [options] options to be set on UIRadioButton
         * @param {String} [options.size] radio button size
         * @param {String} [options.color] button's on color
         * @param {String} [options.ringColor] ring color
         * @param {String} [options.fillColor] fill color
         */
        constructor: function(options) {
            this._callSuper(UIComponent, 'constructor', options);

            // User options are entered else defaults are assigned
            options             = options           || {};
            this.size           = options.size      || [48, 48];
            this.color          = options.color     || 'green';
            this.ringColor      = options.ringColor || 'gray';
            this.fillColor      = options.fillColor || this.color;

            // Layout style assigned
            this._ringSize      = this._fillSize = [this.size[0]/3, this.size[0]/3];

            // Define property to check the state of the button
            this.isSelected     = false;
            this._beingAnimated = false;

            // We create everything necessary for our RadioButton
            this._createBackground();
            this._createRing();
            this._createFill();
            this._createBoundingBox();
            this._bindEvents();
        },

        /**
         * Binds events
         *
         * @protected
         * @method _bindEvents
         */
        _bindEvents: function() {
            this._boundingBox.on('mousedown', this.toggle.bind(this));
        },

        /**
         * Creates radio button background
         *
         * @protected
         * @method _createBackground
         */
        _createBackground: function(){
            this._buttonBackground = new UIElement({
                size: this.size,
                origin: [0.5, 0.5],
                align: [0.5, 0.5],
                opacity: 0,
                style: {
                    borderRadius: '50%',
                    background: this.color,
                }
            });
            this._addChild(this._buttonBackground);

        },

        /**
         * Creates ring around radio button
         *
         * @protected
         * @method _createRing
         */
        _createRing: function (){
            this._ring = new UIElement({
                size: this._ringSize,
                origin: [0.5, 0.5],
                align: [0.5, 0.5],
                style: {
                    border: '2px solid black',
                    borderColor: this.ringColor,
                    borderRadius: '50%'
                }
            });
            this._addChild(this._ring);
        },

        /**
         * Creates fill inside of ring
         *
         * @protected
         * @method _createFill
         */
        _createFill: function (){
            this._fill = new UIElement({
                origin: [0.5, 0.5],
                align: [0.5, 0.5],
                size: this._fillSize,
                style:{
                    backgroundColor: this.color,
                    borderRadius: '50%'
                },
                transform: Transform.scale(0,0,1)
            });
            this._addChild(this._fill);
        },

        /**
         * Creates the bounding box that handles all the click events
         *
         * @protected
         * @method _createBoundingBox
         */
        _createBoundingBox: function(){
            this._boundingBox = new UIBoundingBox();
            this._addChild(this._boundingBox);
        },

        /**
         * Toggles the state of the button
         *
         * @method toggle
         */
        toggle: function(){
            if(!this._isBeingAnimated) {
                this._isBeingAnimated = true;
                this._fill.setScale(~~this.isSelected, ~~this.isSelected, 1, {
                    duration : 200, curve: 'outCubic'
                }, function() { this._isBeingAnimated = false; }.bind(this));

                this._buttonBackground.setOpacity(0.2, {
                    duration : 80, curve: 'outBack'
                }, function() {
                    this._buttonBackground.setOpacity(0, { duration : 200, curve: 'outBack' });
                }.bind(this));
                this.isSelected = !this.isSelected;
            }
        }

    });

    module.exports = UIRadioButton;
});
