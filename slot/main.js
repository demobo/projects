define(function(require, exports, module) {
    var Engine              = require('famous/core/Engine');
    var SlotMachine = require('./components/SlotMachine');
    var StateModifier = require('famous/modifiers/StateModifier');
    var CoinsMainView = require('js/views/pages/coinsMainView');

    var mainContext = Engine.createContext();

    var slotGame = require('js/models/slotGame');

    var coinsMainView = new CoinsMainView();
    mainContext.add(coinsMainView);

    var slotMachine = new SlotMachine({
        size: [window.innerWidth*.8,window.innerHeight*.8],
        dimension: [5, 4],
        rowCount: 40
    });
    var slotMod = new StateModifier({
        align: [.5,.5],
        origin: [.5,.5]
    });

    mainContext.add(slotMod).add(slotMachine);
    mainContext.setPerspective(1000);

    slotGame.on('change:button0',function(model, value){
        console.log(model, value)
    }.bind(this));

    slotGame.on('change:button1',function(model, value){
        console.log(model, value)
    }.bind(this));

    slotGame.on('change:button2',function(model, value){
        console.log(model, value)
    }.bind(this));

    slotGame.on('change:button3',function(model, value){
        slotMachine.spin();
    }.bind(this));
});
