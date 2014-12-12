define(function(require, exports, module) {
    var View = require('famous/core/View');
    var Engine = require('famous/core/Engine');
    var Surface = require('famous/core/Surface');
    var Modifier = require('famous/core/Modifier');
    var soundEffect = require('js/configs/SoundEffect');
    var slotGame = require('js/models/slotGame');

    var Transform = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');
    var UIComponent = require('core/UIComponent');
    var PushButton = require('js/views/pages/PushButton');

    function PanelView(options){

        //TODO Bon
        window.panel = this;

        View.apply(this, arguments);
        _init.call(this);
        _setupEvents.call(this);

    }

    PanelView.prototype = Object.create(View.prototype);
    PanelView.prototype.constructor = PanelView;

    PanelView.DEFAULT_OPTIONS = {
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
            boxShadowAfter: 'inset 0px 0px 75px',
            borderRadius: '10px'
            //backgroundColor: 'teal'
        });

        this.lineTwo = new PushButton({
            align: [0.25,0.25],
            origin: [0.5,0.5],
            content: '<img src="assets/imgs/YellowButton2.png">',
            size: [200,100],
            shadowSize: [193,92],
            position: [300,0,0],
            boxShadowAfter: 'inset 0px 0px 75px',
            borderRadius: '10px'
        });
        this.lineThree = new PushButton({
            align: [0.25,0.25],
            origin: [0.5,0.5],
            content: '<img src="assets/imgs/YellowButton2.png">',
            size: [200,100],
            shadowSize: [193,92],
            position: [700,0,0],
            boxShadowAfter: 'inset 0px 0px 75px',
            borderRadius: '10px'
        });

        this.add(this.lineOne);
        this.add(this.lineTwo);
        this.add(this.lineThree);

        this.moneyIsertBox = new Surface({
            size: [280, 10],
            properties: {
                background: 'black'
            }
        });
        this.moneyIsertBoxMod = new Modifier({
            origin: [1, 0],
            align: [1, 0],
            transform: Transform.translate(0,0,11)
        });
        this.add(this.moneyIsertBoxMod).add(this.moneyIsertBox);
    }

    function _setupEvents(){
        this.lineOne.buttonShadow.on('click', function(){
            slotGame.save('button0', Date.now())
        }.bind(this));
        this.lineTwo.buttonShadow.on('click', function(){
            slotGame.save('button1', Date.now())
        }.bind(this));
        this.lineThree.buttonShadow.on('click', function(){
            slotGame.save('button2', Date.now())
        }.bind(this));
        this.redButton.buttonShadow.on('click', function(){
            slotGame.save('button3', Date.now())
        }.bind(this));
        this.greenButton.buttonShadow.on('click', function(){
            slotGame.save('button4', Date.now())
            soundEffect.cashout.play()
        }.bind(this));


    }

    PanelView.prototype.setButtonEvent = function(button, index){
        //button.on('click', function(){
        //    console.log('click', index)
        //    slotGame.save('button' + index, Date.now())
        //}.bind(this))

    };

    window.slotGame = slotGame;

    module.exports = PanelView;


});