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
            this.tubeModel = options.model;
            this.init();
        },

        init: function() {
            this.content = ""
        },

        hide: function() {
            this.setOpacity(0, {duration: 200, curve: "easeOut"});
            this.setPosition(0,0,0, {duration : 500, curve : 'easeOut'});
            this.init();
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

            this.tubeModel.on('change:volume', function(model, value){
               this.content = '<i class="fa ' + icons[0] + '"></i>' + "<div>" + value + "</div>";
            }.bind(this));
            this.tubeModel.on('change:channel', function(model, value){
                this.content = '<i class="fa ' + icons[1] + '"></i>' + "<div>" + value + "</div>";
            }.bind(this));
            this.tubeModel.on('change:effectName', function(model, value){
                this.content = '<i class="fa ' + icons[2] + '"></i>' + "<div>" + value + "</div>";
            }.bind(this));

            this.setContent(this.content); //console.log(this.content)
        }
    });

    module.exports = LabelArea;
});