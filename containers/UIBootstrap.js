define(function(require, exports, module) {
    var UIStretchBox       = require('./UIStretchBox');
    var Engine             = require('famous/core/Engine');
    var UIRow              = require('./UIRow');

    var UIBootstrapGrid = UIStretchBox.extend(/** @lends UIStretchBox.prototype */{
        /**
         * A layout imitating the bootstrap grid layout.  This class is basically
         * a vertical stretchbox containing many UIRows.
         *
         * @class UI
         * @uses UIStretchBox
         * @constructor
         *
         * @param {Object} [options] options to be applied to underlying
         *    UIElement
         */

        /** TODO: add options to dynamically add child rows and add elements to rows.
         *  Also need to add support for multiple window size blocks. As in -
         *  .col-md-6 and .col-xs-4  and a million other things I'm forgetting. ~ joseph
         */

        constructor: function(options) {
            if(!options) options = {};

            options.direction = 'y';
            this._width = options.width;
            this.rows = [];
            this._breakpoints = [
                {"tag": "sm", "value": 768},
                {"tag": "md", "value": 970},
                {"tag": "lg", "value": 1170}
            ];

            this._callSuper(UIStretchBox, 'constructor', options);

            Engine.on('resize', this._handleResize.bind(this));

            _initRows.call(this, options.rows);

            this._handleResize();
        },

        _handleResize: function () {
            var width = this._width * innerWidth;
            var querySize = this._breakpoints[0].tag;

            for (var i = 0; i < this._breakpoints.length; i++) {
                if (this._breakpoints[i].value < width) {
                    querySize = this._breakpoints[i].tag;
                }
            }

            for (var i = 0; i < this.rows.length; i++) {
                this.rows[i].setSize(this._width * innerWidth);
                this.rows[i]._reflow(querySize);
            }
        },

        getRows: function () {
            return this.rows;
        }
    });

    function _initRows (rowData) {
        var row;
        var element;

        for (var i = 0; i < rowData.length; i++) {
            row = new UIRow();
            for (var j = 0; j < rowData[i].length; j++) {
                element = rowData[i][j];
                row.addChild(element);
            }
            this.addChild(row);
            this.rows.push(row);
        }
    }

    module.exports = UIBootstrapGrid;
});
