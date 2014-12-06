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
        var winCode = 2;
        var winning = chooseWinning.call(this, winCode); console.log(winning.fruit, winning.row);
        for (var i=0; i<this.options.dimension[0]; i++) {
            for (var j=0; j<this.options.rowCount; j++) {
                if (!this.slotMap[i])
                    this.slotMap[i]=[];
                if (this.slotMap[i][j+this.options.rowCount-this.options.dimension[1]] !== undefined) {
                    this.slotMap[i][j] = this.slotMap[i][j+this.options.rowCount-this.options.dimension[1]];
                } else if (winning.row.indexOf(j) != -1) {
                    if (winCode == 1 || winCode == 2) {
                        rowJackpot.call(this, i, j, winning);
                    } else if (winCode == 3) {
                        console.log('win 3 lines')
                    }
                } else
                    this.slotMap[i][j] = chooseFruit.call(this);
            }
        }
//        checkMap.call(this, winningRow, winningFruit);
        soundEffect.slot.play();
    }

    function rowJackpot(i,j, winning) {
        var index = winning.row.indexOf(j);
        this.slotMap[i][j] = winning.fruit[index];
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

        var fruit1 = chooseFruit.call(this);
        var fruit2 = chooseFruit.call(this);

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