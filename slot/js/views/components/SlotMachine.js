define(function(require, exports, module) {
    var ContainerSurface    = require('famous/surfaces/ContainerSurface');
    var View                = require('famous/core/View');
    var Surface             = require('famous/core/Surface');
    var Transform           = require('famous/core/Transform');
    var Modifier            = require('famous/core/Modifier');
    var StateModifier       = require('famous/modifiers/StateModifier');
    var Lightbox            = require('famous/views/Lightbox');
    var UIElement           = require('core/UIElement');
    var Engine              = require('famous/core/Engine');
    var soundEffect         = require('js/configs/SoundEffect');
    var SlotColumn          = require('js/views/components/SlotColumn');
    var GameMap             = require('js/configs/GameMap');
    var SlotItemMap         = require('js/configs/SlotItemMap');
    var slotGame            = require('js/models/slotGame');
    var MessageView         = require('js/views/ui/MessageView');

    var o = 'o'; var x = 'x';
    var line0 = [[o,x,o],[o,x,o],[o,x,o]];
    var line1 = [[x,o,o],[x,o,o],[x,o,o]];
    var line2 = [[o,o,x],[o,o,x],[o,o,x]];
    var line3 = [[o,o,x],[o,x,o],[x,o,o]];
    var line4 = [[x,o,o],[o,x,o],[o,o,x]];

    var winChart = [0, 1, 5, 15, 25, 100];

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
        this.gameMap = new GameMap({});     window.gameMap = this.gameMap;
        this.slotItemMap = new SlotItemMap({});     window.slotItemMap = this.slotItemMap;
        for (var j = 0; j < this.gameMap.length; j++){
            this.gameMap[j].range = setRange(this.gameMap, j); //console.log('gameMap range----- ', this.gameMap[j].range);
        }
        for (var k = 0; k < this.slotItemMap.length; k++){
            this.slotItemMap[k].range = setRange(this.slotItemMap, k);
        }
        slotGame.save('credit', 100);
        generateMap.call(this);
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

        this.messageView = new MessageView({});
        this.messageView.init();
        this.add(this.messageView);
    }

    function _setListeners() {
        Engine.on('click', function() {
            if (slotGame.get('spinState') != 'spinning') {
                slotGame.save('credit', slotGame.get('credit')-5);
                this.spin();
            }
        }.bind(this));

        slotGame.on('change:winnings', function(model, value){
            if(value >= 10 && value < 500) this.messageView.update(value);
            if (value >= 500 && value < 10000) this.messageView.update('<div style="font-size:48px">Big Win! ' + value +'</div>');
            if (value >= 10000) this.messageView.update('<div style="font-size:48px">JACKPOT! ' + value +'</div>');
        }.bind(this));
    }

    SlotMachine.prototype.spin = _.debounce(function() {
        slotGame.save('spinState', 'spinning');
        var currentResults = this.results;
        console.log('combo:', currentResults.combo, 'lines:', currentResults.lines, 'fruits:', currentResults.slotItems, 'isDiff:', currentResults.isDiff);
        var winnings = calcWin.call(this, currentResults); //console.log('winnings:', winnings);

        generateMap.call(this);
        this.columns.map(function(c, i){
            c.spin(500*i+1000);
        });
//        soundEffect.slot.play();

        if (currentResults.lines.length == 5) {
            slotGame.save('jackpot', Date.now());
        }

        if (currentResults.lines.length) {
            _.delay(function() {
                currentResults.lines.map(function(line, index){
                    setTimeout(function() {
                        this.animateLine(line, false);
                    }.bind(this), index*1700);
                }.bind(this));
            }.bind(this), 500*this.options.dimension[0]+1500);
        }

        _.delay(function() {
            slotGame.save('credit', slotGame.get('credit')+winnings);
            slotGame.save('winnings', winnings);
            slotGame.save('spinState', 'endSpin');
        }.bind(this), 500*this.options.dimension[0]+1500);

    },1000, true);

    SlotMachine.prototype.animateLine = function(line, bad) {
        this.columns.map(function(c, i){
            c.rows.map(function(r, i){
                r.animateLine(line,bad);
            });
        });
        if (bad) soundEffect.badline.play();
        else soundEffect.line.play();
    };

    function generateMap(){
        this.results = setVariables.call(this);
        generate.call(this, this.results.lines, this.results.slotItems, this.results.isDiff);
        var verify = verifySlotMap.call(this, this.results.lines, this.results.slotItems); //console.log('verify?', verify);
        while (verify == false) {
            this.results = setVariables.call(this)
            regenerate.call(this, this.results.lines, this.results.slotItems, this.results.isDiff);
            verify = verifySlotMap.call(this, this.results.lines, this.results.slotItems); //console.log('verify regenerated', verify)
        }
    }

    function setVariables(){
        var winCombo = generateCombo.call(this, this.gameMap, 2000, this.gameMap.length-1);
        var lines = this.gameMap[winCombo].line;
        var isDiff = this.gameMap[winCombo].isDiff;
        var combo = this.gameMap[winCombo].combo;
        var slotItems = generateSlotItems.call(this, lines, isDiff); //console.log('lines:', lines, 'slotItems', slotItems, 'isDiff', isDiff);
        return {lines: lines, isDiff: isDiff, slotItems: slotItems, combo: combo};
    }

    function generateCombo(map, upperLimit, defaultValue) {
        var combo = defaultValue;
        var randomNumber = Math.floor(Math.random()*upperLimit);
        for (var i = 0; i < map.length; i++){
            var inRange = checkRange(map[i].range, randomNumber);
            if (inRange) {
                combo = i; break;
            }
        }
        return combo;
    }

    function setRange(map, index){
        if (index == 0) {
            var min = 0;
            var max = map[0].weight-1;
        } else {
            min = map[index-1].range[1]+1;
            max = min+map[index].weight-1;
        }
        return [min, max]
    }

    function checkRange(range, number){
        return (number <= range[1] && number >= range[0]);
    }

    function generateSlotItems(lines, isDiff){
        var slotItems = [];
        var randomFruit = chooseFruit();
        for (var i = 0; i < lines.length; i++){
            if (isDiff) {
                var oldFruit = randomFruit;
                randomFruit = chooseFruit();
                while (randomFruit == oldFruit) randomFruit = chooseFruit();
            }
            slotItems.push(randomFruit);

        }
        return slotItems
    }

    function generate(lines, items, isDiff) {
        this.topRow = this.options.rowCount-1;
        this.midRow = this.options.rowCount-2;
        this.bottomRow = this.options.rowCount-3;

        for (var i=0; i<this.options.dimension[0]; i++) {
            for (var j=0; j<this.options.rowCount; j++) {
                if (!this.slotMap[i])
                    this.slotMap[i]=[];
                if (this.slotMap[i][j+this.options.rowCount-this.options.dimension[1]] !== undefined) {
                    this.slotMap[i][j] = this.slotMap[i][j+this.options.rowCount-this.options.dimension[1]];
                } else if ((j == this.topRow || j == this.midRow || j == this.bottomRow) && lines != undefined) {
                    setWinCombo.call(this, i, j, lines, items, isDiff)
                } else
                    this.slotMap[i][j] = Math.floor(Math.random()*12);
            }
        }
    }

    function chooseFruit() {
        return generateCombo.call(this, this.slotItemMap, 600, 0);
//        return 1;
    }

    function setWinCombo(i, j, lines, items, isDiff) {
        if (lines.length == 0) {
            this.slotMap[i][j] = chooseFruit.call(this);
        } else if (isDiff) {
            setDiffItems.call(this, i, j, lines, items);
        } else {
           setSameItems.call(this, i, j, lines, items);
        }
    }

    function setSameItems(i, j, lines, items) {
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
    }

    function setDiffItems(i, j, lines, items) {
        var notLines = [];
        if (lines.length < 3) {
            for (var lineNum = 0; lineNum < 3; lineNum++) {
                if (lines.indexOf(lineNum) == -1) notLines.push(lineNum)
            }
        }
        for (var p = 0; p < notLines.length; p++) {
            switch (notLines[p]) {
                case 0:
                    if(line0[i][this.options.rowCount-j-1]=='x') this.slotMap[i][j] = chooseFruit.call(this);
                    break;
                case 1:
                    if(line1[i][this.options.rowCount-j-1]=='x') this.slotMap[i][j] = chooseFruit.call(this);
                    break;
                case 2:
                    if(line2[i][this.options.rowCount-j-1]=='x') this.slotMap[i][j] = chooseFruit.call(this);
                    break;
            }
        }

        for (var k = 0; k < lines.length; k++) {
            switch (lines[k]) {
                case 0:
                    if(line0[i][this.options.rowCount-j-1]=='x') this.slotMap[i][j] = items[k];
                    break;
                case 1:
                    if(line1[i][this.options.rowCount-j-1]=='x') this.slotMap[i][j] = items[k];
                    break;
                case 2:
                    if(line2[i][this.options.rowCount-j-1]=='x') this.slotMap[i][j] = items[k];
                    break;
                default:
                    this.slotMap[i][j] = chooseFruit.call(this);
            }
        }
    }

    function regenerate(lines, items, isDiff) {
        for (var i=0; i<this.options.dimension[0]; i++) {
            for (var j=this.bottomRow; j<this.options.rowCount; j++) {
                setWinCombo.call(this, i, j, lines, items, isDiff);
            }
        }
    }

    function verifySlotMap(lines, items) {
        var slotLines = [];

        if(items) {
            if (verifyLine0.call(this)) slotLines.push(0);
            if (verifyLine1.call(this)) slotLines.push(1);
            if (verifyLine2.call(this)) slotLines.push(2);
            if (verifyLine3.call(this)) slotLines.push(3);
            if (verifyLine4.call(this)) slotLines.push(4);
        }
        if(lines) var same = arraysIdentical(lines, slotLines); //console.log(slotLines)
        return same;
    }

    function verifyLine0() {
        return (this.slotMap[0][this.midRow] == this.slotMap[1][this.midRow] && this.slotMap[0][this.midRow] == this.slotMap[2][this.midRow])
    }

    function verifyLine1() {
        return (this.slotMap[0][this.topRow] == this.slotMap[1][this.topRow] && this.slotMap[0][this.topRow] == this.slotMap[2][this.topRow])
    }

    function verifyLine2() {
        return (this.slotMap[0][this.bottomRow] == this.slotMap[1][this.bottomRow] && this.slotMap[0][this.bottomRow] == this.slotMap[2][this.bottomRow])
    }

    function verifyLine3() {
        return (this.slotMap[0][this.bottomRow] == this.slotMap[1][this.midRow] && this.slotMap[0][this.bottomRow] == this.slotMap[2][this.topRow])
    }

    function verifyLine4() {
        return (this.slotMap[0][this.topRow] == this.slotMap[1][this.midRow] && this.slotMap[0][this.topRow] == this.slotMap[2][this.bottomRow])
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

    function calcWin(results) {
        if (results.lines.length > 0) {
            var winAmt = 0;
            for (var i = 0; i < results.lines.length; i++){
                var lineWin = winChart[results.lines.length]*this.slotItemMap[results.slotItems[i]].value;
                winAmt = winAmt + lineWin;
            }
            return winAmt;
        } else {
            return 0;
        }
    }

    module.exports = SlotMachine;
});