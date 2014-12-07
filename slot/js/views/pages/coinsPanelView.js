define(function(require, exports, module) {
    var View = require('famous/core/View');
    var Engine = require('famous/core/Engine');
    var Surface = require('famous/core/Surface');
    var PhysicsEngine = require("famous/physics/PhysicsEngine");
    var Drag = require("famous/physics/forces/Drag");
    var Wall = require("famous/physics/constraints/Wall");
    var Gravity = require("famous/physics/forces/VectorField");
    var Collision = require("famous/physics/constraints/Collision");
    var ContainerSurface = require("famous/surfaces/ContainerSurface");
    var Vector = require('famous/math/Vector');

    var Walls = require('js/views/components/Walls');
    var Coin = require('js/views/components/Coin');

    var slotGame = require('js/models/slotGame');

    function CoinsPanelView(options){

        //TODO Bon
        window.cp = this;

        View.apply(this, arguments);

        this.physicsEngine = new PhysicsEngine();
        _init.call(this);
        _setupCollision.call(this);
        _setupFriction.call(this);
        _setupEvents.call(this);

    }

    CoinsPanelView.prototype = Object.create(View.prototype);
    CoinsPanelView.prototype.constructor = CoinsPanelView;

    CoinsPanelView.DEFAULT_OPTIONS = {
        coinDiameter: 100,
        wallRestitution: 1,
        collisionRestitution: 0
    };

    function _init(){

        this.coins = [];
        this.container = new ContainerSurface({
            size:[undefined,undefined]
        });

        this.add(this.container);
        this.container.add(this.physicsEngine);

    }

    function _setupFriction(){

        this.setWalls();
        this.gravity = new Gravity({
            direction: new Vector(0,1,0),
            strength: 0.001
        });
        this.drag = new Drag({
            forceFunction: Drag.FORCE_FUNCTIONS.QUADRATIC,
            strength: 0.001
        });
        this.friction = new Drag({
            forceFunction: Drag.FORCE_FUNCTIONS.LINEAR,
            strength: 0.01
        });
    }

    function _setupCollision(){
        this.collision = new Collision({
            restitution : this.options.collisionRestitution,
            drift: 1
        });
    }

    function _setupEvents(){

        slotGame.on('change:coins',function(model, value){
            var coinInit = JSON.parse(value);
            this.addCoin(coinInit.position, coinInit.velocity);
        }.bind(this));

    }

    CoinsPanelView.prototype.setWalls = function(){
        this.wallRight = new Wall({
            normal: [-1,0,0],
            distance: window.innerWidth,
            restitution: 0.2,
            drift:0,
            onContact: Wall.ON_CONTACT.REFLECT
        });
        this.wallLeft = new Wall({
            normal: [1,0,0],
            distance: 0,
            restitution: 0.2,
            drift:0,
            onContact: Wall.ON_CONTACT.REFLECT
        });
        this.wallBottom = new Wall({
            normal: [0,-1,0],
            distance: window.innerHeight,
            restitution: 0,
            drift: 1,
            onContact: Wall.ON_CONTACT.REFLECT
        });
        this.walls = [this.wallLeft, this.wallRight, this.wallBottom];
    };

    CoinsPanelView.prototype.applyForces = function(){
        this.physicsEngine.attach(this.walls, _.last(this.coins));
        this.physicsEngine.attach(this.gravity, _.last(this.coins));
//        this.physicsEngine.attach(this.drag, _.last(this.coins));
//        this.physicsEngine.attach(this.friction, _.last(this.coins));
        if (this.coins.length <= 1) return;
        for (var i in _.first(this.coins,this.coins.length-1)){
            this.physicsEngine.attach(this.collision, _.last(this.coins), _.first(this.coins,this.coins.length-1)[i]);
        }
    };

    CoinsPanelView.prototype.addCoin = function(positionX, velocity){
        var coinComponent = new Coin(this, this.physicsEngine, this.walls,{
            size:[this.options.coinDiameter,this.options.coinDiameter],
            position: [positionX, -this.options.coinDiameter/2],
            velocity: velocity
        });
        coinComponent.coin.pipe(this._eventOutput);
        this.coins.push(coinComponent.particle);
        this.applyForces();
    };

    module.exports = CoinsPanelView;

});