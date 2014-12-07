define(function(require, exports, module) {
    var loadSoundEffect;
    loadSoundEffect = _.memoize(function () {
        return {
            slot: new Howl({
                urls: ['assets/audio/slotSound.mp3'],
                volume: 0.2
            }),
            paysoff: new Howl({
                urls: ['assets/audio/paysOff.mp3'],
                volume: 0.1
            }),
            backgroundmusic: new Howl({
                urls: ['assets/audio/backGroundmusicO.mp3'],
                autoplay: true,
                loop: true,
                volume: 0.1
            }),
            stopsound: new Howl({
                urls: ['assets/audio/beep.mp3'],
                volume: 0.1
            }),
            cashout: new Howl({
                urls: ['assets/audio/cashOut.mp3'],
                volume: 0.1
            }),
            insertcoin: new Howl({
                urls: ['assets/audio/insertCoin.mp3'],
                volume: 0.1
            }),
            tap: new Howl({
                urls: ['assets/audio/tap.aiff'],
                volume: 0.2
            }),
            credit: new Howl({
                urls: ['assets/audio/smallPayoutB.mp3'],
                volume: 0.1
            }),
            line: new Howl({
                urls: ['assets/audio/line.mp3'],
                volume: 0.1
            })

        };
    });
    module.exports = loadSoundEffect();
});