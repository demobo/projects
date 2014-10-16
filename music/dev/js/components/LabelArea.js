define(function(require, exports, module) {
    var UIElement           = require('core/UIElement');

    var icons = ["fa-volume-up", "fa-sliders", "fa-tasks"];
    var video = ['ESPN', 'BBC', 'MTV', 'CollegeHumor', 'Comedy'];
    var effects = ['Grayscale', 'Sepia', 'Blur', 'Tint', 'Invert'];

    var next = ["fa-forward",'', "fa-backward"];
    var sound = ['Next','', 'Prev'];
    var thumb = ["fa-thumbs-o-up",'', "fa-thumbs-o-down"];
    var feels = ['Love','', 'Hate'];
    var play = ["fa-play", "fa-pause"];
    var Play = ['Play', 'Pause'];
    var mode = "play";

    var LabelArea = UIElement.extend({
        constructor:function(options) {
            this._callSuper(UIElement, 'constructor', {
                classes: ["label"],
                position: [0, 0, 0],
                size: [700,100],
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

            var content = '';

            if (data.action == 'Volume') {
                content = '<i class="fa ' + icons[0] + '"></i>' + "<div>" + data.value + "</div>";
            } else if (data.action == "Video") {
                content = '<i class="fa ' + icons[1] + '"></i>' + "<div>" + video[data.value] + "</div>";
            } else if (data.action == "Effect") {
                content = '<i class="fa ' + icons[2] + '"></i>' + "<div>" + effects[data.value] + "</div>";
            } else if (data.action == "Next") {
                content = '<i class="fa ' + next[data.value+1] + '"></i>' + "<div>" + sound[data.value+1] + "</div>";
            } else if (data.action == "Thumb") {
                content = '<i class="fa ' + thumb[data.value+1] + '"></i>' + "<div>" + feels[data.value+1] + "</div>";
            } else if (data.action == "Play") {
                if (mode == 'play') {
                    content = '<i class="fa ' + play[0] + '"></i>' + "<div>" + Play[0] + "</div>";
                    mode = 'pause';
                } else if (mode == 'pause') {
                    content = '<i class="fa ' + play[1] + '"></i>' + "<div>" + Play[1] + "</div>";
                    mode = 'play'
                }
            }
            this.setContent(content);
        }
    });

    module.exports = LabelArea;
});