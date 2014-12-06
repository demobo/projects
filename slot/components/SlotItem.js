define(function(require, exports, module) {
    var UIComponent         = require('core/UIComponent');
    var UIElement           = require('core/UIElement');
    var UIContainer         = require('containers/UIContainer');

    var imageArray = [
        '',

    ];

    var SlotItem = UIElement.extend({
        constructor:function(options) {
            this._callSuper(UIElement, 'constructor', options);
            this.options = options;
        },

        hide: function() {
            this.setOpacity(0, {duration: 200, curve: "easeOut"});
        },

        show: function() {
            this.halt();
            this.setOpacity(1, {duration: 200, curve: "easeOut"});
        },

        update: function() {
            var icon = 'icon'+this.options.map[this.options.column][this.options.row];
            this.setContent('<div class="slotIcon ' + icon + '">'+this.options.map[this.options.column][this.options.row]+'</div>');
        }

    });

    module.exports = SlotItem;
});