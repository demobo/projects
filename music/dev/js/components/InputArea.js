define(function(require, exports, module) {
    var UIComponent         = require('core/UIComponent');
    var UIElement           = require('core/UIElement');
    var UIContainer         = require('containers/UIContainer');
    var FingerCircle        = require('./FingerCircle');
    var SecondaryCircle     = require('./SecondaryCircle');


    var InputArea = UIContainer.extend({
        constructor: function(options) {
            this._callSuper(UIContainer, 'constructor', options);
            this.options = options;
            this.dataModel = options.model;

            var inputSurface = new UIElement({
                position: [0, 0, 1],
                style: {
                    opacity: 0
                }
            });

            var fingerCircle = new FingerCircle({
                model: options.model
            });
            fingerCircle._eventHandler.pipe(this._eventHandler);

            var secondaryCircle = new SecondaryCircle({
                model: options.model
            });
            secondaryCircle._eventHandler.pipe(this._eventHandler);

            this._addChild(inputSurface);
            this._addChild(fingerCircle);
            this._addChild(secondaryCircle);

            inputSurface.on('touchStart', function(data){
                fingerCircle.show(data);
                secondaryCircle.show(data)
            });

            inputSurface.on('touchUpdate', function(data){
                fingerCircle.update(data);
                secondaryCircle.update(data);
            });

            inputSurface.on('touchEnd', function(){
                fingerCircle.hide();
                secondaryCircle.hide();
            });
        }
    });

    module.exports = InputArea;
});