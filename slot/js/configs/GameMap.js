define(function(require, exports, module){

    function GameMap(){
        var gameMap = {
            length: 19,
            0: {
                weight: 1, line: [0], isDiff: false
            },
            1: {
                weight: 1, line: [1], isDiff: false
            },
            2: {
                weight: 1, line: [2], isDiff: false
            },
            3: {
                weight: 1, line: [3], isDiff: false
            },
            4: {
                weight: 1, line: [4], isDiff: false
            },
            5: {
                weight: 1, line: [0, 1], isDiff: false
            },
            6: {
                weight: 1, line: [0, 2], isDiff: false
            },
            7: {
                weight: 1, line: [1, 2], isDiff: false
            },
            8: {
                weight: 1, line: [0, 3], isDiff: false
            },
            9: {
                weight: 1, line: [0, 4], isDiff: false
            },
            10: {
                weight: 1, line: [1, 3], isDiff: false
            },
            11: {
                weight: 1, line: [1, 4], isDiff: false
            },
            12: {
                weight: 1, line: [2, 3], isDiff: false
            },
            13: {
                weight: 1, line: [2, 4], isDiff: false
            },
            14: {
                weight: 1, line: [3, 4], isDiff: false
            },
            15: {
                weight: 1, line: [0, 1], isDiff: true
            },
            16: {
                weight: 1, line: [0, 2], isDiff: true
            },
            17: {
                weight: 1, line: [1, 2], isDiff: true
            },
            18: {
                weight: 1, line: [], isDiff: false
            }
        }
        return gameMap;
    }

    module.exports = GameMap;

});