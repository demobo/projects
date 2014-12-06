define(function(require, exports, module) {
    var id = "slotGame";
    var SlotGame = Backbone.DemoboStorage.Model.extend({
        demoboID: id,
        defaults: {
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