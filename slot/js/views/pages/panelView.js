define(function(require, exports, module) {
    var View = require('famous/core/View');
    var Engine = require('famous/core/Engine');
    var Surface = require('famous/core/Surface');
    var Modifier = require('famous/core/Modifier');
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
        //for (var i = 0; i < 3; i++){
        //    this.addButton(i);
        //}
        var button1Mod = new StateModifier({
            transform: Transform.translate(200, 250, 0)
        });

        var button1 = new Surface({
            size: [400, 250],
            content:'<h3>WIN 1 Line</h3>',
            properties: {
                fontSize:'25px',
                color:'white',
                textAlign:'center',
                backgroundImage:'url(assets/yellow-button.png)',
                backgroundRepeat:'no-repeat',
                backgroundSize:'100%'
            }
        });

        var button2Mod = new StateModifier({
            transform: Transform.translate(700, 250, 0)
        });

        var button2 = new Surface({
            size: [400, 250],
            content:'<h3>WIN 3 Lines</h3>',
            properties: {
                fontSize:'25px',
                color:'white',
                textAlign:'center',
                backgroundImage:'url(assets/light-blue-button.png)',
                backgroundRepeat:'no-repeat',
                backgroundSize:'100%'
            }
        });

        var button3Mod = new StateModifier({
            transform: Transform.translate(1150, 250, 0)
        });

        var button3 = new Surface({
            size: [400, 250],
            content:'<h3>WIN 5 Lines</h3>',
            properties: {
                fontSize:'25px',
                color:'white',
                textAlign:'center',
                backgroundImage:'url(assets/purple-button.png)',
                backgroundRepeat:'no-repeat',
                backgroundSize:'100%'
            }
        });

        var button4Mod = new StateModifier({
            transform: Transform.translate(1250, 500, 0)
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
            transform: Transform.translate(300, 500, 0)
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
                backgroundSize:'100%'
            }
        });

        this.setButtonEvent(button1, 0);
        this.add(button1Mod).add(button1);
        this.setButtonEvent(button2, 1);
        this.add(button2Mod).add(button2);
        this.setButtonEvent(button3, 2);
        this.add(button3Mod).add(button3);
        this.setButtonEvent(button4, 3);
        this.add(button4Mod).add(button4);
        this.setButtonEvent(button5, 4);
        this.add(button5Mod).add(button5);
    }

    function _setupEvents(){

    }

    PanelView.prototype.addButton = function(index){
        var ratio = index/this.options.numberOfButtons;
        var button = new Surface({
            content: 'button' + index,
            size: this.options.buttonSize,
            properties: {
                background: 'hsl('+ratio*360+',100%,85%)'
            }
        });
        var buttonMod = new Modifier({
            origin: [ratio, 0.5],
            align: [ratio, 0.3]
        });
        this.setButtonEvent(button, index);
        this.add(buttonMod).add(button);
    };

    PanelView.prototype.setButtonEvent = function(button, index){
        button.on('click', function(){
            slotGame.save('button' + index, Date.now())
        }.bind(this))
    };

    module.exports = PanelView;


    var button1= new Surface({
        content:'line1',
        size: [100,100]
    })



});