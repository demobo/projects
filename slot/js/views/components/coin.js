define(function(require, exports, module) {

    var Surface = require("famous/core/Surface");
    var RenderNode = require("famous/core/RenderNode");
    var Modifier = require("famous/core/Modifier");
    var Transform = require("famous/core/Transform");
    var RenderController = require('famous/views/RenderController');
    var Circle = require('famous/physics/bodies/Circle');
    var Vector = require('famous/math/Vector');

    function Coin(context, physicsEngine, walls, options){

        //TODO Bon
        window.coin=this;

        this.context = context;
        this.renderController = new RenderController();
        this.renderNode = new RenderNode();
        this.renderController.show(this.renderNode);
        this.physicsEngine = physicsEngine;
        this.walls = walls;
        this.model = options.model;
        this.size = options.size;

        this.coinVector = new Vector([1,0,0]);

        _initParticle.call(this);
        _syncEvent.call(this);

    }

    function _initParticle (){
        this.coin = new Surface({
            size: this.size,
            properties:{
                borderRadius: this.size[0]+'px',
                background: 'yellow'
            }
        });
        this.renderNode.add(this.coin);
        this.coinMod = new Modifier({
//            transform:Transform.translate(-this.size[0]/2,-this.size[0]/2,0)
        });

        this.particle = new Circle({
            mass : 1,
            radius : this.size[0]/2,
            position : new Vector(Math.random() * window.innerWidth, Math.random() * window.innerHeight,0),
            velocity : this.coinVector,
            model: this.model
        });
        this.physicsEngine.addBody(this.particle);
        this.context.add(this.particle).add(this.coinMod).add(this.renderController);
    }

    function _syncEvent(){

    }

    module.exports = Coin;

});