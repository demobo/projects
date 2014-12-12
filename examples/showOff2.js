/* globals define */
define(function(require, exports, module) {
    var UIApplication = require('containers/UIApplication');
    var UIElement = require('core/UIElement');

    var Ball = UIElement.extend( /** @lends UIElement.prototype */ {
        constructor: function() {
            UIElement.prototype.constructor.call(this, {
                size: [50, 50]
            });
            this.setStyle({
                borderRadius: '50%',
                background: '#fff'
            });
            this.center();
            setInterval(function () {
                this.setOpacity(Math.random(), {
                    duration: 3000,
                    curve: 'spring'
                });
                this.setAlign([Math.random(), Math.random()], {
                    duration: 3000,
                    curve: 'spring'
                });
            }.bind(this), 3000);
        }
    });

    var app = new UIApplication({
        children: [
            new UIElement({
                    style: {
                        background: '#333'
                    }
                })
        ]
    });


    for (var i = 0; i < 200; i++) {
        setTimeout(function() {
            app.addChild(new Ball());
        }, i*100);
    }
});
