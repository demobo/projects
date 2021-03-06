define(function(require, exports, module) {

    // main requires
    var UIContainer         = require('containers/UIContainer');
    var UIElement           = require('core/UIElement');
    var UIApplication       = require('containers/UIApplication');
    var UIButton            = require('controls/UIButton');

    var stepHeight = 100;
    var stepWidth = 50;
    var margin = 1;

    var shift = 0;

    var stepTransition = {
        duration: 300,
        curve: 'inOutExpo'
    };

    var touchArea = new UIElement({
        size:[undefined, undefined]
    });
    touchArea.setPosition(0, 0, 1);

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
            touchArea.on('mousedown', function(event){
                this.initPos = event.clientY;
                if (this.options.yPosition + stepHeight > event.clientY && this.options.yPosition < event.clientY){
                    if (this._showing === false){
                        this.toShow();
                        this.setOpacity(0.5);
                    }
                    this.isBase = true
                }
            }.bind(this));
            touchArea.on('mousemove', function(event){
                if (this.initPos && !this.isBase){
                    var shiftedYpos = this.options.yPosition + shift;
                    if ((this.initPos > shiftedYpos + stepHeight && shiftedYpos + stepHeight > event.clientY) || (shiftedYpos > this.initPos && shiftedYpos < event.clientY)){
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
            touchArea.on('mouseup', function(event){
                this.initPos = false;
                this.isBase = false;
                this.toHide();
            }.bind(this));
        },

        toShow: function() {
            this.halt();
            this.setPosition(0, this.options.yPosition, 0, stepTransition);
            this.setOpacity(1, stepTransition);
            this._showing = true;
        },

        toHide: function() {
            this.halt();
            this.setPosition(-stepWidth+1, this.options.yPosition, 0, stepTransition);
            this.setOpacity(0.1 , stepTransition);
            this._showing = false;
        },

        toInitTheFirst: function() {
        }


    });

    // Element steps are UIElements
    var MeterDot = UIElement.extend({
        constructor: function(options) {
            options.yPosition = (options.i-1)*(stepHeight+margin);
            options.content = ".";
            options.style = {
                marginTop: stepHeight + margin - 17 +'px',
                color: '#00d8ff'
            };
            UIElement.prototype.constructor.call(this, options);
            this._showing = false;
            this.setPosition(0, this.options.yPosition, 0);
            this.setOpacity(0);
            touchArea.on('mousedown', function(event){
                this.toShow();
            }.bind(this));
            touchArea.on('mouseup', function(event){
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
    var meterBar = new (UIContainer.extend({
        constructor: function() {
            UIContainer.prototype.constructor.call(this);
            // create Steps for each step in meter
            for (var i_bar = 0; i_bar < window.innerHeight/stepHeight+2; i_bar++) {
                var element_bar = new MeterBar({
                    i: i_bar,
                    size: [stepWidth, stepHeight]
                });
                this._addChild(element_bar);
            }
            for (var i = 0; i < window.innerHeight/stepHeight+2; i++) {
                var element = new MeterDot({
                    i: i,
                    size: [stepWidth, stepHeight]
                });
                this._addChild(element);
            }
            touchArea.on('mousedown', function(event) {
                shift = (event.clientY % (stepHeight + margin)) - stepHeight/2;
                this.setPosition(0, shift, 0)
            }.bind(this));

        },

        setSize: function(){

        },

        toInitTheFirst: function() {
        }

    }))();

    var app = new UIApplication();
    app.addChild(meterBar);
    app.addChild(touchArea);

});
