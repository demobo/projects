define(function(require, exports, module) {
    var Engine              = require('famous/core/Engine');
    var PanelView = require('js/views/pages/panelView');
    var CoinsPanelView = require('js/views/pages/coinsPanelView');
    var Money = require('js/views/components/money');
    var mainContext = Engine.createContext();

    mainContext.setPerspective(1000);

    var coinsPanelView = new CoinsPanelView();
    var panelView = new PanelView();

    mainContext.add(panelView);
    mainContext.add(coinsPanelView);

    Engine.on('keypress', function(e){
        if (e.keyCode == 61){
            var money = new Money();
            mainContext.add(money);
        }
    }.bind(this))

});
