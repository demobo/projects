define(function(require, exports, module) {
    var UIElement = require('./UIElement');
    var UIBase    = require('./UIBase');
    var Entity    = require('famous/core/Entity');
    var Engine    = require('famous/core/Engine');

    var UIComponent = UIBase.extend( /** @lends UIBase.prototype */ {
        /**
         * A base class for creating components.
         *   This class inherits from the UIBase super class
         *   while combining different elements into components.
         *   It supports all UIElement methods. All UIElement
         *   methods invoked on a UIComponent (e.g. UIComponent.add(...))
         *   get applied to the underlying UIElement.
         *
         * @class UIComponent
         * @uses UIBase
         * @uses UIElement
         * @constructor
         *
         * @param {Object} [options] options to be applied to underlying
         *    UIElement
         */
        constructor: function Component (options) {
            this._callSuper(UIBase, 'constructor', options);
            this._nodeHash = {};
            this._rawChildren = [];
        },

        /**
         * Adds child node to rootNode
         *
         * @protected
         * @method _addChild
         * @param {UIElement | UIComponent} child object implementing the
         *    UIBase (UIElement or UIComponent)
         * @return {UIComponent} this a reference to itself for chaining
         */
        _addChild: function(child) {
            if (child.parent) 
                throw new Error('Children can\'t be added twice');

            this._nodeHash[child.getID()] = this._rootNode.add(child);
            // "Friend" property...
            child._parent = this;

            this._rawChildren.push(child);

            return this;
        },

        /**
         * Removes child from scene graph
         *
         * @protected
         * @method _removeChild
         * @param {UIElement | UIComponent} child object implementing the
         *    UIBase (UIElement or UIComponent)
         */
        _removeChild: function(child, index) {
            // FIXME Causes memory leak, since surfaces etc. are not actually
            // being removed, but still being referenced inside famous/core/Entity.js
            child._renderable = false;
            child._parent = null;
            var childIndex = this._rawChildren.indexOf(child);
            if(childIndex !== -1) this._rawChildren[childIndex] = null;
        },

        /**
         *  Completely destroys this component and its children.
         *  @method destroy
         */
        destroy: function () {
            this._callSuper(UIBase, 'destroy');
            for (var i = 0; i < this._rawChildren.length; i++) {
                var child = this._rawChildren[i];
                if (child.destroy) child.destroy();
                if (child._parent) child._parent = null;
                var id = child.getID();
                if (this._nodeHash[id]) { 
                    var index = this._rootNode._child.indexOf(this._nodeHash[id]);
                    this._rootNode._child.splice(index, 1);
                    delete this._nodeHash[id];
                }
            }
            this._rootNode    = null;
            this._rawChildren = null;
            this._parent      = null;
            this._renderNode  = null;
        }
    });

    module.exports = UIComponent;
});
