define(function(require, exports, module) {
    var UIContainer         = require('./UIContainer');
    var Engine              = require('famous/core/Engine');
    var UIComponent         = require('core/UIComponent');
    var Transform           = require('famous/core/Transform');
    var UIElement           = require('core/UIElement');

    var UIRow = UIContainer.extend(/** @lends UIContainer.prototype */{
        /**
         * A layout imitating the bootstrap grid layout.
         *
         * @class UI
         * @uses UIContainer
         * @constructor
         *
         * @param {Object} [options] options to be applied to underlying
         *    UIElement
         */
        constructor: function UIRow(options) {
            if(!options) options = {};

            this._width = options.width;
            this._stack = [];
            this._addIndex = 0;
            this._rowHeights = [];
            this._childRows = [];

            this._callSuper(UIContainer, 'constructor', options);
        },

        addChild: function (childObj) {
            var childSize;
            var container;

            if(Array.isArray(childObj.element)) {
                container = new UIRow({ children: childObj.element });
                this._childRows.push(container);
                //I know, I know...
                container._child = container;
                childSize = container.getSize();
            } else {
                container = new UIComponent();
                container._addChild(childObj.element);
                container._child = childObj.element;
                childSize = childObj.element.getSize();
                container.setSize(childSize);
            }

            this._callSuper(UIContainer, 'addChild', container);
            this._stack.push(buildStackObject(childObj.cols, childObj.offset));
            this._reflow();
        },

        _reflow: function (querySize) {
            var rowWidth = this.getSize()[0],
            colSize = rowWidth / 12,
            colCount = 0,
            currentRow = 0,
            colBlocks,
            child,
            childHeight;

            for (var i = 0; i < this._children.length; i++) {
                child = this._children[i];
                childHeight = child._child.getSize()[1];
                colBlocks = this._stack[i].cols[querySize];
                colOffset = this._stack[i].offset[querySize];
                if(colCount + colBlocks + colOffset > 12) {
                    ++currentRow;
                    colCount = 0;
                }
                offsetX = (colCount + colOffset) * colSize;
                offsetY = currentRow > 0 ? _sumRowHeight.call(this, currentRow) : 0;
                child.setTransform(Transform.translate(offsetX, offsetY, 0));
                child.setSize(colSize * colBlocks, true);
                if(this._rowHeights[currentRow] < childHeight || this._rowHeights[currentRow] == null) this._rowHeights[currentRow] = childHeight;
                colCount += (colBlocks + colOffset);
            }

            for (var i = 0; i < this._childRows.length; i++) {
                this._childRows[i]._reflow(querySize);
            }

            this.setSize(rowWidth, _sumRowHeight.call(this, currentRow + 1));
            this._rowHeights = [];
        }
    });

    function _sumRowHeight (currentRow) {
        var totalHeight = 0;
        while (currentRow) {
            currentRow--;
            totalHeight += this._rowHeights[currentRow];
        }
        return totalHeight;
    }

    function buildStackObject (cols, offset) {
        return {
            cols: {
                lg : cols.lg || cols.md || cols.sm || 12,
                md : cols.md || cols.sm || 12,
                sm : cols.sm || 12,
            },
            offset: {
                lg : (offset.lg != null) ? offset.lg : (offset.md != null) ? offset.md : (offset.sm != null) ? offset.sm : 0,
                md : (offset.md != null) ? offset.md : (offset.sm != null) ? offset.sm : 0,
                sm : offset.sm != null ? offset.sm : 0,
            }
        }
    }

    module.exports = UIRow;
});
