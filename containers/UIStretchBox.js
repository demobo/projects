define(function(require, exports, module) {
    var UIContainer         = require('./UIContainer');
    var Engine              = require('famous/core/Engine');
    var UIElement           = require('../core/UIElement');

    var UIStretchBox = UIContainer.extend(/** @lends UIContainer.prototype */{
        /**
         * A main container for apps
         *
         * @class UIStretchBox
         * @uses UIContainer
         * @constructor
         *
         * @param {Object} [options] options to be applied to underlying
         *    UIElement
         */
        constructor: function(options) {
            if(!options) options = {};

            this._direction = options.direction || 'x';
            this._padding   = options.padding || 0;
            this._animating = [];
            this._freed     = [];
            this._lowestIndex;

            this._bindReflow = this._reflow.bind(this);
            this._bindAddToAnimating = this._addToAnimating.bind(this);
            this._bindRemoveFromAnimating = this._removeFromAnimating.bind(this);

            this._callSuper(UIContainer, 'constructor', options);

//            this._addChild(new UIElement({ style: { border: '3px dotted white', zIndex: 10000, pointerEvents: 'none' }}));
        },

        render: function () {
            if(this._animating.length){
                this._lowestIndex = this._children.length;
                for (var i = 0; i < this._animating.length; i++) {
                    if(this._animating[i] < this._lowestIndex) this._lowestIndex = this._animating[i];
                }
                this._reflow(this._lowestIndex);
            }

            return this._callSuper(UIContainer, 'render');
        },

        addChildAt: function (child, index) {
            this._callSuper(UIContainer, 'addChildAt', child, index);

            child.on('sizeChange', this._bindReflow);
            child.on('sizeTransitionStart', this._bindAddToAnimating);
            child.on('sizeTransitionEnd', this._bindRemoveFromAnimating);

            this._reflow(child);
        },

        removeChildAt: function (index) {
            var child = this._callSuper(UIContainer, 'removeChildAt', index);

            child.off('sizeChange', this._bindReflow);
            child.off('sizeTransitionStart', this._bindAddToAnimating);
            child.off('sizeTransitionEnd', this._bindRemoveFromAnimating);

            this._reflow(child);
        },

        _reflow: function (child) {
            var childSize,
                startingIndex = this._childHash[child] || 0,
                currentOffset = [0, 0],
                newSize = [0, 0],
                index = + (this._direction === 'y'),
                opposite = + !index;

            for (var i = 0; i < this._children.length; i++) {
                if (i >= startingIndex) this._children[i].setPosition(currentOffset[0], currentOffset[1], 0);
                childSize = this._children[i].getSize();
                currentOffset[index] += this._children[i].getSize()[index] + this._padding;
                if (childSize[opposite] > newSize[opposite]) newSize[opposite] = childSize[opposite];
            }
            if(currentOffset[index] > newSize[index]) newSize[index] = currentOffset[index];
            this.setSize(newSize[0], newSize[1]);
        },

        _addToAnimating: function (child) {
            var id;
            var index = this._childHash[child];

            if (this._freed.length) {
                id = this._freed.shift();
                this._animating[id] = index;
            } else id = this._animating.push(index) - 1;
        },

        _removeFromAnimating: function (child) {
            var index = this._childHash[child];
            var position = this._animating.indexOf(index);

            this._animating[position] = void 0;
            this._freed.push(position);
        }
    });

    module.exports = UIStretchBox;
});
