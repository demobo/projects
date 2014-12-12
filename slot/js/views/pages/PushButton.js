define(function(require, exports, module) {
    var View = require('famous/core/View');
    var UIElement = require('core/UIElement');
    var soundEffect = require('js/configs/SoundEffect');

    function PushButton(options){

        View.apply(this, arguments);
        _init.call(this);
        _setListener.call(this);

    }

    PushButton.prototype = Object.create(View.prototype);
    PushButton.prototype.constructor = PushButton;

    PushButton.DEFAULT_OPTIONS = {
        classes: [],
        origin: [0.5,0.5],
        align: [0.5,0.5],
        content: "",
        size: [100,100],
        position: [0,0,0],
        shadowSize: [100,100],
        borderRadius: '50px',
        boxShadowBefore: '0px 0px 0px',
        boxShadowAfter: '0px 0px 0px',
        color: 'transparent'
    };

    function _init() {

        this.button= new UIElement({
            classes: this.options.classes,
            origin: this.options.origin,
            align: this.options.align,
            content: this.options.content,
            size: this.options.size,
            position: this.options.position,
            style: {
                backgroundColor: 'transparent'
            }
        });
        this.add(this.button);

        this.buttonShadow = new UIElement({
            origin: this.options.origin,
            align: this.options.align,
            size: this.options.shadowSize,
            position: this.options.position,
            //opacity: 0.8,
            style: {
                borderRadius: this.options.borderRadius,
                backgroundColor: this.options.backgroundColor
                //boxShadow: this.options.boxShadowBefore
            }
        });
        this.add(this.buttonShadow);
    }

    function _setListener() {
        this.changeShadow = _.debounce(function(){
            this.buttonShadow.setStyle({boxShadow: this.options.boxShadowAfter});
            setTimeout(function(){
                this.buttonShadow.setStyle({boxShadow: this.options.boxShadowBefore});
            }.bind(this), 500)
        }.bind(this), 150, true);

        this.buttonShadow.on('click', function(){
            soundEffect.tap.play();
            this.changeShadow();
        }.bind(this));
    }
    module.exports = PushButton;

});
