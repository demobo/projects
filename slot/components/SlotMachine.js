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
        Engine.on('click', function(){
            generate.call(this);
            this.columns.map(function(c, i){
                c.spin(500*i+1000);
            });
        }.bind(this));
    }

    function generate() {
        for (var i=0; i<this.options.dimension[0]; i++) {
            for (var j=0; j<this.options.rowCount; j++) {
                if (!this.slotMap[i])
                    this.slotMap[i]=[];
                if (this.slotMap[i][j+this.options.rowCount-this.options.dimension[1]] !== undefined)
                    this.slotMap[i][j] = this.slotMap[i][j+this.options.rowCount-this.options.dimension[1]];
                else
                    this.slotMap[i][j] = Math.floor(Math.random()*11);
            }
        }
    }

    module.exports = SlotMachine;
});