define(function(require, exports, module){

    function GameMap(){
        var gameMap = {
            length: 8,
            0: {
                weight: 5,
                line: [0],
                isDiff: false
            },
            1: {
                weight: 5,
                line: [1],
                isDiff: false
            },
            2: {
                weight: 5,
                line: [2],
                isDiff: false
            },
            3: {
                weight: 5,
                line: [3],
                isDiff: false
            },
            4: {
                weight: 5,
                line: [4],
                isDiff: false
            },
            5: {
                weight: 5,
                line: [0, 1],
                isDiff: false
            },
            6: {
                weight: 5,
                line: [0, 2],
                isDiff: false
            },
            7: {
                weight: 5,
                line: [1, 2],
                isDiff: false
            }
        }
        return gameMap;
    }

    module.exports = GameMap;

});