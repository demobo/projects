define(function(require, exports, module) {
    var UIComponent         = require('core/UIComponent');
    var UIElement           = require('core/UIElement');

    var Tube = UIComponent.extend({
        constructor:function(options) {
            this._callSuper(UIComponent, 'constructor', options);
            this.options = options;
            this.background = new UIElement({
                style: {
                    background: 'red'
                }
            });
            this._addChild(this.background);
            this.youtubeElement = new UIElement({
                classes: ['youtube'],
                content: '<div id="' + options.id + '"></div>'
            });
            this._addChild(this.youtubeElement);
            setTimeout(function(){
                this.player = new YT.Player(options.id, {
                    height: '100%',
                    width: '100%',
                    playerVars: { 'autoplay': 0, 'controls': 0 },
                    events: {
                        'onReady': this.onPlayerReady.bind(this),
                        'onStateChange': this.onPlayerStateChange.bind(this)
                    }
                });
            }.bind(this),0);
            this.init();
        },

        onPlayerReady: function() {
            this.tubeModel.save('video', '3wxhOurCfXw');
        },

        onPlayerStateChange: function(event) {
            if (demobo.Utils.isMobile()) {
                var curTime = this.player.getCurrentTime();
                this.tubeModel.save('curTime', curTime);
                if (event.data == YT.PlayerState.PLAYING) {
                    this.tubeModel.save('playing', true);
                } else {
                    this.tubeModel.save('playing', false);
                }
            }
        },

        init: function() {
            var TubeModel = Backbone.DemoboStorage.Model.extend({
                demoboID: this.options.id
            });
            this.tubeModel = new TubeModel({
                id: this.options.id
            });
            if (demobo.Utils.isMobile()) {
                this.initMobile.call(this);
            } else {
                this.initWebsite.call(this);
            }
        },

        initMobile: function() {
            this.background.on('touchstart', function() {
                console.log("tap", this.player.getPlayerState());
                if (this.player.getPlayerState() != YT.PlayerState.PLAYING) {
                    this.player.playVideo();
                } else {
                    this.player.pauseVideo();
                }
            }.bind(this));
            this.tubeModel.on('change:video',function(model, value){
                this.player.loadVideoById(value);
            }.bind(this));
            this.turnOffVideo();
        },

        initWebsite: function() {
            this.tubeModel.on('change:video',function(model, value){
                this.player.loadVideoById(value);
            }.bind(this));
            this.tubeModel.on('change:volume',function(model, value){
                this.player.setVolume(value);
            }.bind(this));
            this.tubeModel.on('change:effect',function(model, value){
                this.changeVideoMode(value);
            }.bind(this));
            this.tubeModel.on('change:playPause',function(model, value){
                if (this.player.getPlayerState() == YT.PlayerState.PLAYING) {
                    this.player.pauseVideo();
                    this.tubeModel.save('state', 'pause');
                } else {
                    this.player.playVideo();
                    this.tubeModel.save('state', 'playing');
                }
            }.bind(this));

            this.tubeModel.on('change:playing',function(model, value){
                if (value) this.player.playVideo();
                else this.player.pauseVideo();
            }.bind(this));
            this.tubeModel.on('change:curTime',function(model, value){
                this.player.seekTo(value);
            }.bind(this));
        },

        load: function(id) {
            this.tubeModel.save('video',id);
        },

        hide: function() {
            this.setOpacity(0);
        },

        show: function() {
            this.setOpacity(1);
        },

        turnOffVideo: function() {
            this.youtubeElement.setScale(0);
//            this.youtubeElement.setOpacity(0.1);
        },

        changeVideoMode: function(mode) {
            switch (mode) {
                case 1:
                    $('#tube1').css('-webkit-filter','grayscale(1)');
                    break;
                default:
                    $('#tube1').css('-webkit-filter','');
            }
        }

    });

    module.exports = Tube;
});