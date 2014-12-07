define(function(require, exports, module) {
    var UIComponent = require('../core/UIComponent');
    var UIElement   = require('../core/UIElement');
    var Easing      = require('famous/transitions/Easing');
    var Utility     = require('famous/utilities/Utility');

    // FIXME zIndex
    var UIDialog = UIComponent.extend( /** @lends UIComponent.prototype */ {
        /**
         * A dialog pop-up box
         *
         * @name UIDialog
         * @constructor
         *
         * @param {Object} [options] options to be set on UIDialog
         * @param {Number} [options.shadowDepth] depth of box shadow
         * @param {Boolean} [options.opened] initial state of dialog
         * @param {String} [options.backdropColor] color of backdrop
         * @param {String} [options.popupColor] color of popup
         * @param {Number} [options.popupSize] size of popup
         * @param {Object} [options.transition] object containing duration
         *   and curve
         */
        constructor: function(options) {
            this._callSuper(UIComponent, 'constructor', options);
            
            // exposed values
            this.shadowDepth    = options.shadowDepth   || 3;
            this.opened         = (options.opened === undefined)? true : options.opened;
            this.backdropColor  = options.backdropColor || 'rgba(0, 0, 0, 0.4)';
            this.popupColor     = options.popupColor    || '#fff';
            this.popupSize      = options.popupSize     || [300, 200];
            this.transition     = options.transition    || {duration: 300, curve: 'inQuint'};

            this._createBackdrop();
            this._createPopup();
            this._bindEvents();
            this.hide({ duration: 0 });
            if (this.opened) this.show();
        },

	      /**
	       * Binds events
	       *
	       * @protected
	       * @method _bindEvents
	       */
        _bindEvents: function() {
            this._backdropElement.on('click', function() {
                this.hide();
            }.bind(this));
        },

        /**
         * Creates the backdrop
         *
         * @protected
         * @method _createBackdrop
         *
         */
        _createBackdrop: function() {
            this._backdropElement = new UIElement({
                style: {
                    background: this.backdropColor
                }
            });
            this._addChild(this._backdropElement);
        },

        /**
         * Creates the popup
         *
         * @protected
         * @method _createPopup
         *
         */
        _createPopup: function() {
            this.popup = new UIComponent().center();
            this.popup.setSize(this.popupSize);
            this.popup._addChild(new UIElement({
                style: {
                    boxShadow: this._shadowDepthToBoxShadow(this.shadowDepth),
                    background: this.popupColor
                }
            }));
            this._addChild(this.popup);
        },

        /**
         * Converts the shadow depth to a CSS backdrop
         *
         * @protected
         * @method _shadowDepthToBoxShadow
         *
         */
        _shadowDepthToBoxShadow: function(shadowDepth) {
            return '0 ' + shadowDepth*6 + 'px ' + shadowDepth*12 + 'px 0 rgba(0, 0, 0, 0.25)';
        },

        /**
         * Shows the dialog
         *
         * @method show
         *
         * @param {Object} [transition] object containing duration and curve
         * @param {Function} [callback] function to run after transition is
         *   complete
         * @return {UIDialog} this
         *
         */
        show: function(transition, callback) {
            transition = transition || this.transition;
            var eventCallback = function() {
                this.emit('opened');
                if (callback) callback.apply(this, arguments);
            }.bind(this);

            var _callback = eventCallback ? Utility.after(3, eventCallback) : null;
            this._backdropElement.setSize(undefined, undefined);
            this._backdropElement.setOpacity(1, transition, _callback);
            this.popup.setSize(this.popupSize[0], this.popupSize[1]);
            this.popup.setOpacity(1, transition, _callback);
            this.popup.setAlign([0.5, 0.5], transition, _callback);
            return this;
        },

        /**
         * Hides the dialog
         *
         * @method hide
         *
         * @param {Object} [transition] object containing duration and curve
         * @param {Function} [callback] function to run after transition is
         *   complete
         * @return {UIDialog} this
         */
        hide: function(transition, callback) {
            transition = transition || this.transition;
            var eventCallback = function() {
                this.emit('hidden');
                if (callback) callback.apply(this, arguments);
            }.bind(this);

            var _callback = eventCallback ? Utility.after(3, eventCallback) : null;
            this._backdropElement.setOpacity(0, transition, function() {
                this.setSize(0, 0);
                _callback();
            }.bind(this._backdropElement));
            this.popup.setOpacity(0, transition, function() {
                this.setSize(0, 0);
                _callback();
            }.bind(this.popup));
            this.popup.setAlign([0.5, 1], transition, _callback);
            return this;
        },
    });
    module.exports = UIDialog;
});
