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
        this.setProperties({
            overflow: 'hidden'
        });
        _createViews.call(this);
        _setListeners.call(this);
    }

    SlotMachine.prototype = Object.create(ContainerSurface.prototype);
    SlotMachine.prototype.constructor = SlotMachine;

    SlotMachine.DEFAULT_OPTIONS = {};

    function _createViews() {
        this.columns = [];
        generate.call(this);
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
        Engine.on('click', this.spin.bind(this));
    }

    SlotMachine.prototype.spin = _.debounce(function() {
        generate.call(this);
        this.columns.map(function(c, i){
            c.spin(500*i+1000);
        });
    },1000, true);

    function generate() {
        var winCode = 5;
        var winning = chooseWinning.call(this, winCode); console.log(winning.fruit, winning.row);
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
                        default:
                            break;
                    }
                } else
                    this.slotMap[i][j] = chooseFruit.call(this);
            }
        }
//        checkMap.call(this, winningRow, winningFruit);
        soundEffect.slot.play();
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

        var fruit1 = chooseFruit.call(this);
        var fruit2 = chooseFruit.call(this);
        var fruit3 = chooseFruit.call(this);

        switch(winCode) {
            case 1:
                return {
                    row: [row1],
                    fruit: [fruit1]
                }
                break;
            case 2:
                return {
                    row: [row1, row2],
                    fruit: [fruit1, fruit2]
                }
                break;
            case 3:
                return {
                row: [row1, row2, row3],
                fruit: [fruit1, fruit2, fruit3]
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

            default:
                return {}
        }
    }

    function chooseRow() {
        return this.options.rowCount-1-Math.floor(Math.random()*this.options.dimension[1]);
    }

    function chooseFruit() {
        return Math.floor(Math.random()*12);
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