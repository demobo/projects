define(function(require, exports, module) {

    var UIComponent = require('../core/UIComponent');
    var UIElement = require('../core/UIElement');
    var CheckBox = require('./UICheckBox');

    var UICheckboxGroup = UIComponent.extend( /** @lends UIComponent.prototype */ {
        constructor: function(options) {
            options = options || {};
            this._callSuper(UIComponent, 'constructor', options);

            this.labels = options.labels || ['I\'m a label', 'I\'m another label', 'I\'m superman'];
            this.checkSize      = options.checkSize  || [48, 48];
            this._spacing       = this.checkSize[0] + 10;
            this.toggleButtons  = [];

            this.createLayout();
        },

        createLayout: function(){
            for(var i = 0; i < this.labels.length; i++){
                var toggleButton = new CheckBox({
                    size: this.checkSize
                });

                toggleButton.setPosition(this.checkSize[0], (this.checkSize[0])*i);

                var label = new UIElement({
                    size: [200, 30],
                    content: this.labels[i]
                });

                label.setPosition(this.checkSize[0] + this._spacing, (this.checkSize[0])*i + this.checkSize[0]/4);

                this.toggleButtons.push(toggleButton);
                this._addChild(toggleButton);
                this._addChild(label);
            }
        }
    });

    module.exports = UICheckboxGroup;
});
