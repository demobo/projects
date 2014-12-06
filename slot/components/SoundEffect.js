define(function(require, exports, module) {
    var loadSoundEffect = _.memoize(function() {
        return {
            beep: new Howl({
                urls: ['assets/audio/buttonClick.mp3'],
                volume: 0.1
            })
        };
    });
    module.exports = loadSoundEffect();
});