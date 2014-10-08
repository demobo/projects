define(function(require, exports, module) {
    var UIElement           = require('core/UIElement');

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

            if (data.direction == 'y') {
                var icons = ["fa-volume-up", "fa-sliders", "fa-tasks"];
                var icon = '<i class="fa ' + icons[data.count - 1] + '"></i>';
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

                if (data.count==1) {
                    var content = icon + "<div>" + data.value + "</div>";
                } else if (data.count == 2) {
                    content = icon + "<div>" + playlists[data.value] + "</div>";
                } else {
                    content = icon + "<div>" + sources[data.value] + "</div>";
                }
            } else {
                this.setStyle({
                    textAlign: "right"
                });
                var sound = ['mute','unmute'];
                var feels = ['Hate','Love'];

                if (data.count==1) {
                    content = sound[data.value];
                } else {
                    content = feels[data.value];
                }
            }
            this.setContent(content);
        }
    });

    module.exports = LabelArea;
});