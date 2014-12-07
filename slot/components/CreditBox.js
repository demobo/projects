define(function(require, exports, module) {
    var UIComponent         = require('core/UIComponent');
    var UIElement           = require('core/UIElement');
    var UIContainer         = require('containers/UIContainer');
    var slotGame            = require('js/models/slotGame');

    var CreditBox = UIContainer.extend({
        constructor:function(options) {
            this._callSuper(UIContainer, 'constructor', options);
            this.options = options;
            this.creditNumber = new UIElement({
                style: {
                    textAlign: 'center',
                    lineHeight: '60px',
                    fontSize: '30px',
                    color: '#000',
                    backgroundColor: '#f33'
                }
            });

            this._addChild(this.creditNumber);

            slotGame.on('change:credit', function(model, val){
                this.credit = val;
                var content = '<div>' + this.credit + '</div>';
                this.creditNumber.setContent(content);
            }.bind(this));
//            slotGame.save('credit',100);
        },

        add: function(n) {
            this.credit = this.credit + n;
            var content = '<div>' + this.credit + '</div>';
            this.creditNumber.setContent(content);
        },

        minus: function(n) {
            this.credit = this.credit - n;
            var content = '<div>' + this.credit + '</div>';
            this.creditNumber.setContent(content);
        }

    });

    module.exports = CreditBox;
});