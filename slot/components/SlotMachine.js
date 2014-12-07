define(function(require, exports, module) {
    var ContainerSurface    = require('famous/surfaces/ContainerSurface');
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var Modifier = require('famous/core/Modifier');
    var StateModifier = require('famous/modifiers/StateModifier');
    var UIElement           = require('core/UIElement');
    var Engine              = require('famous/core/Engine');
    var SlotColumn          = require('components/SlotColumn');
    var soundEffect         = require('components/SoundEffect');

    function SlotMachine(options) {
        ContainerSurface.apply(this, arguments);
        this.slotMap = [];
        this.options = options;
        this.winningRows = [];
        this.setProperties({
            overflow: 'hidden'
        });
        _createViews.call(this);
        _setListeners.call(this);
        window.slotMachine = this;
    }

    SlotMachine.prototype = Object.create(ContainerSurface.prototype);
    SlotMachine.prototype.constructor = SlotMachine;

    SlotMachine.DEFAULT_OPTIONS = {};

    function _createViews() {
        this.columns = [];
        generate.call(this);
        soundEffect.backgroundmusic.play();
        for (var i = 0; i<this.options.dimension[0]; i++) {
            var c = new SlotColumn({
                rowCount: this.options.rowCount,
                column: i,
                dimension: this.options.dimension,
                map: this.slotMap
            });
            this.columns.push(c);
            this.add(c);
        }
    }

    function _setListeners() {
        Engine.on('click', function() {
            this.spin();
            soundEffect.slot.play();
        }.bind(this));

    }

    SlotMachine.prototype.spin = _.debounce(function() {
        var winLines = winPercent.call(this);
        generate.call(this, winLines);
        this.columns.map(function(c, i){
            c.spin(500*i+1000);
        });
    },1000, true);

    SlotMachine.prototype.animateLine = function(line) {
        this.columns.map(function(c, i){
            c.rows.map(function(r, i){
                r.animateLine(line);
            });
        });
    };

    function winPercent() {
        var winNum = Math.floor(Math.random()*100);
        if (winNum%5 == 0) return 1;
        else if (winNum%7 == 0) return 2;
        else if (winNum%9 == 0) return 3;
        else if (winNum%16 == 0) return 4;
        else if (winNum%22 == 0) return 5;
    }

    function generate(winLines) {
        var winCode = winLines;
        var winning = chooseWinning.call(this, winCode); console.log(winning.fruit, winning.row, winning.line);
        for (var i=0; i<this.options.dimension[0]; i++) {
            for (var j=0; j<this.options.rowCount; j++) {
                if (!this.slotMap[i])
                    this.slotMap[i]=[];
                if (this.slotMap[i][j+this.options.rowCount-this.options.dimension[1]] !== undefined) {
                    this.slotMap[i][j] = this.slotMap[i][j+this.options.rowCount-this.options.dimension[1]];
                } else if (winning.row.indexOf(j) != -1) {
                    switch(winCode) {
                        case 1:
                        case 2:
                        case 3:
                            rowJackpot.call(this, i, j, winning);
                            break;
                        case 4:
                        case 5:
                            jaggedJackpot.call(this, i, j, winning);
                            break;
                        case 6:
                        case 7:
                            comboJackpot.call(this, i, j, winning);
                            break;
                        default:
                            break;
                    }
                } else
                    this.slotMap[i][j] = chooseFruit.call(this);
            }
        }
//        checkMap.call(this, winningRow, winningFruit);
    }

    function rowJackpot(i, j, winning) {
            var index = winning.row.indexOf(j);
            this.slotMap[i][j] = winning.fruit[index];
    }

    function jaggedJackpot(i, j, winning) {
        if (i == 0 && j == winning.row[0]) {
            this.slotMap[i][j] = winning.fruit;
        } else if (i == this.options.dimension[0]-1 && j == winning.row[2]) {
            this.slotMap[i][j] = winning.fruit;
        } else if (i > 0 && i < this.options.dimension[0]-1 && j == winning.row[1]) {
            this.slotMap[i][j] = winning.fruit;
        } else {
            this.slotMap[i][j] = chooseFruit.call(this);
        }
    }

    function comboJackpot(i, j, winning) {
        jaggedJackpot.call(this, i, j, winning);
        if (j == winning.row[3]) {
            this.slotMap[i][j] = winning.fruit;
        }
    }

    function chooseWinning(winCode){
        var row1 = chooseRow.call(this);
        var row2 = chooseRow.call(this);
        while (row1 == row2) {
            row2 = chooseRow.call(this);
        }
        var row3 = chooseRow.call(this);
        while (row3 == row1 || row3 == row2) {
            row3 = chooseRow.call(this);
        }

        var jaggedUp = chooseRow.call(this);
        while (jaggedUp+2 >= this.options.rowCount) {
            jaggedUp = chooseRow.call(this);
        }

        var jaggedDown = chooseRow.call(this);
        while (jaggedDown-2 < this.options.rowCount-this.options.dimension[1]) {
            jaggedDown = chooseRow.call(this);
        }

        var line1 = findWinLine.call(this, row1);
        var line2 = findWinLine.call(this, row2);
        var line3 = findWinLine.call(this, row3);


        var fruit1 = chooseFruit.call(this);
        var fruit2 = chooseFruit.call(this);
        var fruit3 = chooseFruit.call(this);

        switch(winCode) {
            case 1:
                return {
                    row: [row1],
                    fruit: [fruit1],
                    line: [line1]
                }
                break;
            case 2:
                return {
                    row: [row1, row2],
                    fruit: [fruit1, fruit2],
                    line: [line1, line2]
                }
                break;
            case 3:
                return {
                row: [row1, row2, row3],
                fruit: [fruit1, fruit2, fruit3],
                line: [line1, line2, line3]
                }
                break;
            case 4:
                return {
                    row: [jaggedUp, jaggedUp+1, jaggedUp+2],
                    fruit: [fruit1]
                }
                break;
            case 5:
                return {
                    row: [jaggedDown, jaggedDown-1, jaggedDown-2],
                    fruit: [fruit1]
                }
                break;
            case 6:
                return {
                    row: [jaggedUp, jaggedUp+1, jaggedUp+2, row1],
                    fruit: [fruit1]
                }
                break;
            case 7:
                return {
                    row: [jaggedDown, jaggedDown-1, jaggedDown-2, row1],
                    fruit: [fruit1]
                }
                break;
            default:
                return {
                    row: [], fruit: []
                }
        }
    }

    function chooseRow() {
        return this.options.rowCount-1-Math.floor(Math.random()*this.options.dimension[1]);
    }

    function chooseFruit() {
        return Math.floor(Math.random()*12);
    }

    function findWinLine(row) {
        var lineMap = [this.options.rowCount-2, this.options.rowCount-1, this.options.rowCount-3];
        var line = lineMap.indexOf(row);
        return line
    }

    function checkMap(row, fruit) {
        for (var j = (this.options.rowCount-this.options.dimension[1]); j<this.options.rowCount; j++) {
            if (j != row) {
                if (this.slotMap[this.options.dimension[0]-1][j] == this.slotMap[this.options.dimension[0]-2][j]) {
                    do {
                        var newFruit = Math.floor(Math.random()*12)
                    } while (newFruit == this.slotMap[this.options.dimension[0]-2][j])
                    this.slotMap[this.options.dimension[0]-1][j] = newFruit;
                }
            }
        }
    }

    module.exports = SlotMachine;
});