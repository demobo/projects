// TODO: refactor to follow UISlider style ~ Imti
define(function(require, exports, module) {
    var UIComponent = require('../core/UIComponent');
    var UIElement = require('../core/UIElement');
    var UIRadioButton = require('./UIRadioButton');

    var UIRadioGroup = UIComponent.extend( /** @lends UIComponent.prototype */ {
        /**
         * A group of radio buttons
         *
         * @name UIRadioGroup
         * @constructor
         *
         * @param {Object} [options] options to be set on UIRadioGroup
         * @param {Array} [options.colors] array of colors for radio buttons
         * @param {Array} [options.labels] array of labels for radio buttons
         */
        constructor: function(options) {
            this._callSuper(UIComponent, 'constructor', options);
            options = options || {};
            this.colors         = options.colors         || ['Green', 'Blue', 'Red'];
            this.size           = options.size           || [200, 300];
            this.labels         = options.labels         || ['Green', 'Blue', 'Red'];
            this.buttonSize     = options.buttonSize     || [48, 48];
            this._spacing       = this.buttonSize[0] + 10;
            this.radioButtons   = [];

            this._createLayout();
        },

        _createLayout: function(){
            for(var i = 0; i < this.labels.length; i++){

                var radioButton = new UIRadioButton({
                    size: this.buttonSize,
                    color: this.colors[i]
                });

                radioButton.setPosition(this.buttonSize[0], (this.buttonSize[0])*i);

                var label = new UIElement({
                    size: [200, 25],
                    content: this.labels[i]
                });

                label.setPosition(this.buttonSize[0] + this._spacing, (this.buttonSize[0])*i + this.buttonSize[0]/4);

                this.radioButtons.push(radioButton);
                this._addChild(radioButton);
                this._addChild(label);
            }
        }
    });

    module.exports = UIRadioGroup;
});
