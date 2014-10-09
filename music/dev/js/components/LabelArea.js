define(function(require, exports, module) {
    var UIElement           = require('core/UIElement');

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

        touchStart: function(data, count) {
            if (count == 0) {
                this.initPos = [data.x, data.y];
            }
            this.count = count;
        },

        touchCount: function(data) {
            if (this.count == 10) {
                this.dx = Math.abs(data.x - this.initPos[0]);
                this.dy = Math.abs(data.y - this.initPos[1]);
                if (this.dx >= this.dy) {
                    this.direction = 'x';
                } else {
                    this.direction = 'y';
                }
            }
        },

        touchEnd: function() {
            this.direction = 'reset';
        },

        update: function(data) {
            this.setStyle({
                color: data.color
            });
            var content = '';

            if (data.tap) {
                this.setStyle({
                    textAlign: "right"
                });
                if (mode == 'play') {
                    content = "Play";
                    mode = 'pause';
                } else if (mode == 'pause') {
                    content = "Pause";
                    mode = 'play'
                }
            } else {
                if (this.direction == 'y') {
                    this.setStyle({
                        textAlign: "left"
                    });
                    var icons = ["fa-volume-up", "fa-sliders", "fa-tasks"];
                    var icon = '<i class="fa ' + icons[data.count - 1] + '"></i>';

                    if (data.count == 1) {
                        content = icon + "<div>" + data.value[1] + "</div>";
                    } else if (data.count == 2) {
                        content = icon + "<div>" + playlists[data.value[1]] + "</div>";
                    } else {
                        content = icon + "<div>" + sources[data.value[1]] + "</div>";
                    }
                } else if (this.direction == 'x')/*if (!data.play)*/ {
                    this.setStyle({
                        textAlign: "right"
                    });
                    var sound = ['Next', '', 'Prev'];
                    var feels = ['Love', '', 'Hate'];

                    if (data.count == 1) {
                        content = sound[data.value[0] + 1];
                    } else if (data.count == 2) {
                        content = feels[data.value[0] + 1];
                    } else {
                        content = ''
                    }
                }
            }
            this.setContent(content);
        }
    });

    module.exports = LabelArea;
});