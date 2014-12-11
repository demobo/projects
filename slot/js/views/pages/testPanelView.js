define(function(require, exports, module) {
    var View = require('famous/core/View');
    var Engine = require('famous/core/Engine');
    var Surface = require('famous/core/Surface');
    var Modifier = require('famous/core/Modifier');
    var Transform = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');
    var UIElement = require('core/UIElement');
    var Flipper    = require("famous/views/Flipper");
    var Easing = require('famous/transitions/Easing');

    var soundEffect = require('js/configs/SoundEffect');
    var slotGame = require('js/models/slotGame');


    function TestPanelView(options){

        //TODO Bon
        window.panel = this;

        View.apply(this, arguments);
        _init.call(this);
        _setListeners.call(this);

    }

    TestPanelView.prototype = Object.create(View.prototype);
    TestPanelView.prototype.constructor = TestPanelView;

    TestPanelView.DEFAULT_OPTIONS = {
        numberOfButtons: 3,
        buttonSize: [100, 100]
    };

    function _init(){

        this.button = new UIElement({
            //define align, origin, size, style
            //use image in content

        });
        //add button to this

        this.buttonShadow = new UIElement({
            //define with same align origin etc (put in front of button);
            //make the size same as the red part
            //make it have transparent background, no content
            //apply shadow
        });

        this.flipper = new Flipper();

        this.frontSurface = new UIElement({
            origin: [.5,.5],
            align: [.5,.5],
            size:[600,200],
            content : 'Touch to Start',
            style: {
                textAlign: 'center',
                fontSize:'60px',
                lineHeight: '100px',
                padding:'50px',
                color: 'white',
                background: 'url(assets/imgs/start-button.png)',
                backgroundRepeat:'no-repeat'



            }
        });

        this.backSurface= new UIElement({
            origin: [.5,.5],
            align: [.5,.5],
            size:[800,500],
            content : 'Game Start',
            style: {
                textAlign: 'center',
                lineHeight: '60px',
                fontSize: '30px',
                color: '#000',
                backgroundColor:'blue'
            }
        });

       this.centerModifier = new StateModifier({
            align: [0.5,0.5],
            origin:[0.5,0.5]
        })

        this.flipper.setBack(this.backSurface);
        this.flipper.setFront(this.frontSurface);


        this.add(this.centerModifier).add(this.flipper);


    }



    function _setListeners(){
        this.buttonShadow.on('click', function(){
            //make shadow change
        });

        //this.surface.on('click', function(){
        //    //make surface turn around`
        //});

        var toggle = false;
        Engine.on('click', function(){
            var angle = toggle ? 0 : Math.PI;
            if (toggle) {
                this.backSurface.setScale(1, 1, 1, {method: 'spring'},function(){
                    this.flipper.setAngle(angle, {curve: Easing.inQuad, duration : 1000});
                }.bind(this));
            } else {
                this.flipper.setAngle(angle, {curve: Easing.inQuad, duration : 1000}, function(){
                    this.backSurface.setScale(1.5, 1.5, 1, {
                        method: 'spring'
                    });
                }.bind(this));
            }
            toggle = !toggle;
        }.bind(this));



    }



    module.exports = TestPanelView;

});