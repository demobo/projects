define(function(require, exports, module) {
    var loadSoundEffect = _.memoize(function() {
        return {
            slot: new Howl({
                urls: ['assets/audio/slotSound2.mp3'],
                volume: 0.1
            }),
            paysoff: new Howl({
                urls: ['assets/audio/paysOff.wav'],
                volume: 0.1
            })
        };
    });
    module.exports = loadSoundEffect();
});