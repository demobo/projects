define(function(require, exports, module){

    function GameMap(){
        var gameMap = {
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
                weight: 1, line: [0, 1, 2], isDiff: false
            },
            19: {
                weight: 1, line: [0, 1, 3], isDiff: false
            },
            20: {
                weight: 1, line: [0, 1, 4], isDiff: false
            },
            21: {
                weight: 1, line: [0, 2, 3], isDiff: false
            },
            22: {
                weight: 1, line: [0, 2, 4], isDiff: false
            },
            23: {
                weight: 1, line: [1, 3, 4], isDiff: false
            },
            24: {
                weight: 1, line: [0, 3, 4], isDiff: false
            },
            25: {
                weight: 1, line: [2, 3, 4], isDiff: false
            },
            26: {
                weight: 1, line: [0, 1, 2], isDiff: true
            },
            27: {
                weight: 1, line: [0, 1, 3, 4], isDiff: false
            },
            28: {
                weight: 1, line: [0, 2, 3, 4], isDiff: false
            },
            29: {
                weight: 1, line: [1, 2, 3, 4], isDiff: false
            },
            30: {
                weight: 1, line: [0, 1, 3, 4, 5], isDiff: false
            },
            31: {
                weight: 30, line: [], isDiff: false
            },
            length: 32
        }
        return gameMap;
    }

    module.exports = GameMap;

});