define(function(require, exports, module) {
    var View = require('famous/core/View');
    var Engine = require('famous/core/Engine');
    var Surface = require('famous/core/Surface');
    var Modifier = require('famous/core/Modifier');
    var soundEffect = require('js/configs/SoundEffect');
    var slotGame = require('js/models/slotGame');

    var Transform = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');

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

        this.surface = new Surface({
           //define size, align in center
        });

    }

    function _setListeners(){
        this.buttonShadow.on('click', function(){
            //make shadow change
        });

        this.surface.on('click', function(){
            //make surface turn around`
        });
    }

    module.exports = TestPanelView;

});