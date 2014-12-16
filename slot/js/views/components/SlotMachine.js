define(function(require, exports, module) {
    var ContainerSurface    = require('famous/surfaces/ContainerSurface');
    var View                = require('famous/core/View');
    var Surface             = require('famous/core/Surface');
    var Transform           = require('famous/core/Transform');
    var Modifier            = require('famous/core/Modifier');
    var StateModifier       = require('famous/modifiers/StateModifier');
    var UIElement           = require('core/UIElement');
    var Engine              = require('famous/core/Engine');
    var soundEffect         = require('js/configs/SoundEffect');
    var SlotColumn          = require('js/views/components/SlotColumn');
    var GameMap             = require('js/configs/GameMap');
    var slotGame            = require('js/models/slotGame');

    var o = 'o';
    var x = 'x';

    var line0 = [[o,x,o],[o,x,o],[o,x,o]];
    var line1 = [[x,o,o],[x,o,o],[x,o,o]];
    var line2 = [[o,o,x],[o,o,x],[o,o,x]];
    var line3 = [[o,o,x],[o,x,o],[x,o,o]];
    var line4 = [[x,o,o],[o,x,o],[o,o,x]];


    function SlotMachine(options) {
        ContainerSurface.apply(this, arguments);
        this.slotMap = [];
        this.options = options;
        this.setProperties({
            overflow: 'hidden'
        });
        _createViews.call(this);
        _setListeners.call(this);
        window.slotMachine = this;
    }

    window.slotMachine = SlotMachine;

    SlotMachine.prototype = Object.create(ContainerSurface.prototype);
    SlotMachine.prototype.constructor = SlotMachine;

    SlotMachine.DEFAULT_OPTIONS = {};

    function _createViews() {
        this.columns = [];
        generate.call(this);
//        soundEffect.backgroundmusic.play();
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
        this.gameMap = new GameMap({

        }); console.log(this.gameMap);     window.gameMap = this.gameMap;
        for (var j = 0; j < this.gameMap.length; j++){
            this.gameMap[j].range = setRange(j); //console.log('gameMap range----- ', this.gameMap[j].range);
        }

    }

    function _setListeners() {
        Engine.on('click', function() {
            this.spin();
        }.bind(this));

    }

    SlotMachine.prototype.spin = _.debounce(function() {
        var winCombo = generateCombo.call(this);
        var slotItems = generateSlotItems.call(this, this.gameMap[winCombo].line, this.gameMap[winCombo].isDiff);
        generate.call(this, this.gameMap[winCombo].line, slotItems, this.gameMap[winCombo].isDiff);
        this.columns.map(function(c, i){
            c.spin(500*i+1000);
        });
//        soundEffect.slot.play();
    },1000, true);

    SlotMachine.prototype.animateLine = function(line, bad) {
        this.columns.map(function(c, i){
            c.rows.map(function(r, i){
                r.animateLine(line,bad);
            });
        });
        if (bad)
            soundEffect.badline.play()
        else
            soundEffect.line.play()
    };

    function generateCombo() {
        var combo = 7;
        var randomNumber = Math.floor(Math.random()*35);
        for (var i = 0; i < this.gameMap.length; i++){
            var inRange = checkRange(this.gameMap[i].range, randomNumber);
            if (inRange) {
                combo = i;
                break;
            }
        } console.log('randomnumber----',randomNumber, 'combo----', combo);
        return combo;
    }

    function setRange(index){
        if (index == 0) {
            var min = 0;
            var max = this.gameMap[0].weight-1;
        } else {
            min = this.gameMap[index-1].range[1]+1;
            max = min+this.gameMap[index].weight-1;
        }
        return [min, max]
    }

    function checkRange(range, number){
        return (number <= range[1] && number >= range[0]);
    }

    function generateSlotItems(lines, isDiff){
        var slotItems = []; console.log('lines:', lines);
        var randomFruit = chooseFruit();
        for (var i = 0; i < lines.length; i++){
            if (isDiff) {
                randomFruit = chooseFruit();
            }
            slotItems.push(randomFruit);
        }
        return slotItems
    }

    function generate(lines, items, isDiff) {
        this.topRow = this.options.rowCount-1; console.log('fruits sh be', items)
        this.midRow = this.options.rowCount-2;
        this.bottomRow = this.options.rowCount-3;

        for (var i=0; i<this.options.dimension[0]; i++) {
            for (var j=0; j<this.options.rowCount; j++) {
                if (!this.slotMap[i])
                    this.slotMap[i]=[];
                if (this.slotMap[i][j+this.options.rowCount-this.options.dimension[1]] !== undefined) {
                    this.slotMap[i][j] = this.slotMap[i][j+this.options.rowCount-this.options.dimension[1]];
                } else if ((j == this.topRow || j == this.midRow || j == this.bottomRow) && lines != undefined) {
                    for (var k = 0; k < lines.length; k++) {
                        switch(lines[k]) {
                            case 0:
                                if(line0[i][this.options.rowCount-j-1]=='x' || items.indexOf(this.slotMap[i][j]) != -1)
                                    this.slotMap[i][j] = items[k];
                                else this.slotMap[i][j] = chooseFruit.call(this);
                                break;
                            case 1:
                                if(line1[i][this.options.rowCount-j-1]=='x' || items.indexOf(this.slotMap[i][j]) != -1)
                                    this.slotMap[i][j] = items[k];
                                else this.slotMap[i][j] = chooseFruit.call(this);
                                break;
                            case 2:
                                if(line2[i][this.options.rowCount-j-1]=='x' || items.indexOf(this.slotMap[i][j]) != -1)
                                    this.slotMap[i][j] = items[k];
                                else this.slotMap[i][j] = chooseFruit.call(this);
                                break;
                            case 3:
                                if(line3[i][this.options.rowCount-j-1]=='x' || items.indexOf(this.slotMap[i][j]) != -1)
                                    this.slotMap[i][j] = items[k];
                                else this.slotMap[i][j] = chooseFruit.call(this);
                                break;
                            case 4:
                                if(line4[i][this.options.rowCount-j-1]=='x' || items.indexOf(this.slotMap[i][j]) != -1)
                                    this.slotMap[i][j] = items[k];
                                else this.slotMap[i][j] = chooseFruit.call(this);
                                break;                                break;
                            default:
                                this.slotMap[i][j] = chooseFruit.call(this);
                                break;
                        }
                    }
                } else
                    this.slotMap[i][j] = chooseFruit.call(this);
            }
        }

        verifySlotMap.call(this, lines, items, isDiff);
    }

    function verifySlotMap(lines, items, isDiff) {
        var slotLines = [];

        if(items) {
            if (verifyLine0.call(this, items[0])) slotLines.push(0);
            if (verifyLine1.call(this, items[0])) slotLines.push(1);
            if (verifyLine2.call(this, items[0])) slotLines.push(2);
            if (verifyLine3.call(this, items[0])) slotLines.push(3);
            if (verifyLine4.call(this, items[0])) slotLines.push(4);
        }

        if(lines) var same = arraysIdentical(lines, slotLines);

//        if(!same && lines){ generate.call(this, lines, items, isDiff); console.log('had to regenerate map')}

        console.log('verified slotlines', slotLines, same);

    }

    function verifyLine0(item) {
        return (this.slotMap[0][this.midRow] == item && this.slotMap[1][this.midRow] == item && this.slotMap[2][this.midRow] == item)
    }

    function verifyLine1(item) {
        return (this.slotMap[0][this.topRow] == item && this.slotMap[1][this.topRow] == item && this.slotMap[2][this.topRow] == item)
    }

    function verifyLine2(item) {
        return (this.slotMap[0][this.bottomRow] == item && this.slotMap[1][this.bottomRow] == item && this.slotMap[2][this.bottomRow] == item)
    }

    function verifyLine3(item) {
        return (this.slotMap[0][this.bottomRow] == item && this.slotMap[1][this.midRow] == item && this.slotMap[2][this.topRow] == item)
    }

    function verifyLine4(item) {
        return (this.slotMap[0][this.topRow] == item && this.slotMap[1][this.midRow] == item && this.slotMap[2][this.bottomRow] == item)
    }

    function arraysIdentical(lines, slotLines) {
            if (lines.length !== slotLines.length) return false;
            for (var i = 0; i < lines.length; i++){
                if (lines[i] !== slotLines[i]){
                    return false;
                }
            }
            return true;
    }

    function chooseFruit() {
        return Math.floor(Math.random()*12);
    }



    module.exports = SlotMachine;
});