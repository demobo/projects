define(function(require, exports, module) {
    var UIElement   = require('../core/UIElement');
    var UIComponent = require('../core/UIComponent');

    /**
     * An input field designed after Google's Paper Polymer Elements
     *
     * @name UIInputField
     * @constructor
     *
     * @param {Object} [options] options to be applied to UIInputField
     * @param {Array} [options.size] input field size
     * @param {String} [options.color] color 
     * @param {String} [options.fontSize] font size
     * @param {String} [options.placeholder] input field placeholder
     */
    var UIInputField = UIComponent.extend({
        constructor: function(options) {
            this._callSuper(UIComponent, 'constructor', options);

            // Values exposed to user via options object
            options           = options             || {};
            this.size         = options.size        || [300, 50];
            this.color        = options.color       || 'red';
            this.fontSize     = options.fontSize    || (18 * (this.size[1] / 30)) + 'px';
            this.placeholder  = options.placeholder || 'Type Something...';

            // default values
            this.isToggled    = false;
            this.numEnters    = 0;
            this.numDeletes   = 0;
            this.scrollHeight = 0;

            // Create UIElements, layout, and bind events
            this._createInputNode();
            this._createInputField();
            this._createUnderline();
            this._createHighlightUnderline();
            this._createFlashyBar();
            this._bindEvents();
        },

        /**
         * Binds events
         * 
         * @protected
         * @method _bindEvents
         */
        _bindEvents: function() {
            // toggleOn  when clicked
            this.inputNode.addEventListener('click', function(e) {
                this.mouseX = e.offsetX;
                this.inputNode.focus();
                if(!this.isToggled) this._toggleOn.call(this, this.mouseX);
            }.bind(this));

            // toggleOff when no longer focused
            this.inputNode.addEventListener('blur', function() {
                this._toggleOff.call(this);
            }.bind(this));

            // toggleOn when focused (takes care of tabbing through input field)
            this.inputNode.addEventListener('focus', function(e) {
                if(!this.isToggled) this._toggleOn.call(this, this.mouseX || this.size[0]/2);
            }.bind(this));
       },

        /**
         * Creates an HTML input node 
         * 
         * @protected
         * @method _createInputNode
         */
        _createInputNode: function() {
            this.inputNode = document.createElement("input");
            this.inputNode.classList.add('famous-surface');
            this.inputNode.placeholder = this.placeholder;
            this.inputNode.style['font-size'] = this.fontSize;
            this.inputNode.style.width = this.size[0] + 'px';
            this.inputNode.style.height = this.size[1] + 'px';
        },

        /**
         * Creates an input UIElement with the inputNode as content
         * 
         * @protected
         * @method _createInputField
         */
        _createInputField: function() {
            this.inputElement = new UIElement({
                size: this.size,
                content: this.inputNode,
            });
            this._addChild(this.inputElement);
        },

        /**
         * Creates an underline UIElement 
         * 
         * @protected
         * @method _createUnderline
         */
        _createUnderline: function() {
            this.underline = new UIElement({
                size: [this.size[0], 1],
                // align: [0.5, 0.65],
                // origin: [0.5, 0],
                style: {
                    backgroundColor: 'lightgrey',
                }
            });
            this.underline.setPosition(0, this.size[1], 0);
            this._addChild(this.underline);
        },

        /**
         * Creates a highlight underline UIElement 
         * 
         * @protected
         * @method _createHighlightUnderline
         */
        _createHighlightUnderline: function() {
            this.highlightUnderline = new UIElement({
                size: [0, 0],
                // align: [0.5, .65],
                // origin: [0.5, 0],
                opacity: 0,
                style: {
                    border: '.1em solid ' + this.color
                }
            });
            this.highlightUnderline.setPosition(0, this.size[1], 0);
            this._addChild(this.highlightUnderline);
        },

        /**
         * Creates a bar UI Element
         * 
         * @protected
         * @method _createFlashyBar
         */
        _createFlashyBar: function() {
            this.flashyBar = new UIElement({
                size: [0, this.size[1]],
                // align: [0.5, 0.5],
                // origin: [0.5, 0.5],
                style: {
                    backgroundColor: this.color,
                }
            });
            this.flashyBar.setPosition(this.size[0]/2, 0, 0);
            this._addChild(this.flashyBar);
        },

        /**
         * Toggles animation when inputNode is clicked or focused
         * 
         * @protected
         * @method _toggleOn
         *
         * @param {Number} clickOrigin position where input field was clicked
         */
        _toggleOn: function(clickOrigin) {
            this.isToggled  = !this.isToggled;
            var inputWidth  = this.size[1];
            var inputLength = this.size[0];

            // highlightUnderline animations
            this.highlightUnderline.setPosition(clickOrigin, this.size[1], 0);
            this.highlightUnderline.setOpacity(1);
            this.highlightUnderline.setSize(inputLength, 1, { duration: 175 });
            this.highlightUnderline.setPosition(0, this.size[1], 0, { duration: 175 });

            // flashyBar animations
            this.flashyBar.setOpacity(0.5);
            this.flashyBar.setSize(inputLength / 20, inputWidth);
            this.flashyBar.setSize(this.size[0]/10, inputWidth, { duration: 100 });
            this.flashyBar.setSize(0, this.size[1], { duration: 200 });
            this.flashyBar.setPosition(0, 0, 0, { duration: 200 });
        },

        /**
         * Toggles off animations
         * 
         * @protected
         * @method _toggleOff
         */
        _toggleOff: function() {
            // set everything back to pre-toggle state
            this.isToggled = !this.isToggled;
            this.highlightUnderline.setOpacity(0);
            this.highlightUnderline.setSize(0, 0);
            this.flashyBar.setPosition(this.size[0]/2, 0, 0);
        },
  });
    module.exports = UIInputField;
});
