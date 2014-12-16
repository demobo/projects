define(function(require, exports, module) {
    var UIComponent         = require('core/UIComponent');
    var UIElement           = require('core/UIElement');
    var UIContainer         = require('containers/UIContainer');
    var Easing              = require('famous/transitions/Easing');

    var SlotItem = UIComponent.extend({
        constructor:function(options) {
            this._callSuper(UIComponent, 'constructor', options);
            this.options = options;
            this.image = new UIElement({});
            this.image.center()
            this._addChild(this.image);
            this.frame = new UIElement({
                size:[options.size[0]*0.9, options.size[1]*0.9],
            });
            this._addChild(this.frame); window.image = this.image;
        },

        update: function() {
            icon = 'icon'+this.options.map[this.options.column][this.options.row];
            this.image.setContent('<div class="slotIcon ' + icon + '"></div>');
        },

        animate: function(bad) {
            if (bad) {
                this.image.setClasses(['bad']);
            } else {
                this.image.setClasses(['good']);
            }
            this.frame.setClasses(['active']); console.log(this.options.map[this.options.column][this.options.row]);

            var icon = this.options.map[this.options.column][this.options.row];
            if (this.image.getClasses() == 'good') {
                switch (icon) {
                    case 0: {
                        //this.image.setClasses(['animated']);
                        this.image.setRotation(0,0, -Math.PI*2, {duration: 2000, curve: 'easeIn'}, function () {
                            this.image.setRotation(0, 0, 0, {duration: 1000, curve: 'easeOut'})
                        }.bind(this));
                    }
                        break;
                    case 1: {
                        this.image.setRotation(Math.PI*2,0,0, {duration: 1000, curve: Easing.inOutBounce}, function () {
                            this.image.setRotation(0,0,0, {duration: 1000, curve: Easing.outBounce})
                        }.bind(this));
                    }
                        break;
                    case 2: {
                        this.image.setRotation(0,0,Math.PI*2, {duration: 1000, curve: Easing.inBounce},function () {
                            this.image.setRotation(0,0,0, {duration: 1000, curve: Easing.inOutElastic})
                        }.bind(this));
                    }
                        break;
                    case 3: {
                        this.image.setScale([1.5,1.5,1], {duration: 3000,method: 'spring'});
                    }
                        break;
                    default: {
                        this.image.setRotation(0, 0, Math.PI, {duration: 1000, curve: 'easeIn'}, function () {
                            this.image.setRotation(0, 0, 0, {duration: 1000, curve: 'easeIn'})
                        }.bind(this));
                    }
                        break;
                }
                this.image.setScale([1.2, 1.2, 1], {duration: 400, curve: 'spring'}, function () {
                    //this.image.setRotation(0, 0, Math.PI * 2, {duration: 1000, curve: 'easeIn'}, function () {
                    //    this.image.setRotation(0, 0, 0, {duration: 1000, curve: 'easeIn'}, function () {
                            this.image.setScale([1, 1, 1], {duration: 500, method: 'snap'});
                            this.image.setClasses([]);
                            this.frame.setClasses([]);
                        //}.bind(this));
                    //}.bind(this));
                }.bind(this));
            } else if (this.image.getClasses() == 'bad') {
                setTimeout(function(){
                    this.image.setClasses([]);
                    this.frame.setClasses([]);
                }.bind(this), 1000)

            }
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

    module.exports = SlotItem;
});
