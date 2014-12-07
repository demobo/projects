define(function(require, exports, module) {
    var UIContainer         = require('./UIContainer');
    var Engine              = require('famous/core/Engine');
    var UIBase              = require('../core/UIBase');

    var UIApplication = UIContainer.extend(/** @lends UIContainer.prototype */{
        /**
         * A main container for apps
         *
         * @class UIApplication
         * @uses UIContainer
         * @constructor
         *
         * @param {Object} [options] options to be applied to underlying
         *    UIElement
         */
        constructor:function(options) {
            this._callSuper(UIContainer, 'constructor', options);
            this._createContext();
        },

        /*
         *  @method _createContext
         *  @protected
         */
        _createContext: function(el) {
            // Resize event etc. might be useful later on, but are being emitted
            // on Engine
            this._context = Engine.createContext(el);
            this.setPerspective(1000);
            Engine.pipe(this);
            this._context.add(this);
            return this;
        },

        /**
         * Set the current webkit-persepective on the UIApplication.
         * @method setPerspective
         */
        setPerspective: function(perspective, transition, callback) {
            this._context.setPerspective(perspective, transition, callback);
        },

        /**
         * Get a reference to a child of the UIApplication, looked up by id.
         *  @method getByID
         */
        getByID: function(id) {
            // we're "friend" classes
            return UIBase._idRegistry[id];
        }

        // FIXME See showOff7
        // /**
        //  *  Return the size of the UIApplication.
        //  *  @method getSize
        //  *  @returns {Array | 2D}
        //  */
        // getSize: function() {
        //     return this._context.getSize();
        // }
    });

    module.exports = UIApplication;
});
