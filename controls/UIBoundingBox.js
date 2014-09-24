define(function(require, exports, module) {
    var UIElement = require('../core/UIElement');

    var UIBoundingBox = UIElement.extend( /** @lends UIElement.prototype */ {
        /**
         * A bounding box to be added to each component
         *
         * @name UIBoundingBox
         * @constructor
         *
         * @param {Object} [options] options to be set on UIBoundingBox
         */
        constructor: function(options) {
            options = options || {};
            options.opacity = options.opacity || 0;
            this._callSuper(UIElement, 'constructor', options);
        }
    });

    module.exports = UIBoundingBox;
});
