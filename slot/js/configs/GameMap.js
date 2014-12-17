define(function(require, exports, module){

    function GameMap(){
        var gameMap = [
            {
                combo: 'oneLine-0', weight: 3, line: [0], isDiff: false
            },
            {
                combo: 'oneLine-1', weight: 3, line: [1], isDiff: false
            },
            {
                combo: 'oneLine-2', weight: 3, line: [2], isDiff: false
            },
            {
                combo: 'oneLine-3', weight: 3, line: [3], isDiff: false
            },
            {
                combo: 'oneLine-4', weight: 3, line: [4], isDiff: false
            },
            {
                combo: 'twoLine-0', weight: 3, line: [0, 1], isDiff: false
            },
            {
                combo: 'twoLine-1', weight: 3, line: [0, 2], isDiff: false
            },
            {
                combo: 'twoLine-2', weight: 3, line: [1, 2], isDiff: false
            },
            {
                combo: 'twoLine-3', weight: 3, line: [0, 3], isDiff: false
            },
            {
                combo: 'twoLine-4', weight: 3, line: [0, 4], isDiff: false
            },
            {
                combo: 'twoLine-5', weight: 3, line: [1, 3], isDiff: false
            },
            {
                combo: 'twoLine-6', weight: 3, line: [1, 4], isDiff: false
            },
            {
                combo: 'twoLine-7', weight: 3, line: [2, 3], isDiff: false
            },
            {
                combo: 'twoLine-8', weight: 3, line: [2, 4], isDiff: false
            },
            {
                combo: 'twoLine-9', weight: 3, line: [3, 4], isDiff: false
            },
            {
                combo: 'twoLine-10', weight: 3, line: [0, 1], isDiff: true
            },
            {
                combo: 'twoLine-11', weight: 3, line: [0, 2], isDiff: true
            },
            {
                combo: 'twoLine-12', weight: 3, line: [1, 2], isDiff: true
            },
            {
                combo: 'threeLine-0', weight: 3, line: [0, 1, 2], isDiff: false
            },
            {
                combo: 'threeLine-1', weight: 3, line: [0, 1, 3], isDiff: false
            },
            {
                combo: 'threeLine-2', weight: 3, line: [0, 1, 4], isDiff: false
            },
            {
                combo: 'threeLine-3', weight: 3, line: [0, 2, 3], isDiff: false
            },
            {
                combo: 'threeLine-4', weight: 3, line: [0, 2, 4], isDiff: false
            },
            {
                combo: 'threeLine-5', weight: 3, line: [1, 3, 4], isDiff: false
            },
            {
                combo: 'threeLine-6', weight: 3, line: [0, 3, 4], isDiff: false
            },
            {
                combo: 'threeLine-7', weight: 3, line: [2, 3, 4], isDiff: false
            },
            {
                combo: 'threeLine-8', weight: 3, line: [0, 1, 2], isDiff: true
            },
            {
                combo: 'fourLine-0', weight: 3, line: [0, 1, 3, 4], isDiff: false
            },
            {
                combo: 'fourLine-1', weight: 3, line: [0, 2, 3, 4], isDiff: false
            },
            {
                combo: 'fourLine-2', weight: 3, line: [1, 2, 3, 4], isDiff: false
            },
            {
                combo: 'fiveLine-jackpot', weight: 3, line: [0, 1, 3, 4, 5], isDiff: false
            },
            {
                combo: 'default-no win', weight: 30, line: [], isDiff: false
            }
        ]
        return gameMap;
    }

    module.exports = GameMap;

});