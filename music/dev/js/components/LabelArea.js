define(function(require, exports, module) {
    var UIElement           = require('core/UIElement');

    var LabelArea = UIElement.extend({
        constructor:function(options) {
            this._callSuper(UIElement, 'constructor', {
                classes: ["label"],
                position: [0, 0, 0],
                size: [400,100],
                style: {
                    fontFamily: 'avenir next',
                    fontWeight: 200,
                    fontSize: "72px",
                    textAlign: "left",
                    margin: "20px",
                    color: "transparent"
                }
            });
        },

        hide: function() {
            this.setOpacity(0, {duration: 200, curve: "easeOut"});
            this.setPosition(0,0,0, {duration : 500, curve : 'easeOut'});
        },

        show: function() {
            this.halt();
            this.setOpacity(1, {duration: 200, curve: "easeOut"});
            this.setPosition(20,0,0, {duration : 200, curve : 'easeOut'});
        },

        update: function(data) {
            this.setStyle({
                color: data.color
            });
            var icons = ["fa-volume-up", "fa-sliders", "fa-tasks"];
            var icon = '<i class="fa ' + icons[data.count-1] + '"></i>';
            var content = icon + "<div>" + data.value + "</div>"
            this.setContent(content);
        }

    });

    module.exports = LabelArea;
});