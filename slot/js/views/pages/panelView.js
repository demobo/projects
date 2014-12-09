define(function(require, exports, module) {
    var View = require('famous/core/View');
    var Engine = require('famous/core/Engine');
    var Surface = require('famous/core/Surface');
    var Modifier = require('famous/core/Modifier');
    var soundEffect = require('js/configs/SoundEffect');
    var slotGame = require('js/models/slotGame');

    var Transform = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');

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
        var button1Mod = new StateModifier({
            align: [0.2,0.35],
            origin:[0.5,0.5]
        });

        var button1 = new Surface({
            size: [400, 250],
            content:'<h3>WIN 1 Line</h3>',
            properties: {
                fontSize:'25px',
                color:'black',
                textAlign:'center',
                padding:'40px',
                backgroundImage:'url(assets/white-button.png)',
                backgroundRepeat:'no-repeat',
                backgroundSize:'100%'
            }
        });

        var button2Mod = new StateModifier({
            align: [0.45,0.35],
            origin:[0.5,0.5]
        });

        var button2 = new Surface({
            size: [400, 250],
            content:'<h3>WIN 3 Lines</h3>',
            properties: {
                fontSize:'25px',
                color:'black',
                textAlign:'center',
                padding:'40px',
                backgroundImage:'url(assets/white-button.png)',
                backgroundRepeat:'no-repeat',
                backgroundSize:'100%'
            }
        });

        var button3Mod = new StateModifier({
            align: [0.7,0.35],
            origin:[0.5,0.5]
        });

        var button3 = new Surface({
            size: [400, 250],
            content:'<h3>WIN 5 Lines</h3>',
            properties: {
                fontSize:'25px',
                color:'black',
                textAlign:'center',
                padding:'40px',
                backgroundImage:'url(assets/white-button.png)',
                backgroundRepeat:'no-repeat',
                backgroundSize:'100%'
            }
        });

        var button4Mod = new StateModifier({
            align: [0.7,0.7],
            origin:[0.5,0.5]
        });

        var button4 = new Surface({
            size: [350, 350],
            content:'<h3>SPIN</h3>',
            properties: {
                color: 'white',
                fontSize:'60px',
                textAlign:'center',
                padding:'50px',
                backgroundImage:'url(assets/push-button-glossy-red-md.png)',
                backgroundRepeat:'no-repeat',
                backgroundSize:'100%'
            }
        });

        var button5Mod = new StateModifier({
            align: [0.25,0.7],
            origin:[0.5,0.5]
        });

        var button5 = new Surface({
            size: [250, 250],
            content:'<h3>Cash Out</h3>',
            properties: {
                color:'white',
                fontSize:'40px',
                textAlign:'center',
                padding:'30px',
                backgroundImage:'url(assets/green-button.png)',
                backgroundRepeat:'no-repeat',
                backgroundSize:'100%'}
            });

        var button6Mod = new StateModifier({
                align: [0,0.8],
                origin:[0.5,0.5]
            });

        var button6 = new Surface({
            size: [400, 250],
            properties: {
                backgroundColor:'transparent'

            }
        });


        this.add(button1Mod).add(button1);
        this.add(button2Mod).add(button2);
        this.add(button3Mod).add(button3);
        this.add(button4Mod).add(button4);
        this.add(button5Mod).add(button5);
        this.add(button6Mod).add(button6);


        button1.on('click', function(){
            slotGame.save('button0', Date.now())
            soundEffect.tap.play();
        }.bind(this))
        button2.on('click', function(){
            slotGame.save('button1', Date.now())
            soundEffect.tap.play();
        }.bind(this))
        button3.on('click', function(){
            slotGame.save('button2', Date.now())
            soundEffect.tap.play();
        }.bind(this))
        button4.on('click', function(){
            slotGame.save('button3', Date.now())
            soundEffect.tap.play();
        }.bind(this))
        button5.on('click', function(){
            slotGame.save('button4', Date.now())
            soundEffect.cashout.play()
        }.bind(this))
        button6.on('click', function(){
        slotGame.save('button5', Date.now())
        soundEffect.cashout.play()
        }.bind(this))

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

    }

    PanelView.prototype.setButtonEvent = function(button, index){
        button.on('click', function(){
            console.log('click', index)
            slotGame.save('button' + index, Date.now())
        }.bind(this))

    };

    window.slotGame = slotGame;

    module.exports = PanelView;


});