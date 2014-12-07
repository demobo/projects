define(function(require, exports, module) {
    var UIComponent         = require('core/UIComponent');
    var UIElement           = require('core/UIElement');
    var UIContainer         = require('containers/UIContainer');
    var slotGame            = require('js/models/slotGame');
    var soundEffect         = require('components/SoundEffect');

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
                //var originalCredit = this.creditNumber.getContent();
                //
                // console.log(originalCredit)
                //for (var i = originalCredit; i == val; i++) { console.log(originalCredit)
                //    var content =  '<div>' + originalCredit + 1 + '</div>';
                //    originalCredit++;
                //    this.creditNumber.setContent(content);
                //}
                var content = '<div>' + this.credit + '</div>';
                this.creditNumber.setContent(content);
                soundEffect.credit.play();
            }.bind(this));
            slotGame.save('credit',100);
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