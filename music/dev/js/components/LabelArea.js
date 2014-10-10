define(function(require, exports, module) {
    var UIElement           = require('core/UIElement');

    var icons = ["fa-volume-up", "fa-sliders", "fa-tasks"];
    var playlists = ['IU','Imagine Dragons','CNBlue','Lindsey Stirling','Infinite','SNSD','Beast','Eric Nam','House',
        'Classical for Studying','Payphone','The Script','Owl City & Carly Rae Jepson','Jason Chen','Train',
        'Utada','Idina Menzel','Disney','Sixpence None the Richer',"L'arc en Ciel",'Nico Touches the Wall'];
    for (var i = 0; i < playlists.length; i++){
        playlists[i] += ' Radio';
        if (playlists[i].length > 12) {
            playlists[i] = playlists[i].slice(0,12);
            playlists[i] += '...';
        }
    }
    var sources = ['Pandora','YouTube','Last.fm','Grooveshark','Spotify','Jango'];
    var next = ["fa-forward", "fa-backward"];
    var sound = ['Next', 'Prev'];
    var thumb = ["fa-thumbs-o-up", "fa-thumbs-o-down"];
    var feels = ['Love', 'Hate'];

    var mode = 'play';

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

//        touchTap: function() {
//            if (this.dy == 0 && this.dy == 0 && this.count == 1) {
//                this.direction = 'tap';
//            }
//        },

        update: function(data) {
            this.setStyle({
                color: data.color
            });

            var content = '';

//            if (data.action == 'tap') {
//                this.setStyle({
//                    textAlign: "right"
//                });
//                if (mode == 'play') {
//                    content = "Play";
//                    mode = 'pause';
//                } else if (mode == 'pause') {
//                    content = "Pause";
//                    mode = 'play'
//                }

            if (data.action == 'Volume') {
                content = '<i class="fa ' + icons[0] + '"></i>' + "<div>" + data.value + "</div>";
            } else if (data.action == "Playlist") {
                content = '<i class="fa ' + icons[1] + '"></i>' + "<div>" + playlists[data.value] + "</div>";
            } else if (data.action == "Source") {
                content = '<i class="fa ' + icons[2] + '"></i>' + "<div>" + sources[data.value] + "</div>";
            } else if (data.action == "Next") {
                content = '<i class="fa ' + next[data.value] + '"></i>' + "<div>" + sound[data.value] + "</div>";
            } else if (data.action == "Thumb") {
                content = '<i class="fa ' + thumb[data.value] + '"></i>' + "<div>" + feels[data.value] + "</div>";
            }
            this.setContent(content);
        }
    });

    module.exports = LabelArea;
});