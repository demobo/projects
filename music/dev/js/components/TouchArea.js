define(function(require, exports, module) {
    var UIComponent         = require('core/UIComponent');
    var UIElement           = require('core/UIElement');
    var UIContainer         = require('containers/UIContainer');

    var FingerCircle = UIComponent.extend({
        constructor:function(options) {
            this._callSuper(UIComponent, 'constructor', options);
            this.setOrigin([.5,.5]);
            this.setOpacity(0);

            this.circleSurface = new UIElement({
                classes: ['element'],
                style: {
                    borderRadius: "1000px"
                }
            });

            this._addChild(this.circleSurface);
            this.reset();
            this.hide();
            this.values = [0,0,0,0,0,0,0,0,0];
        },

        reset: function() {
            this.fingers = {x:{},y:{}};
            this.x = 0;
            this.y = 0;
        },

        hide: function() {
            this.halt();
            this.setOpacity(0, {duration: 200, curve: "easeOut"});
            this.setScale(0,0,1, {duration : 200, curve : 'easeOut'}, function() {
                this.emit('fingerHide');
            }.bind(this));
        },

        show: function(data) {
            this.count = data.count;
            this.fingers.x[data.touch] = data.clientX;
            this.fingers.y[data.touch] = data.clientY;
            if (data.count==_(this.fingers.x).size()) {
                this.setOpacity(0);
                this.setScale(0,0,1);
                if (data.count==1) {
                    this.color = "#ddd";
                    this.setSize(100,100);
                    this.circleSurface.setStyle({
                        border: "solid 2px "+this.color,
                        backgroundColor: "transparent"
                    });
                } else if (data.count==2) {
                    this.color = "#00d8ff";
                    this.setSize(400,400);
                    this.circleSurface.setStyle({
                        border: "solid 40px "+this.color,
                        backgroundColor: "transparent"
                    });
                } else {
                    this.color = "#C4CF47";
                    this.setSize(300,300);
                    this.circleSurface.setStyle({
                        border: "none",
                        backgroundColor: this.color
                    });
                }
                this.halt();
                this.setOpacity(1);
                this.setScale(1,1,1, {duration : 200, curve : 'easeOut'}, function(){
                    this.emit('fingerShow');
                }.bind(this));
                this.update(data);
            }
        },

        update: function(data) {
            if (data.count) {
                this.fingers.x[data.touch] = data.clientX;
                this.fingers.y[data.touch] = data.clientY;
                var len = _(this.fingers.x).size();
                if (data.count==this.count) {
                    var x = _.reduce(this.fingers.x, function(memo, num){ return memo + num; }, 0)/len;
                    var y = _.reduce(this.fingers.y, function(memo, num){ return memo + num; }, 0)/len;

                    if (this.y) this.values[data.count] = Math.floor(this.values[data.count]-y+this.y);

                    this.x = x;
                    this.y = y;
                    this.setPosition(
                        x,
                        y
                    );

                    var value = Math.max(0,Math.min(100, Math.floor(this.values[data.count]/10)));
                    this.emit('fingerChange', {
                        delta: data.delta[1],
                        x: x,
                        y: y,
                        count: this.count,
                        color: this.color,
                        value: value
                    });
                }
            }
        }

    });

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

            inputSurface.on('touchStart', function(data){
                fingerCircle.show(data);
            });

            inputSurface.on('touchUpdate', function(data){
                fingerCircle.update(data);
            });

            inputSurface.on('touchEnd', function(){
                fingerCircle.reset();
                fingerCircle.setDelay(200, fingerCircle.hide.bind(fingerCircle));
            });

            this._addChild(fingerCircle);
            this._addChild(inputSurface);
        }
    });

    module.exports = TouchArea;
});