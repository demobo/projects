define(function(require, exports, module) {
    var UIBoundingBox = require('./UIBoundingBox');
    var UIComponent   = require('../core/UIComponent');
    var UIElement     = require('../core/UIElement');
    var UILabel       = require('./UILabel');
    var UIIcon        = require('./UIFab');
   
    /**
     * A base button class
     *
     * @param {Object} [options] options to be applied to the button
     * @param {Array | Numbers} [options.size] Size of bounding box
     * @param {String} [options.text] Text to be set on label
     * @param {Boolean} [options.toggle] Toggle status
     * @param {Boolean} [options.enabled] Enabled status
     * @param {Selected} [options.selected] Selected status
     * @param {Number} [options.iconPadding] Padding between icon and label
     * @param {String} [options.iconPlacement] Placement of icon in bounding box
     *
     * @example
     *  var button = new UIButtonBase({
     *      size: [200, 50],
     *      text: 'I am a cute button!',
     *      iconPlacement: 'top' 
     *  });
     *
     * @class UIButtonBase
     * @constructor
     */
    var UIButtonBase = UIComponent.extend({
        constructor: function(options) {
            this._callSuper(UIComponent, 'constructor', options);
            
            options             = options               || {};
            this._size          = options.size          || undefined;
            this._text          = options.text          || 'Button'; 
            this._toggle        = options.toggle        || false;
            this._enabled       = options.enabled       || true;
            this._selected      = options.selected      || false;
            this._iconPadding   = options.iconPadding   || 10
            this._iconPlacement = options.iconPlacement || 'left';

            this._createIcon();
            this._createLabel();
            this._createBoundingBox();
            this._bindEvents();
        },
        
        /**
         * Binds events to button
         *
         * @private
         * @method _bindEvents
         *
         * @TODO: Emit an event on click
         */
        _bindEvents: function() {
            this._label.on('sizeChange', this._layout.bind(this));
        },
        
        /**
         * Sets the size of the bounding box
         *
         * @private
         * @method _setBoundingBoxSize
         */
        _setBoundingBoxSize: function() {
            this._label.on('sizeChange', function() {
                var iconWidth = this.icon.getSize()[0];
                var iconHeight = this.icon.getSize()[1];
                var labelWidth = this.icon.getSize()[0];
                var labelHeight = this.icon.getSize()[1];

                var width = iconWidth + this._iconPadding + labelWidth;
                var height = iconHeight + this._iconPadding + labelHeight;

                this._size = [width, height]
                this._boundingBox.setSize(this._size);
            }.bind(this));
        },
        
        /**
         * Creates the bounding box
         *
         * @private
         * @method _createBoundingBox
         */
        _createBoundingBox: function() {
            this._boundingBox = new UIBoundingBox();
            if(this._size !== undefined) this._boundingBox.setSize(this._size);
            else this._setBoundingBoxSize();
            this._addChild(this._boundingBox);
        },
          
        /**
         * Creates the icon
         *
         * @private
         * @method _createIcon
         */
        _createIcon: function() {
            this._icon = new UIIcon();
            this._icon.setOpacity(0);
            this._addChild(this._icon);
        }, 

        /**
         * Creates the label
         *
         * @private
         * @method _createLabel
         */
        _createLabel: function() {
            this._label = new UILabel({
                text: this._text
            });
            this._label.setOpacity(0);
            this._addChild(this._label);
        },

        /** 
         * Lays out the icon, label, and bounding box
         *   depending on the iconPlacement
         *
         * @private
         * @method _layout
         *
         * @TODO: use .center() on label once fixed in UIBase
         */
        _layout: function() {
            var boxWidth    = this._boundingBox.getSize()[0];
            var boxHeight   = this._boundingBox.getSize()[1];
            var iconWidth   = this._icon.getSize()[0];
            var iconHeight  = this._icon.getSize()[1];
            var labelWidth  = this._label.getSize()[0];
            var labelHeight = this._label.getSize()[1];
            var iconPadding = this._iconPadding;
             
            if(this._iconPlacement === 'left') {
                this._icon.center().setPosition(-iconPadding/2 - iconWidth/2, 0, 0);
                this._label.setPosition(boxWidth/2 + iconPadding/2, boxHeight/2 - labelHeight/2, 0);
            }
            if(this._iconPlacement === 'right') {
                this._icon.center().setPosition(iconWidth/2 + iconPadding/2, 0, 0);
                this._label.setPosition(boxWidth/2 - iconPadding/2 - labelWidth, boxHeight/2 - labelHeight/2, 0);
            }
            if(this._iconPlacement === 'top') {
                this._icon.center().setPosition(0, -iconPadding/2 - iconWidth/2, 0);
                this._label.setPosition(boxWidth/2 - labelWidth/2, boxHeight/2 + iconPadding/2, 0);
            }
            if(this._iconPlacement === 'bottom') {
                this._icon.center().setPosition(0, iconHeight/2 + iconPadding/2, 0);
                this._label.setPosition(boxWidth/2 - labelWidth/2, boxHeight/2 - iconPadding/2 - labelHeight, 0);
            }
            
            // setting the opacity to 0 initially and setting the back 
            // to 1 once laid out prevents the position flicker effect
            this._icon.setOpacity(1);
            this._label.setOpacity(1);
        }
    });
    module.exports = UIButtonBase;
});
