define(function(require, exports, module) {
    var UIComponent         = require('core/UIComponent');
    var UIElement           = require('core/UIElement');

    var RectangularPrism = UIComponent.extend(/** @lends UIContainer.prototype */{
        constructor:function(options) {
            this._callSuper(UIComponent, 'constructor', options);

            var mainContent = options.mainContent || 'face';
            var backgroundColor = options.backgroundColor || '#e51c23';

            var classes = ['backfaceVisibility'];
            var frontClasses = classes;
            if (options.classes) {
                frontClasses = classes.concat(options.classes);
            }
            var size = this.getSize();
            var w = size[0];
            var h = size[1];
            var d = options.depth || 100;
            var bottomElement = new UIElement({
                classes: ['backfaceVisibility'],
                size: [w, d],
                style: {
                    background: backgroundColor
                },
                opacity: 1,
                position: [0,h,0],
                rotation: [-Math.PI/2, 0, 0]
            });
            this._addChild(bottomElement);

            var topElement = new UIElement({
                classes: ['backfaceVisibility'],
                size: [w, d],
                style: {
                    background: backgroundColor
                },
                opacity: 1,
                position: [0,0,0],
                // position: [0,0,0],
                rotation: [-Math.PI/2, 0, 0]
            });
            this._addChild(topElement);

            var leftElement = new UIElement({
                classes: ['backfaceVisibility'],
                size: [d, h],
                style: {
                    background: backgroundColor
                },
                opacity: 1,
                position: [0,0,0],
                rotation: [0,Math.PI/2, 0]
            });
            this._addChild(leftElement);

            var rightElement = new UIElement({
                classes: ['backfaceVisibility'],
                size: [d, h],
                style: {
                    background: backgroundColor
                },
                opacity: 1,
                position: [w,0,0],
                rotation: [0,Math.PI/2, 0]
            });
            this._addChild(rightElement);

            var frontElement = new UIElement({
                classes: frontClasses,
                size: [w, h],
                content: mainContent,
                style: {
                    background: backgroundColor
                },
                opacity: 1,
            });
            this._addChild(frontElement);
            frontElement.on('click', function()
            {
                console.log('what the');
            })

            var backElement = new UIElement({
                classes: frontClasses,
                size: [w, h],
                content: mainContent,
                style: {
                    background: backgroundColor
                },
                opacity: 1,
                position: [0,0,-d]
            });
            this._addChild(backElement);
        },

    });

    module.exports = RectangularPrism;
});
