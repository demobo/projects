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
            this.image.center();
            this._addChild(this.image);
            this.frame = new UIElement({
                size:[options.size[0]*0.90, options.size[1]]
            });
            this.frame.center();
            this._addChild(this.frame); window.image = this.image;
        },

        update: function() {
            icon = 'icon'+this.options.map[this.options.column][this.options.row];
            this.image.setContent('<div class="slotIcon ' + icon + '"></div>');
        },

        animate: function(bad) {
            if (bad) this.image.setClasses(['bad']);
            else this.image.setClasses(['good']);

            this.frame.setClasses(['active']); //console.log(this.options.map[this.options.column][this.options.row]);

            var icon = this.options.map[this.options.column][this.options.row];
            if (this.image.getClasses() == 'good') {
                switch (icon) {
                    case 0: case 3: case 5: case 9:
                        this.image.setRotation(0,0, -Math.PI*2, {duration: 1000, curve: 'easeIn'}, function () {
                            this.image.setRotation(0, 0, 0, {duration: 500, curve: 'easeOut'})
                        }.bind(this));
                        animateSize.call(this, 1.2, 1500, 100);
                        break;
                    case 1: case 2: case 4:
                        this.image.setRotation(0,Math.PI*6,0, {duration: 1400, curve: Easing.inOutBounce}, function () {
                            this.image.setRotation(0,0,0, {duration: 100, curve: Easing.inOutBounce});
                        }.bind(this));
                        animateSize.call(this, 1.2, 1500, 100);
                        break;
                    case 6:
                        this.image.setRotation(0,0,Math.PI*2, {duration: 500, curve: Easing.inBounce},function () {
                            this.image.setRotation(0,0,0, {duration: 500, curve: Easing.inOutElastic})
                        }.bind(this));
                        animateSize.call(this, 1.2, 1500, 100);
                        break;
                    case 7:
                        this.image.setScale([1.5,1.5,1], {duration: 1400, method: 'spring'}, function () {
                            this.image.setScale([1,1,1], {duration: 100, method: 'snap'});
                        }.bind(this));
                        changeFrame.call(this, 1.2, 1500, 100);
                        break;
                    default:
                        this.image.setRotation(0, 0, Math.PI*2, {duration: 1000, curve: 'spring'}, function () {
                            this.image.setRotation(0, 0, 0, {duration: 500, curve: 'spring'})
                        }.bind(this));
                        animateSize.call(this, 1.2, 1500, 100);
                        break;
                }
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
                if (this.options.row==0 && this.options.column==0)
                    this.animate(bad);
                else if (this.options.row==1 && this.options.column==1)
                    this.animate(bad);
                else if (this.options.row==2 && this.options.column==2)
                    this.animate(bad);
            }
            else if (line===4) {
                if (this.options.row==2 && this.options.column==0)
                    this.animate(bad);
                else if (this.options.row==1 && this.options.column==1)
                    this.animate(bad);
                else if (this.options.row==0 && this.options.column==2)
                    this.animate(bad);
            }
        }

    });

    function animateSize(scale, duration1, duration2){
        changeImage.call(this, scale, duration1, duration2);
        changeFrame.call(this, scale, duration1, duration2);
    }

    function changeImage(scale, duration1, duration2) {
        this.image.setScale([scale, scale, 1], {duration: duration1, curve: 'spring'}, function () {
            this.image.setScale([1, 1, 1], {duration: duration2, method: 'snap'});
            this.image.setClasses([]);
        }.bind(this));
    }

    function changeFrame(scale, duration1, duration2) {
        this.frame.setScale([scale, scale, 1], {duration: duration1, curve: 'spring'}, function () {
            this.frame.setScale([1, 1, 1], {duration: duration2, method: 'snap'});
            this.frame.setClasses([]);
        }.bind(this));
    }

    module.exports = SlotItem;
});
