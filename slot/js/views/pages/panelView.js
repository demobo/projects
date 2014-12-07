define(function(require, exports, module) {
    var View = require('famous/core/View');
    var Engine = require('famous/core/Engine');
    var Surface = require('famous/core/Surface');
    var Modifier = require('famous/core/Modifier');

    var slotGame = require('js/models/slotGame');

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
        numberOfButtons: 4,
        buttonSize: [100, 100]
    };

    function _init(){
        for (var i = 0; i < 4; i++){
            this.addButton(i);
        }
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
            origin: [ratio, 0.8],
            align: [ratio, 0.8]
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

});