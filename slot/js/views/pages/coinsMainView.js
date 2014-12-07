define(function(require, exports, module) {
    var View = require('famous/core/View');
    var Engine = require('famous/core/Engine');
    var Surface = require('famous/core/Surface');
    var PhysicsEngine = require("famous/physics/PhysicsEngine");
    var Drag = require("famous/physics/forces/Drag");     //spring effect
    var Wall = require("famous/physics/constraints/Wall");
    var Gravity = require("famous/physics/forces/VectorField");
    var ContainerSurface = require("famous/surfaces/ContainerSurface");
    var Vector = require('famous/math/Vector');
    var Timer = require('famous/utilities/Timer');
    var soundEffect = require('components/SoundEffect');

    var Coin = require('js/views/components/Coin');

    var slotGame = require('js/models/slotGame');

    function CoinsMainView(options){

        //TODO Bon
        window.cm = this;

        View.apply(this, arguments);

        this.physicsEngine = new PhysicsEngine();
        _init.call(this);
        _setupFriction.call(this);
        _setupEvents.call(this);

    }

    CoinsMainView.prototype = Object.create(View.prototype);
    CoinsMainView.prototype.constructor = CoinsMainView;

    CoinsMainView.DEFAULT_OPTIONS = {
        numberOfCoins: 15,
        coinDiameter: 100,
        wallRestitution: 1
    };

    function _init(){

        this.coins = [];
        this.coinsViews = [];
        this.coinsNumber = 0;
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
        })
    }

    function _setupEvents(){

        slotGame.on('change:jackpot', function(){
            console.log('jackpot!');
            _.delay(function() {
                this.generateCoins();
            }.bind(this), 2000);
        }.bind(this));

        Engine.on('keypress',function(e){
            if (e.keyCode == 32){
                this.generateCoins();
                soundEffect.paysoff.play();
            }
        }.bind(this));

    }

    CoinsMainView.prototype.generateCoins = function(){
        if (this.coinsNumber < this.options.numberOfCoins){
            this.addCoin();
            setTimeout(this.generateCoins.bind(this), 200);
            this.coinsNumber++;
        } else {
            Timer.setTimeout(function(){
                this.coinsNumber = 0;
            }.bind(this), 1000)
        }
    };

    CoinsMainView.prototype.removeCoins = function(){
        if (this.coinsViews.length>0){
            this.coinsViews[0].hideCoin();
            this.coins.shift();
            this.coinsViews.shift();
            this.removeCoins();
        }
    };

    CoinsMainView.prototype.setWalls = function(){
        this.wallRight = new Wall({
            normal: [-1,0,0],
            distance: window.innerWidth,
            restitution: 1,
            drift:0,
            onContact: Wall.ON_CONTACT.REFLECT
        });
        this.wallLeft = new Wall({
            normal: [1,0,0],
            distance: 0,
            restitution: 1,
            drift:0,
            onContact: Wall.ON_CONTACT.REFLECT
        });
        this.wallBottom = new Wall({
            normal: [0,-1,0],
            distance: window.innerHeight,
            restitution: 0,
            drift:0,
            onContact: Wall.ON_CONTACT.SILENT
        });
        this.walls = [this.wallLeft, this.wallRight];
    };

    CoinsMainView.prototype.applyForces = function(){
        this.physicsEngine.attach(this.walls, _.last(this.coins));
        this.physicsEngine.attach(this.gravity, _.last(this.coins));
    };

    CoinsMainView.prototype.addCoin = function(coinModel){

        var angle = (Math.random()/2 + 0.25) * Math.PI; //(45 to 135 degree)
        var coinComponent = new Coin(this, this.physicsEngine, this.walls,{
            size:[this.options.coinDiameter,this.options.coinDiameter],
            model: coinModel,
            position: [0.5 * window.innerWidth, 0.95*window.innerHeight],
            velocity: new Vector(Math.cos(angle), Math.sin(angle)*(-1), Math.random()*0.2)
        });
        this.coins.push(coinComponent.particle);
        this.coinsViews.push(coinComponent);
        this.applyForces();

        var wallBottomID = this.physicsEngine.attach(this.wallBottom, _.last(this.coins));

        var onCollision = _.once(function(data){
            Timer.setTimeout(function(){
                this.physicsEngine.detach(wallBottomID);
                var msg = {
                    'position': data.particle.position.x,
                    'velocity': [data.particle.velocity.x, data.particle.velocity.y]
                };
                slotGame.save('coins', JSON.stringify(msg));
                coinComponent.hideCoin();
                this.physicsEngine.removeBody(coinComponent.particle);
            }.bind(this), 1000);
        }.bind(this));

        this.wallBottom.on('preCollision', function(data){
            if (data.particle == coinComponent.particle){
                onCollision(data);
            }
        }.bind(this))

    };



    module.exports = CoinsMainView;

});