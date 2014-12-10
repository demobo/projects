define(function(require, exports, module) {
    var Engine              = require('famous/core/Engine');
    var TestPanelView       = require('js/views/pages/testPanelView');

//    demobo_r="1234";
//    demobo_guid = "mobile";
//    demobo.init({
//        isHost: false,
//        appName: "slotMachine",
//        alwaysOn: true,
//        layers: ["websocket:8010", "firebase"]
//    });

    var mainContext = Engine.createContext();
    mainContext.setPerspective(1000);

    var testPanelView = new TestPanelView();

    mainContext.add(testPanelView);

});
