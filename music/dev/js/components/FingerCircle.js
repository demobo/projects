define(function(require, exports, module) {
    var UIComponent         = require('core/UIComponent');
    var UIElement           = require('core/UIElement');
    var UIContainer         = require('containers/UIContainer');

    var FingerCircle = UIComponent.extend({
        constructor:function(options) {
            this._callSuper(UIComponent, 'constructor', options);
            this.dataModel = options.model
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
            this.xValues = [0,0,0,0,0,0,0,0,0];
            this.yValues = [0,0,0,0,0,0,0,0,0];
        },

        reset: function() {
            this.fingers = {x:{},y:{}};
            this.x = 0;
            this.y = 0;
        },

        hide: function() {
            this.halt();
            this.setOpacity(0, {duration: 200, curve: "easeOut"});
            this.setScale(0,0,1, {duration : 200, curve : 'easeOut'});
        },

        show: function(data) {
            this.count = data.count;
            this.fingers.x[data.touch] = data.clientX;
            this.fingers.y[data.touch] = data.clientY;

            var len = _(this.fingers.x).size();
            var x = _.reduce(this.fingers.x, function(memo, num){ return memo + num; }, 0)/len;
            var y = _.reduce(this.fingers.y, function(memo, num){ return memo + num; }, 0)/len;

            if (data.count==_(this.fingers.x).size()) {
                this.setOpacity(0);
                this.setScale(0,0,1);
                this.circleSurface.setOpacity(0.3);
                if (data.count==1) {
                    this.color = "#ddd";
                    this.setSize(100,100);
                    this.circleSurface.setStyle({
                        border: "solid 5px "+this.color,
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
                    this.emit('fingerShow', {x: x, y: y});
                }.bind(this));
                this.update(data);
            }
        },

        update: function(data) {
            if (data.count) {
                this.fingers.x[data.touch] = data.clientX;
                this.fingers.y[data.touch] = data.clientY;
                var len = _(this.fingers.x).size();
                var stepSize = [20, 30,100];
                var limit = [100, 100, 100];

                if (data.count==this.count) {
                    var x = _.reduce(this.fingers.x, function(memo, num){ return memo + num; }, 0)/len;
                    var y = _.reduce(this.fingers.y, function(memo, num){ return memo + num; }, 0)/len;

                    if (this.y) this.yValues[data.count] = Math.floor(this.yValues[data.count]-y+this.y);
                    if (this.x) this.xValues[data.count] = Math.floor(this.xValues[data.count]-x+this.x);

                    this.x = x;
                    this.y = y;
                    this.setPosition(
                        x,
                        y
                    );

                    // y bounds
                    if (this.yValues[data.count] < 0) {
                        this.yValues[data.count] = 0;
                    } else if (this.yValues[data.count]/stepSize[data.count-1] > limit[data.count-1]) {
                        this.yValues[data.count] = stepSize[data.count-1]*limit[data.count-1];
                    }
                    // x bounds
                    if (this.xValues[data.count] < -1) {
                        this.xValues[data.count] = -1;
                    } else if (this.xValues[data.count]/100 > 1) {
                        this.xValues[data.count] = 100;
                    }

                    var yvalue = Math.max(0, Math.min(100, Math.floor(this.yValues[data.count]/stepSize[data.count-1])));
                    var xvalue = Math.max(-1, Math.min(1, Math.floor(this.xValues[data.count]/100)));


                    this.emit('fingerChange', {
                        delta: data.delta[1],
                        x: x,
                        y: y,
                        count: this.count,
                        color: this.color,
                        value: [xvalue,yvalue],
                        tap: false
                    });
                }
            }
        }

    });

    module.exports = FingerCircle;
});