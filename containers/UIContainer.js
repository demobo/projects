define(function(require, exports, module) {
    var UIComponent = require('../core/UIComponent');

    var UIContainer = UIComponent.extend( /** @lends UIComponent.prototype */ {

        /**
         * A base class for containers, the category of UIComponents
         *   capable of managing addition and subtraction of arbitrary UIComponents/Elements
         *   within it.
         *
         * @class UIContainer
         * @uses UIComponent
         * @constructor
         *
         * @param {Object} [options] options to be applied to underlying
         *    UIElement
         */
        constructor: function Container (options) {
            this._callSuper(UIComponent, 'constructor', options);
            this._children  = [];
            this._childHash = {};
            if (options && options.children && options.children.length > 0) {
                this.setChildren(options.children);
            }
        },

        addChild: function(child) {
            return this.addChildAt(child, this._children.length);
        },

        addChildAt: function (child, index) {
            this._children.splice(index, 0, child);
            this._addChild(child);

            for (var key in this._childHash){
                if(this._childHash[key] >= index){
                    this._childHash[key]++;
                }
            }
            this._childHash[child.getID()] = index;

            return child;
        },

        removeChild: function(child) {
            return this.removeChildAt(this._childHash[child.getID()]);
        },

        destroyChild: function (child) {
            child.destroy();
            this.removeChild(child);
        },

        removeChildAt: function (index) {
            var child = this._children[index];

            for (var key in this._childHash){
                if(this._childHash[key] > index){
                    this._childHash[key]--;
                }
            }

            delete this._childHash[child.getID()];

            this._children.splice(index, 1);
            child._renderable = false;

            if (this._nodeHash[child.getID()]) {
                this._nodeHash[child]._object = null;
                this._nodeHash[child]._isRenderable = false;
                var index = this._rootNode._child.indexOf(this._nodeHash[child]);
                this._rootNode._child.splice(index, 1);
                delete this._nodeHash[child];
            }

            this._removeChild(child);
            return child;
        },

        getChildren: function() {
            return this._children || [];
        },

        setChildren: function(p_childArray) {
            var i;
            // blow away any extant kids (sorry)
            if (this._children) {
                for (i = 0; i < this._children.length; i++) {
                    this._removeChild(this._children[i]);
                }
                this._children = [];
            }
            for (i = 0; i < p_childArray.length; i++) {
                this.addChild(p_childArray[i]);
            }
        }
    });

    module.exports = UIContainer;
});
