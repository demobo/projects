/* globals define */
define(function(require, exports, module) {
    var UIApplication = require('containers/UIApplication');
    var RectangularPrism = require('RectangularPrism');
    var UIElement = require('core/UIElement');
    var UISlider = require('controls/UISlider')

/*
    var Ball = UIElement.extend(  {
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
*/
    var app = new UIApplication({
        children: [
            new UIElement({
                    style: {
                        background: '#333',
                        zIndex: -1
                    },
                    position: [0,0,0]
                })
        ]
    });

/*
    var count = 1;
    var lastRect;
    for (var i = 0; i < count; i++) {
        setTimeout(function() {
        }, i*100);
    }
    */
    var lastRect = app.addChild(new RectangularPrism({size:[200,200], position:[500,300,50], origin:[0.5,0.5, 0.5]}));

    var slider = new UISlider({
                        max: 360,
                        size: [200, 50],
                        position: [900, 10, 10]
                });
    app.addChild(slider);

    slider.on('change', function(){
        lastRect.setRotation(0,slider.getValue()/180*Math.PI, 0);
    })

});
