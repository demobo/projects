define(function(require, exports, module) {
    var Engine              = require('famous/core/Engine');
    var StateModifier = require('famous/modifiers/StateModifier');
    var mainContext = Engine.createContext();

    var SlotMachine = require('components/SlotMachine');
    var CreditBox = require('components/CreditBox');
    var slotGame = require('js/models/slotGame');

    var slotMachine = new SlotMachine({
        size: [window.innerWidth*.8,window.innerHeight*.8],
        dimension: [5, 3],
        rowCount: 40
    });
    var slotMod = new StateModifier({
        align: [.5,.5],
        origin: [.5,.5]
    });
    var creditBox = new CreditBox({

    });
    var creditBoxMod = new StateModifier({
        size: [100,60],
        align: [1,1],
        origin: [1,1]
    });

    mainContext.add(slotMod).add(slotMachine);
    mainContext.add(creditBoxMod).add(creditBox);
    mainContext.setPerspective(1000);

    slotGame.on('change:button0',function(model, value){
        if (value<Date.now()-3000) return;
        slotGame.save('lines',1);
        spin.call(this);
    }.bind(this));

    slotGame.on('change:button1',function(model, value){
        if (value<Date.now()-3000) return;
        slotGame.save('lines',3);
        spin.call(this);
    }.bind(this));

    slotGame.on('change:button2',function(model, value){
        if (value<Date.now()-3000) return;
        slotGame.save('lines',5);
        spin.call(this);
    }.bind(this));

    slotGame.on('change:button3',function(model, value){
        if (value<Date.now()-3000) return;
        spin.call(this);
    }.bind(this));

    function spin() {
        var lines = slotGame.get('lines');
        var credit = slotGame.get('credit')-lines;
        if (credit>=0) {
            slotMachine.spin();
            slotGame.save('credit',credit);
        }
    }
});
