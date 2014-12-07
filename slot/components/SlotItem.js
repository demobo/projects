define(function(require, exports, module) {
    var UIComponent         = require('core/UIComponent');
    var UIElement           = require('core/UIElement');
    var UIContainer         = require('containers/UIContainer');

    var SlotItem = UIElement.extend({
        constructor:function(options) {
            this._callSuper(UIElement, 'constructor', options);
            this.options = options;
        },

        hide: function() {
            this.setOpacity(0, {duration: 200, curve: "easeOut"});
        },

        show: function() {
            this.halt();
            this.setOpacity(1, {duration: 200, curve: "easeOut"});
        },

        update: function() {
            var icon = 'icon'+this.options.map[this.options.column][this.options.row];
            this.setContent('<div class="slotIcon ' + icon + '"></div>');
        },

        animate: function() {
            this.setScale([1.15,1.15,1], {
                duration: 400,
                curve: 'spring'
            }, function() {
                setTimeout(function(){
                    this.setScale([1,1,1], {
                        method: 'snap'
                    });
                }.bind(this),600);
            }.bind(this));
        },

        animateLine: function(line) {
            if (line===0 && this.options.row==1) {
                this.animate();
            }
            else if (line===1 && this.options.row==2) {
                this.animate();
            }
            else if (line===2 && this.options.row==0) {
                this.animate();
            }
            else if (line===3) {
                if (this.options.row==2 && this.options.column==0)
                    this.animate();
                else if (this.options.row==1 && this.options.column!=0 && this.options.column!=4)
                    this.animate();
                else if (this.options.row==0 && this.options.column==4)
                    this.animate();
            }
            else if (line===4) {
                if (this.options.row==2 && this.options.column==4)
                    this.animate();
                else if (this.options.row==1 && this.options.column!=0 && this.options.column!=4)
                    this.animate();
                else if (this.options.row==0 && this.options.column==0)
                    this.animate();
            }
        }

    });

    module.exports = SlotItem;
});