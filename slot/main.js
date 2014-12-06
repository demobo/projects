define(function(require, exports, module) {
    var Engine              = require('famous/core/Engine');
    var SlotMachine = require('./components/SlotMachine');
    var StateModifier = require('famous/modifiers/StateModifier');

    var mainContext = Engine.createContext();

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
});
