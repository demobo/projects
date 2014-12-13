define(function(require, exports, module) {
    var View      = require('famous/core/View');
    var Surface    = require('famous/core/Surface');
    var Modifier  = require('famous/core/Modifier');
    var Transform  = require('famous/core/Transform');
    var GenericSync = require("famous/inputs/GenericSync");
    var MouseSync = require("famous/inputs/MouseSync");
    var TouchSync = require("famous/inputs/TouchSync");
    var Transitionable = require("famous/transitions/Transitionable");
    var ContainerSurface = require('famous/surfaces/ContainerSurface');
    var Easing          = require('famous/transitions/Easing');
    var RenderController = require('famous/views/RenderController');
    var RenderNode = require("famous/core/RenderNode");
    var soundEffect = require('js/configs/SoundEffect');

    GenericSync.register({
        mouse : MouseSync,
        touch : TouchSync
    });

    var slotGame = require('js/models/slotGame');

    var height = 600*0.7;
    var width = height/614*261;

    function Money(options) {

        // TODO: Bon
        window.money = this;

        View.apply(this, arguments);
        _init.call(this);
        _syncEvent.call(this);

    }

    Money.prototype = Object.create(View.prototype);
    Money.prototype.constructor = Money;

    function _init(){

        this.renderController = new RenderController();
        this.add(this.renderController);
        this.renderNode = new RenderNode();

        this.money = new Surface({
            classes:(['money']),
            size:[width, height],
            properties:{

            }
        });

        this.pos = new Transitionable([(window.innerWidth-width)*0.5,(window.innerHeight-height)*0.5]);
        this.insert = new Transitionable(0);

        this.moneyMod = new Modifier({
            transform: function(){
                return Transform.translate(this.pos.get()[0], this.pos.get()[1]+this.insert.get(), 10)
            }.bind(this)
        });

        this.renderNode.add(this.moneyMod).add(this.money);

        // TODO:Bon: set image
        this.show()
    }

    function _syncEvent(){

        this.sync = new GenericSync(['mouse', 'touch']);

        this.money.pipe(this.sync);

        this.sync.on('start', function() {
            this.offset=this.pos.get();
        }.bind(this));

        this.sync.on('update', function(data) {
            this.pos.set([this.offset[0]+data.position[0],this.offset[1]+data.position[1]]);
        }.bind(this));

        this.sync.on('end', function(data) {
            if (this.pos.get()[1]< -1/4*height && this.pos.get()[0]>window.innerWidth-280){
                this.hide()
            }
        }.bind(this));

    }

    Money.prototype.show = function(){
        //this.setMoneyImage(image);
        this.renderController.show(this.renderNode);
    };

    Money.prototype.hide = function(){
        soundEffect.bill.play()
        this.insert.set(-this.money.getSize()[1], {duration: 500, curve: Easing.easeOut}, function(){
            this.renderController.hide();
            this.increaseCredit(100);
        }.bind(this));
    };

    Money.prototype.increaseCredit = function(val){
        slotGame.save('credit', slotGame.get('credit')+val)
    };

    Money.prototype.setMoneyImage = function(image){
        this.money.setContent('<div><img height="'+height+'" width="'+width+'" src=' + image + ' /></div>')
    };

    window.soundEffect = soundEffect;
    module.exports = Money;

});