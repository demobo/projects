define(function(require, exports, module) {
    var UIComponent         = require('core/UIComponent');
    var UIElement           = require('core/UIElement');
    var UIContainer         = require('containers/UIContainer');
    var SlotItem          = require('components/SlotItem');

    var SlotColumn = UIContainer.extend({
        constructor:function(options) {
            this._callSuper(UIContainer, 'constructor', options);
            this.options = options;
            this.rowCount = options.rowCount;
            var columnWidth = window.innerWidth*.84/options.dimension[0];
            var columnHeight = this.rowCount*window.innerHeight*.7/options.dimension[1];
            this.rowHeight = columnHeight/this.rowCount;
            this.rows = [];
            for (var i=0; i<this.rowCount; i++) {
                var index = i;
                var r = new SlotItem({
                    row: index,
                    column: options.column,
                    align: [options.column/options.dimension[0],1],
                    origin: [0,1],
                    position: [0, -i*this.rowHeight, 0],
                    size: [columnWidth,this.rowHeight],
                    style: {
                        lineHeight: this.rowHeight+'px',
                        fontSize: '30px',
                        color: "#000099",
                        textAlign: 'center',
                        borderTop: 'solid 1px #000'
                    },
                    map: options.map
                });
                r.update();
                this.rows.push(r);
                this._addChild(r);
            }
        },

        hide: function() {
            this.setOpacity(0, {duration: 200, curve: "easeOut"});
        },

        show: function() {
            this.halt();
            this.setOpacity(1, {duration: 200, curve: "easeOut"});
        },

        spin: function(duration) {
            this.setPosition(0,this.rowHeight*(this.rowCount-this.options.dimension[1]-1),0, {
                duration: duration,
                curve: 'easeIn'
            }, function() {
                this.setPosition(0,this.rowHeight*(this.rowCount-this.options.dimension[1]),0, {
                    method: 'snap'
                }, function() {
                    setTimeout(function(){
                        this.setPosition(0,0,0);
                        this.update();
                    }.bind(this), 500);
                }.bind(this));
            }.bind(this));
        },

        update: function() {
            _(this.rows).map(function(row){
                row.update();
            }.bind(this));
        }

    });

    module.exports = SlotColumn;
});