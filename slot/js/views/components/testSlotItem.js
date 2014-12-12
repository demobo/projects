define(function(require, exports, module) {
    var UIComponent         = require('core/UIComponent');
    var UIElement           = require('core/UIElement');
    var UIContainer         = require('containers/UIContainer');

    var testSlotItem = UIComponent.extend({
        constructor:function(options) {
            this._callSuper(UIComponent, 'constructor', options);
            this.options = options;
            this.image = new UIElement({});
            this._addChild(this.image);
            this.frame = new UIElement({});
            this._addChild(this.frame);
        },

        update: function() {
            var icon = 'icon'+this.options.map[this.options.column][this.options.row];
            this.image.setContent('<div class="slotIcon ' + icon + '"></div>');
        },

        animate: function(bad) {
            if (bad)
                this.image.setClasses(['bad']);
            else
                this.image.setClasses(['good']);
            this.frame.setClasses(['active']);
            this.image.setScale([1,1,1], {
                duration: 400,
                curve: 'spring'
            }, function() {
                setTimeout(function(){
                    this.image.setScale([1,1,1], {
                        method: 'snap'
                    });
                    this.image.setClasses([]);
                    this.frame.setClasses([])
                }.bind(this),600);
            }.bind(this));
        },

        animateLine: function(line, bad) {
            if (line===0 && this.options.row==1) {
                this.animate(bad);
            }
            else if (line===1 && this.options.row==2) {
                this.animate(bad);
            }
            else if (line===2 && this.options.row==0) {
                this.animate(bad);
            }
            else if (line===3) {
                if (this.options.row==2 && this.options.column==0)
                    this.animate(bad);
                else if (this.options.row==1 && this.options.column!=0 && this.options.column!=4)
                    this.animate(bad);
                else if (this.options.row==0 && this.options.column==4)
                    this.animate(bad);
            }
            else if (line===4) {
                if (this.options.row==2 && this.options.column==4)
                    this.animate(bad);
                else if (this.options.row==1 && this.options.column!=0 && this.options.column!=4)
                    this.animate(bad);
                else if (this.options.row==0 && this.options.column==0)
                    this.animate(bad);
            }
        }

    });

    module.exports = testSlotItem;
});
