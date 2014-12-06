define(function(require, exports, module) {
    var loadSoundEffect = _.memoize(function() {
        return {
            slot: new Howl({
                urls: ['assets/audio/slotSound.wav'],
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