define(function(require, exports, module) {
    var Engine              = require('famous/core/Engine');
    var StateModifier       = require('famous/modifiers/StateModifier');
    var Flipper             = require('famous/views/Flipper');
    var Easing              = require('famous/transitions/Easing');

    var UIElement           = require('core/UIElement');
    var CoinsMainView       = require('js/views/pages/coinsMainView');
    var SlotMachine         = require('js/views/components/SlotMachine');
    var CreditBox           = require('js/views/components/CreditBox');
    var slotGame            = require('js/models/slotGame');
    var PushButton          = require('js/views/pages/PushButton');
    var testPanelView       = require('js/views/pages/testPanelView');

    var mainContext = Engine.createContext();

//    demobo_r="1234";
//    demobo_guid = "web";
//    var layers = ["websocket:8010"];
//    demobo.init({
//        isHost: true,
//        appName: "slotMachine",
//        method: "code",
//        layers: layers
//    });

    var coinsMainView = new CoinsMainView();
    mainContext.add(coinsMainView);

    var gameStart = new PushButton({
        origin: [.5,.5],
        align: [.5,.5],
        content: '<img src="assets/imgs/start-button.png"/>',
        size: [600,190],
        shadowSize: [575,173],
        position: [0,-70,0],
        boxShadowAfter: 'inset 0px 0px 100px',
        borderRadius: '150px'
    });

    var slotMachine = new SlotMachine({
        size: [window.innerWidth*.7,window.innerHeight*.7],
        dimension: [5, 3],
        rowCount: 40
    });
    var slotMod = new StateModifier({
        align: [.505,.55],
        origin: [.5,.5]
    });
    var creditBox = new CreditBox({

    });
    var creditBoxMod = new StateModifier({
        size: [200,60],
        align: [1,1],
        origin: [1,1]
    });

    //mainContext.add(slotMod).add(slotMachine);
    //mainContext.add(creditBoxMod).add(creditBox);

    var centerModifier = new StateModifier({
        align: [0.5,0.5],
        origin:[0.5,0.5]
    });

    var flipper = new Flipper();
    //mainContext.add(centerModifier).add(flipper);

    flipper.setBack(slotMachine);
    flipper.setFront(gameStart);

    var toggle = false;
    gameStart.buttonShadow.on('click', function(){
        var angle = toggle ? 0 : Math.PI;
        if (toggle) {
            //slotMachine.setScale(1, 1, 1, {method: 'spring'},function(){
            flipper.setAngle(angle, {curve: Easing.inQuad, duration : 1000});
            //}.bind(this));
        } else {
            flipper.setAngle(angle, {curve: Easing.inQuad, duration : 1000}, function(){
                //slotMachine.setScale(1.5, 1.5, 1, {
                //    method: 'spring'
                //});spring
            }.bind(this));
        }
        toggle = !toggle;
    }.bind(this));

    var testPanelView = new testPanelView({});
    mainContext.add(centerModifier).add(testPanelView);


    var spin = _.debounce(function() {
        var lines = slotGame.get('lines');
        var credit = slotGame.get('credit')-lines;
        if (credit>=0) {
            slotMachine.spin();
            slotGame.save('credit',credit);
        }
    },3000, true);

    slotGame.on('change:button0',function(model, value){
        console.log(model, value)
        if (value<(Date.now()-3000)) return;
        slotGame.save('lines',1);
        spin.call(this);
    }.bind(this));

    slotGame.on('change:button1',function(model, value){
        if (value<(Date.now()-3000)) return;
        slotGame.save('lines',3);
        spin.call(this);
    }.bind(this));

    slotGame.on('change:button2',function(model, value){
        if (value<(Date.now()-3000)) return;
        slotGame.save('lines',5);
        spin.call(this);
    }.bind(this));

    slotGame.on('change:button3',function(model, value){
        if (value<(Date.now()-3000)) return;
        spin.call(this);
    }.bind(this));


    mainContext.setPerspective(1000);
    window.slotGame = slotGame;
});
