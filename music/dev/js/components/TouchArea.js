define(function(require, exports, module) {
    var UIComponent         = require('core/UIComponent');
    var UIElement           = require('core/UIElement');
    var UIContainer         = require('containers/UIContainer');
    var FingerCircle        = require('./FingerCircle');
    var SecondaryCircle     = require('./SecondaryCircle');

    var TouchArea = UIContainer.extend({
        constructor: function(options) {
            this._callSuper(UIContainer, 'constructor', options);
            this.options = options;
            this.touchData = options.model;

            this.inputSurface = new UIElement({
                position: [0, 0, 1],
                style: {
                    opacity: 0
                }
            });

            this.fingerCircle = new FingerCircle({
                model: options.model
            });
            this.fingerCircle._eventHandler.pipe(this._eventHandler);

            this.secondaryCircle = new SecondaryCircle({
                model: options.model
            });
            this.secondaryCircle._eventHandler.pipe(this._eventHandler);

            this._addChild(this.inputSurface);
            this._addChild(this.fingerCircle);
            this._addChild(this.secondaryCircle);

            var delayShow = _.debounce(function(data) {this.secondaryCircle.show(data)}.bind(this), 200);

            this.inputSurface.on('touchStart', function (data) {
                this.startPos = [data.clientX, data.clientY];
                this.fingerCircle.show(data);
                delayShow(data);
            }.bind(this));

            this.inputSurface.on('touchUpdate', function (data) {
                this.secondaryCircle.update(data);
                this.fingerCircle.update(data);
            }.bind(this));

            this.inputSurface.on('tap', function (data) {
//                this.fingerCircle.tap(data);
            }.bind(this));

            this.inputSurface.on('touchEnd', function (data) {
                this.endPos = [data.clientX, data.clientY];
                if (this.startPos[0] == this.endPos[0] && this.startPos[1] == this.endPos[1]) {
                    this.tap();
                }
                this.hide();
            }.bind(this));


        },

        hide: function() {
            this.fingerCircle.reset();
            this.fingerCircle.setDelay(200, this.fingerCircle.hide.bind(this.fingerCircle));
            this.secondaryCircle.reset();
            this.secondaryCircle.setDelay(200, this.secondaryCircle.hide.bind(this.secondaryCircle));
            setTimeout(function(){
                this.emit('fingerHide')
            }.bind(this), 200);
        },

        showLine: function() {
            this.secondaryCircle.showLine();
        },

        tap: function() {
            this.emit('fingerTap', {
                count: 1,
                tap: true
            })
        },

        hideLine: function() {
            this.secondaryCircle.hideLine();
        }

    });

    module.exports = TouchArea;
});