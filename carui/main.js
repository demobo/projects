define(function(require, exports, module) {
    var UIApplication = require('containers/UIApplication');
    var UIElement = require('core/UIElement');
    var Transitionable = require('famous/transitions/Transitionable');
    var UIContainer         = require('containers/UIContainer');

    var itemValue = new Transitionable(50);
    var volumeValue = new Transitionable(50);
    var brightnessValue = new Transitionable(50);

    var background = new UIElement({
        style: {
            background: '#333'
        }
    });

    var labelSurface = new UIElement({
        position: [0, 0, 1],
        size: [400,100],
        style: {
            fontFamily: 'avenir next',
            fontWeight: 200,
            fontSize: "72px",
            textAlign: "left"
        }
    });

    var inputSurface = new UIElement({
        position: [0, 0, 1],
        style: {
            opacity: 0
        }
    });

    var FingerCircle = UIElement.extend({
        constructor: function(options) {
            UIElement.prototype.constructor.call(this, options);
            this.setOrigin([.5,.5]);
            this.setStyle({
                borderRadius: "1000px"
            });
            this.reset();
            this.hide();
        },
        reset: function() {
            this.fingers = {x:{},y:{}};
        },
        hide: function() {
            this.halt();
            this.setScale(0,0,1, {duration : 200, curve : 'easeOut'}, function() {
                labelSurface.setContent("");
            });
            this.setOpacity(0, {duration: 200, curve: "easeOut"});
        },
        show: function(data) {
            this.count = data.count;
            this.update(data);
            if (data.count==_(this.fingers.x).size()) {
                if (data.count==1) {
                    this.color = "#ddd";
                    this.setSize(100,100);
                    this.setStyle({
                        border: "solid 2px "+this.color,
                        backgroundColor: "transparent"
                    });
                } else if (data.count==2) {
                    this.color = "#00d8ff";
                    this.setSize(400,400);
                    this.setStyle({
                        border: "solid 40px "+this.color,
                        backgroundColor: "transparent"
                    });
                } else {
                    this.color = "#C4CF47";
                    this.setSize(300,300);
                    this.setStyle({
                        border: "none",
                        backgroundColor: this.color
                    });
                }
                this.halt();
                this.setOpacity(1);
                this.setScale(1,1,1, {duration : 200, curve : 'easeOut'});
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
                    var delta = data.delta[1];
                    var v, c;
                    if (this.count==1) {
                        v = itemValue.get()-delta;
                        itemValue.set(v);
                        c = Math.floor(v/50);
                        if (c>=0 && c<=100) {
                            labelSurface.setContent(c);
                            meter.setValue(c);
                        }
                    } else if (this.count==2) {
                        v = volumeValue.get()-delta;
                        volumeValue.set(v);
                        c = Math.floor(v/50);
                        if (c>=0 && c<=100) {
                            labelSurface.setContent(c);
                            meter.setValue(c);
                        }
                    } else if (this.count==3) {
                        v = brightnessValue.get()-delta;
                        brightnessValue.set(v);
                        c = Math.floor(v/50);
                        if (c>=0 && c<=100) {
                            labelSurface.setContent(c);
                            meter.setValue(c);
                        }
                    }
                    labelSurface.setStyle({
                        color: this.color
                    });
                    this.x = x;
                    this.y = y;
                    this.setPosition(
                        this.x,
                        this.y
                    );
                }
            }
        }
    });

    var fingerCircle = new FingerCircle();
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


    var app = new UIApplication();
    app.addChild(background);
    app.addChild(labelSurface);
    app.addChild(fingerCircle);
    app.addChild(meter);
    app.addChild(inputSurface);

});
