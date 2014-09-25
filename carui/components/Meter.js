define(function(require, exports, module) {
    var UIComponent         = require('core/UIComponent');
    var UIElement           = require('core/UIElement');

    var FingerCircle = UIComponent.extend({
        constructor:function(options) {
            this._callSuper(UIComponent, 'constructor', options);
            this.setOrigin([.5,.5]);

            this.circleSurface = new UIElement({
                classes: ['element'],
                style: {
                    borderRadius: "1000px"
                }
            });

            this._addChild(this.circleSurface);
            this.reset();
            this.hide();
        },

        reset: function() {
            this.fingers = {x:{},y:{}};
        },

        hide: function() {
            this.halt();
            this.setScale(0,0,1, {duration : 200, curve : 'easeOut'}, function() {
                this.emit('hide');
            }.bind(this));
            this.setOpacity(0, {duration: 200, curve: "easeOut"});
        },

        show: function(data) {
            this.count = data.count;
            this.update(data);
            if (data.count==_(this.fingers.x).size()) {
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
                    this.emit('hide');
                }.bind(this));
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
                    this.x = x;
                    this.y = y;
                    this.setPosition(
                        this.x,
                        this.y
                    );
                    this.emit('change', {delta: data.delta[1], x: x, y: y, count: this.count, color: this.color});
                }
            }
        }

    });

    module.exports = FingerCircle;
});


var Element = UIElement.extend({
    constructor: function(options) {
        options.style = {
            background: 'rgba(0,127,127,.8)',
            margin: options.margin+'px'
        };
        UIElement.prototype.constructor.call(this, options);
        this.setPosition(window.innerWidth*Math.random(), window.innerHeight*Math.random(), 10000);
        this.setRotation(Math.PI*100, 0, 0);
        this.center();
        this.on = false;
    },

    turnOn: function(duration) {
        if (this.on) return;
        var x = 0;
        var y = window.innerHeight - this.options.i*this.options.size[1];
        var z = 1;
        if (duration) {
            this.setPosition(x, y, z, { duration: duration, curve: 'easeOut' });
            this.setOpacity(.6, { duration: duration, curve: 'easeOut' });
            console.log(duration)
        } else {
            this.setPosition(x, y, z);
        }
        this.on=true;
    },

    turnOff: function(duration) {
        if (!this.on) return;
        var x = -this.options.size[0];
        var y = window.innerHeight - this.options.i*this.options.size[1];
        var z = 1;
        if (duration) {
            this.setPosition(x, y, z, { duration: duration, curve: 'easeOut' });
            console.log(duration)
        } else {
            this.setPosition(x, y, z);
        }
        this.on=false;
    }
});

var meter = window.meter = new (UIContainer.extend({
    constructor: function() {
        UIContainer.prototype.constructor.call(this, {
            size: [0, 0], // Size needs to be [0, 0] in order to make the rotation work properly
            elementWidth: 50,
            elementHeight: 7,
            elementMargin: 1
        });
        this.elements = [];

        // create Elements for each element in data
        for (var i = 0; i < 100; i++) {
            var element = new Element({
                i: i,
                size: [this.options.elementWidth, this.options.elementHeight],
                margin: this.options.elementMargin
            });
            this.elements.push(element);
            this._addChild(element);
        }
        this.value = 0;
        this.setValue(50);
    },

    setValue: function(value) {
        if (value==this.value) return;
        for (var i = 0; i < 100; i++) {
            var element = this.elements[i];
            var delay = 0   ;
            if (value>this.value && i<=value) {
                delay = Math.max(0,500-(value-i)*50);
            }
            if (value<this.value && i>value) {
                delay = Math.max(0,500-(i-value-1)*50);
            }
            if (i<=value) {
                element.turnOn(delay);
            } else {
                element.turnOff(delay);
            }
        }
        this.value = value;
    }
}))();