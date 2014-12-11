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
    var UIComponent = require('core/UIComponent');
    var Button = require('controls/UIButton');

    var Transform = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');
    var PushButton = require('js/views/pages/PushButton');

    function TestPanelView(options){

        //TODO Bon
        window.panel = this;

        View.apply(this, arguments);
        _init.call(this);
        //_setListeners.call(this);

    }

    TestPanelView.prototype = Object.create(View.prototype);
    TestPanelView.prototype.constructor = TestPanelView;

    TestPanelView.DEFAULT_OPTIONS = {
        numberOfButtons: 3,
        buttonSize: [100, 100]
    };

    function _init(){

        this.redButton = new PushButton({
            content: '<img src="assets/imgs/RedSpinButton.png">',
            origin: [0.5,0.5],
            align: [0.5,0.5],
            position: [275,200,0],
            size: [300,300],
            shadowSize: [250,250],
            boxShadowBefore: '0px 0px 20px',
            boxShadowAfter: 'inset 0px 7px 150px',
            borderRadius: '130px'
        });
        this.add(this.redButton);

        this.greenButton = new PushButton({
            content: '<img src="assets/imgs/greenbutton.png">',
            size: [250,250],
            shadowSize: [210,210],
            position: [-300, 200, 0],
            boxShadowAfter: 'inset 0px 0px 100px',
            borderRadius: '130px'

        });
        this.add(this.greenButton);

        this.lineOne = new PushButton({
            //classes: ['orangeButton'],
            align: [0.25,0.25],
            origin: [0.5,0.5],
            content: '<img src="assets/imgs/YellowButton2.png">',
            size: [200,100],
            shadowSize: [193,92],
            position: [-100,0,0],
            //boxShadowBefore: '0px 0px 0px',
            boxShadowAfter: 'inset 0px 0px 100px',
            borderRadius: '10px',
            //backgroundColor: 'teal'
        });

        this.lineTwo = new PushButton({
            align: [0.25,0.25],
            origin: [0.5,0.5],
            content: '<img src="assets/imgs/YellowButton2.png">',
            size: [200,100],
            shadowSize: [193,92],
            position: [300,0,0],
            boxShadowAfter: 'inset 0px 0px 100px',
            borderRadius: '10px'
        });
        this.lineThree = new PushButton({
            align: [0.25,0.25],
            origin: [0.5,0.5],
            content: '<img src="assets/imgs/YellowButton2.png">',
            size: [200,100],
            shadowSize: [193,92],
            position: [700,0,0],
            boxShadowAfter: 'inset 0px 0px 100px',
            borderRadius: '10px'
        });

        this.add(this.lineOne);
            this.add(this.lineTwo);
                this.add(this.lineThree);



        //this.surface = new Surface({
           //define size, align in center
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

    //function _setListeners(){
    //    this.buttonShadow.on('click', function(){
    //        make shadow change
        //});
        //
        //this.surface.on('click', function(){
        //    make surface turn around
        //});
    //}

    module.exports = TestPanelView;

});