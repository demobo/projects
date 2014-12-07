define(function(require, exports, module) {
    var id = "gameState";
    var SlotGame = Backbone.DemoboStorage.Model.extend({
        demoboID: id,
        defaults: {
            credit: 100
        }
    });

    SlotGame.load = _.memoize(function() {
        this.slotGame = new SlotGame({
            id: id
        });
        return this.slotGame;
    });
    module.exports = SlotGame.load();
});