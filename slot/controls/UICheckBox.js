define(function(require, exports, module) {

    var UIComponent = require('../core/UIComponent');
    var UIElement = require('../core/UIElement');
    var Transform = require('famous/core/Transform');
    var Easing = require('famous/transitions/Easing');
    var UIBoundingBox = require('./UIBoundingBox');

    var CheckBoxComponent = UIComponent.extend( /** @lends UIComponent.prototype */ {
        constructor: function(options) {
            this._callSuper(UIComponent, 'constructor', options);

            // Define property to check the state of the button
            this._isChecked = false;
            this._beingAnimated = false;

            // Set user defined style or defaults
            this.size = this.options.size || 48;
            this.backgroundColor = this.options.backgroundColor || 'green';
            this.boxColor = this.options.boxColor || 'blue';
            this.checkColor = this.options.checkColor || 'green';

            // Define sizes of elements
            this._boxSize = [Math.floor(this.size[1]/3), Math.floor(this.size[1]/3)];
            this._checkSize = [Math.floor(this.size[1]/4.8), Math.floor(this.size[1]/2.28)];

            // We create our box with the necessary style and add it to ourself
            this._createCheckBoxBackground();
            this._createBox();
            this._createBoundingBox();

            //Bind click events to the two elements
            this._boundingBox.on('mousedown', this.toggle.bind(this));

        },

        /**
         * Created check box
         *
         * @protected
         * @method _createBox
         */
        _createBox: function (options2){
            this._box = new UIElement({
                size: this._boxSize,
                origin: [0.33, 1],
                align: [0.45, 0.65],
                style:{
                    border: 'solid 2px',
                    borderColor: this.boxColor
                }
            });
            this._addChild(this._box);
        },

        /**
         * Creates the checkbox bacground
         *
         * @protected
         * @method _createCheckBoxBackground
         */
        _createCheckBoxBackground: function (){
            this._backgroundElement = new UIElement({
                size: [undefined, undefined],
                opacity: '0',
                style: {
                    borderRadius: this.size[1]/2 + 'px',
                    background: this.backgroundColor,
                }
            });
            this._addChild(this._backgroundElement);
        },

        /**
         * Creates boundingBox that hanldes all touch events
         *
         * @protected
         * @method _createBoundingBox
         */
        _createBoundingBox: function(){
            this._boundingBox = new UIBoundingBox();
            this._addChild(this._boundingBox);
        },

        isChecked: function (){
            return this._isChecked;
        },

        toggle: function(){

            if(!this._beingAnimated){
                this._beingAnimated = true;

                // Scale down/up when the user clicks
                if(!this.isChecked){

                    this._box.setSize(0, 0 ,{
                        duration : 140
                    }, function(){
                        this._box.setOrigin([0.33, 1], { duration: 100 });
                        this._box.setRotation(0, 0, 0,{
                            duration : 100
                        });
                        this._box.setStyle({
                            borderTop: 'solid 2px blue',
                            borderLeft: 'solid 2px blue',
                            borderColor: this.boxColor
                        });
                        this._box.setSize(this._boxSize[0], this._boxSize[1], { duration : 100 });
                        this._beingAnimated = false;
                    }.bind(this));

                } else {

                    this._box.setRotation(0, 0, Math.PI/4,{
                        duration : 100
                    },function(){
                        this._box.setStyle({
                            borderColor: this.checkColor,
                            borderTop: '0px',
                            borderLeft: '0px'
                        });
                        this._box.setOrigin([1, 1], { duration: 50 });
                    }.bind(this));

                    this._box.setSize(0, 0 ,{
                        duration : 140
                    },function(){
                        this._beingAnimated = false;
                        this._box.setSize(this._checkSize[0], this._checkSize[1], { duration : 60 });
                    }.bind(this));

                }
                this.isChecked = !this.isChecked;

                // Background flashes on click
                this._backgroundElement.setOpacity(0.2, {
                    duration : 80, curve: 'outBack'
                },function(){
                    this._backgroundElement.setOpacity(0, { duration : 200, curve: Easing.outBack });
                }.bind(this));
            }
        }

    });

    module.exports = CheckBoxComponent;
});
