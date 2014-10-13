define(function(require, exports, module) {
    var UIComponent         = require('core/UIComponent');
    var UIElement           = require('core/UIElement');
    var UIContainer         = require('containers/UIContainer');
    var FingerCircle        = require('./FingerCircle');
    var SecondaryCircle     = require('./SecondaryCircle');


    var TouchArea = UIContainer.extend({
        constructor: function(options) {
            UIContainer.prototype.constructor.call(this, options);

            var inputSurface = new UIElement({
                position: [0, 0, 1],
                style: {
                    opacity: 0
                }
            });

            var fingerCircle = new FingerCircle();

            fingerCircle._eventHandler.pipe(this._eventHandler);

            var secondaryCircle = new SecondaryCircle();
            secondaryCircle._eventHandler.pipe(this._eventHandler);

            inputSurface.on('touchStart', function(data){
                fingerCircle.show(data);
                secondaryCircle.show(data);
            });

            inputSurface.on('touchUpdate', function(data){
                secondaryCircle.update(data);
                fingerCircle.update(data);
            });

            inputSurface.on('tap', function(data){
                fingerCircle.tap(data);
            });

            inputSurface.on('touchEnd', function(){
                fingerCircle.reset();
                fingerCircle.setDelay(200, fingerCircle.hide.bind(fingerCircle));
                secondaryCircle.reset();
                secondaryCircle.setDelay(200, secondaryCircle.hide.bind(secondaryCircle));
            });

            this.on('secHide', function() {
                secondaryCircle.hideLine();
            });

            this.on('secShow', function() {
                secondaryCircle.showLine();
            })

            this._addChild(fingerCircle);
            this._addChild(secondaryCircle);
            this._addChild(inputSurface);
        }
    });

    module.exports = TouchArea;
});