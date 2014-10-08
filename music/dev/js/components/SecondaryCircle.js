define(function(require, exports, module) {
    var UIComponent         = require('core/UIComponent');
    var UIElement           = require('core/UIElement');
    var UIContainer         = require('containers/UIContainer');

    var SecondaryCircle = UIComponent.extend({
        constructor:function(options) {
            this._callSuper(UIComponent, 'constructor', options);
            this.setOpacity(0);

            this.circleLabel = new UIElement({
                align: [-0.01, -0.01],
                origin: [1, 1],
                style: {
                    textAlign: "center"
                }
            });
            this.secondaryCircle = new UIElement({
                origin: [0.5, 0.5],
                classes: ['element'],
                style: {
                    borderRadius: "1000px",
                    borderColor: "#FFFFFF"
                }
            });

            this.line = new UIElement({
                origin: [1, 0],
                size: [1, 1],
                style:{
                    backgroundColor: "#FFFFFF"
                },
                opacity: 0.5
            });

            this._addChild(this.circleLabel)._addChild(this.secondaryCircle)._addChild(this.line);
            this.reset();
            this.hide();
        },

        reset: function() {
            this.fingers = {x:{},y:{}};
            this.x = 0;
            this.y = 0;
        },

        hide:function() {
            this.halt();
            this.setOpacity(0, {duration: 200, curve: "easeOut"});
            this.setScale(0, 0, 1, {duration: 200, curve: "easeOut"}, function () {
                this.emit('fingerHide');
            }.bind(this));
            this.line.setSize([1 , 1], {duration: 200, curve: "inSine"});

        },

        show:function(data) {
            this.count = data.count;
            this.fingers.x[data.touch] = data.clientX;
            this.fingers.y[data.touch] = data.clientY;


            if (data.count == _(this.fingers.x).size()) {
                this.setOpacity(0);
                this.setScale(0, 0, 1);
                this.line.setSize([1000 , 1], {duration: 300, curve: "inSine"});
                if (data.count == 1) {
                    this.circleLabel.setContent("VOLUME");
                    this.circleLabel.setSize([80,20]);
                    this.circleLabel.setStyle({
                        backgroundColor: "#ddd"
                    });
                } else if (data.count == 2){
                    this.circleLabel.setContent("PLAYLIST");
                    this.circleLabel.setSize([80,20]);
                    this.circleLabel.setStyle({
                        backgroundColor: "#00d8ff"
                    });
                } else {
                    this.circleLabel.setContent("MUSIC SOURCE");
                    this.circleLabel.setSize([130,20]);
                    this.circleLabel.setStyle({
                        backgroundColor: "#C4CF47"
                    });
                }

                this.halt();
                this.setOpacity(1);
                this.setScale(1, 1, 1, {duration: 200, curve: "easeOut"}, function () {
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

                    this.x = x;
                    this.y = y;
                    this.setPosition(
                        x,
                        y
                    );


                    var radius = Math.sqrt(Math.pow(data.clientX - x,2) + Math.pow(data.clientY - y,2))*2;
                    if (data.count==1) {
                        this.secondaryCircle.setSize([0,0]);
                    } else if (data.count==2) {
                        if (radius <= 150) {
                            this.secondaryCircle.setSize([150,150]);
                        } else if (radius >= 290) {
                            this.secondaryCircle.setSize([290,290]);
                        } else {
                            this.secondaryCircle.setSize([radius, radius]);
                        }
                    } else {
                        if (radius <= 325) {
                            this.secondaryCircle.setSize([310,310]);
                        } else {
                            this.secondaryCircle.setSize([radius,radius]);
                        }
                    }
                }
            }
        }
    });

    module.exports = SecondaryCircle;
});/**
 * Created by betty on 10/8/14.
 */
