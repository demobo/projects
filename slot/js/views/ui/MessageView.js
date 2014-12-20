define(function(require, exports, module) {
    var UIElement           = require('core/UIElement');
    var UIComponent         = require('core/UIComponent');

    var MessageView = UIComponent.extend({
        constructor:function(options) {
            options = options || {};
            this.size       =   options.size            || [window.innerWidth/6, window.innerHeight/8];

            this._callSuper(UIComponent, 'constructor', {
                align: [0.5,0.5],
                origin: [0.5,0.5]
            });

            _createViews.call(this);

        },

        init: function() {
            this.message.setOpacity(0);
            this.message.setPosition(0,0,0);
        },

        hide: function() {
            this.halt();
            this.message.setOpacity(0, {duration: 1500, curve: "easeOut"});
            this.message.setContent('');
        },

        show: function() {
            this.halt();
            this.message.setOpacity(1, {duration: 1000, curve: "easeOut"}, function() {
                this.message.setOpacity(0, {duration: 2000, curve: "easeOut"});
                this.message.setContent('');
            }.bind(this));
            this.message.setScale([6, 6, 1], {duration : 3000, curve : 'easeOut'}, function() {
                this.message.setScale([1, 1, 1], {duration: 100});
            }.bind(this));
//                if (this.showTimeout) clearTimeout(this.showTimeout);
//                this.showTimeout = setTimeout(function(){this.hide()}.bind(this),100);
        },

        update: function(content) {
            this.message.setContent(content);
            this.show();
        }
    });

    function _createViews() {
        this.message = new UIElement({
            align: [0.5,0.5],
            origin: [0.5,0.5],
            position: [0, 0, 0],
            size: this.size,
            style: {
                backgroundColor: 'transparent',
                fontFamily: 'cursive',
                fontWeight: 200,
                fontSize: window.innerHeight/14 + 'px',
                textAlign: "center",
                color: "gold"
            }
        });
        this._addChild(this.message);
    }


    module.exports = MessageView;
});
