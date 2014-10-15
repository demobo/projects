define(function(require, exports, module) {

    // main requires
    var UIContainer         = require('containers/UIContainer');
    var UIElement           = require('core/UIElement');
    var UIApplication       = require('containers/UIApplication');
    var UIButton            = require('controls/UIButton');

    var stepHeight = 100;
    var stepWidth = 10;
    var margin = 1;

    var shift = 0;

    var n1 = 40;
    var n2 = 10;
    var n3 = 5;

    var stepTransition = {
        duration: 100,
        curve: 'inOutExpo'
    };


    var _setStepHeight = function(index, object, height){
        object.height = height;
        object.setSize(stepWidth, object.height);
        object.options.yPosition = (index-2)*(object.height+margin);
        object.halt();
        object.setPosition(-stepWidth+1, object.yPosition, 0);
    };

    // Element steps are UIElements
    var MeterBar = UIElement.extend({
        constructor: function(options) {
            options.yPosition = (options.i-1)*(stepHeight+margin);
            options.style = {
                background: '#00d8ff'
            };
            UIElement.prototype.constructor.call(this, options);
            this._showing = false;
            this.setPosition(-stepWidth+1, this.options.yPosition, 0);
            this.setOpacity(0.1);
            this.on('eventstart', function(event){
                this.initPos = event.y;
                var stepHeigth;
                if (event.count == 1) {
                    this.setStyle({background: '#ddd'});
                    stepHeigth = window.innerHeight/n1
                } else if (event.count == 2) {
                    this.setStyle({background: '#00d8ff'});
                    stepHeigth = window.innerHeight/n2
                } else {
                    this.setStyle({background: '#C4CF47'});
                    stepHeigth = window.innerHeight/n3
                }
                _setStepHeight(options.i, this, stepHeigth);
                if (this.options.yPosition + this.height > event.y && this.options.yPosition < event.y){
                    if (this._showing === false){
                        this.toShow();
                        this.setOpacity(0.5);
                    }
                    this.isBase = true;
                }
//                if (event.tap){
//                    this.emit('eventend')
//                }
            }.bind(this));
            this.on('eventupdate', function(event){
                if (this.initPos && !this.isBase){
                    var shiftedYpos = this.options.yPosition + shift;
                    if ((this.initPos > shiftedYpos + this.height && shiftedYpos + this.height > event.y) || (shiftedYpos > this.initPos && shiftedYpos < event.y)){
                        if (this._showing === false){
                            this.toShow()
                        }
                    } else {
                        if (this._showing === true){
                            this.toHide()
                        }
                    }
                }
            }.bind(this));
            this.on('eventend', function(event){
                this.initPos = false;
                this.isBase = false;
                this.toHide();
            }.bind(this));
        },

        toShow: function() {
            this.halt();
            this.setPosition(-stepWidth+1, this.options.yPosition, 0);
            this.setPosition(0, this.options.yPosition, 0, stepTransition);
            this.setOpacity(1, stepTransition);
            this._showing = true;
        },

        toHide: function() {
            this.halt();
            this.setPosition(-stepWidth+1, this.options.yPosition, 0, stepTransition);
            this.setOpacity(0.1 , stepTransition);
            this._showing = false;
        }

    });

    // Element steps are UIElements
    var MeterDot = UIElement.extend({
        constructor: function(options) {
            options.yPosition = (options.i-2)*(stepHeight+margin);
            options.content = ".";
            options.style = {
                marginTop: stepHeight + margin - 17 +'px',
                color: '#00d8ff'
            };
            UIElement.prototype.constructor.call(this, options);
            this._showing = false;
            this.setPosition(0, this.options.yPosition, 0);
            this.setOpacity(0);
            this.on('eventstart', function(event){
                this.toShow();
                if (event.count == 1) {
                    this.setStyle({color: '#ddd'})
                } else if (event.count == 2) {
                    this.setStyle({color: '#00d8ff'})
                } else {
                    this.setStyle({color: '#C4CF47'})
                }
            }.bind(this));
            this.on('eventend', function(event){
                this.toHide();
            }.bind(this));
        },

        toShow: function() {
            this.halt();
            this.setOpacity(1, stepTransition);
        },

        toHide: function() {
            this.halt();
            this.setOpacity(0, stepTransition);
        }
    });

    // The periodic table is an UIContainer
    var meterBar = UIContainer.extend({
        constructor: function() {
            UIContainer.prototype.constructor.call(this);
            // create Steps for each step in meter
            for (var i_bar = 0; i_bar < n1; i_bar++) {
                var element_bar = new MeterBar({
                    i: i_bar,
                    size: [stepWidth, stepHeight]
                });
                this._eventHandler.pipe(element_bar._eventHandler);
                this._addChild(element_bar);
            }
            for (var i = 0; i < n1; i++) {
                var element = new MeterDot({
                    i: i,
                    size: [stepWidth, stepHeight]
                });
                this._eventHandler.pipe(element._eventHandler);
                this._addChild(element);
            }
            this.on('eventstart', function(event) {
                shift = (event.y % (stepHeight + margin)) - stepHeight/2;
                this.setPosition(0, shift, 0)
            }.bind(this));

        },

        setSize: function(){

        },

        toInitTheFirst: function() {
        },

        hide: function() {
            this.emit('eventend');
        },

        show: function(data) {
            this.emit('eventstart', data);
        },

        update: function(data) {
            this.emit('eventupdate', data);
        }

    });

    module.exports = meterBar;

});
