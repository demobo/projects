define(function(require, exports, module) {
    var Engine              = require('famous/core/Engine');
    var PanelView = require('js/views/pages/panelView');
    var CoinsPanelView = require('js/views/pages/coinsPanelView');
    var mainContext = Engine.createContext();

    mainContext.setPerspective(1000);

    var coinsPanelView = new CoinsPanelView();
    var panelView = new PanelView();
    mainContext.add(panelView);
    mainContext.add(coinsPanelView)


});
