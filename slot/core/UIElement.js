define(function(require, exports, module) {
    var UIBase           = require('./UIBase');
    var Surface          = require('famous/core/Surface');
    var Entity           = require('famous/core/Entity');

    var GenericSync      = require('famous/inputs/GenericSync');
    var MouseSync        = require('famous/inputs/MouseSync');
    var PinchSync        = require('famous/inputs/PinchSync');
    var RotateSync       = require('famous/inputs/RotateSync');
    var ScaleSync        = require('famous/inputs/ScaleSync');
    var ScrollSync       = require('famous/inputs/ScrollSync');
    var TouchSync        = require('famous/inputs/TouchSync');

    var syncRegister     = {
        mouse:  MouseSync,
        pinch:  PinchSync,
        rotate: RotateSync,
        scale:  ScaleSync,
        scroll: ScrollSync,
        touch:  TouchSync
    };
    GenericSync.register(syncRegister);

    var eventList = {
        dragStart : [
            {syncType: 'mouse', eventName: 'start'},
            {syncType: 'touch', eventName: 'start'}
        ],
        dragUpdate : [
            {syncType: 'mouse', eventName: 'update'},
            {syncType: 'touch', eventName: 'update'}
        ],
        dragEnd : [
            {syncType: 'mouse', eventName: 'end'},
            {syncType: 'touch', eventName: 'end'}
        ],
        touchStart : [
            {syncType: 'touch', eventName: 'start'}
        ],
        touchUpdate : [
            {syncType: 'touch', eventName: 'update'}
        ],
        touchEnd : [
            {syncType: 'touch', eventName: 'end'}
        ],
        pinchStart: [
            {syncType: 'pinch', eventName: 'start'}
        ],
        pinchUpdate: [
            {syncType: 'pinch', eventName: 'update'}
        ],
        pinchEnd: [
            {syncType: 'pinch', eventName: 'end'}
        ],
        scrollStart: [
            {syncType: 'scroll', eventName: 'start'}
        ],
        scrollUpdate: [
            {syncType: 'scroll', eventName: 'update'}
        ],
        scrollEnd: [
            {syncType: 'scroll', eventName: 'end'}
        ],
        rotateStart: [
            {syncType: 'rotate', eventName: 'start'}
        ],
        rotateUpdate: [
            {syncType: 'rotate', eventName: 'update'}
        ],
        rotateEnd: [
            {syncType: 'rotate', eventName: 'end'}
        ],
        scaleStart: [
            {syncType: 'scale', eventName: 'start'}
        ],
        scaleUpdate: [
            {syncType: 'scale', eventName: 'update'}
        ],
        scaleEnd: [
            {syncType: 'scale', eventName: 'end'}
        ],
        click : [
            {syncType: 'touch', eventName: 'start'},
            {syncType: null, eventName: 'click'}
        ],
        mouseover : [
            {syncType: null, eventName: 'mouseover'}
        ],
        mouseout : [
            {syncType: null, eventName: 'mouseout'}
        ],
        mouseup : [
            {syncType: null, eventName: 'mouseup'}
        ]
    };
    // Add aliases
    eventList.tap       = eventList.click;
    eventList.mouseOver = eventList.mouseover;
    eventList.mouseOut  = eventList.mouseout;
    eventList.mouseUp   = eventList.mouseup;

    var UIElement = UIBase.extend( /** @lends UIBase.prototype */ {
        /**
         * A base class for creating elements.
         *   This class inherits from the UIBase super class.
         *
         * @class UIElement
         * @uses UIBase
         * @constructor
         *
         * @param {Object} [options] options to be applied to UIElement
         */
        constructor: function constructor(options) {
            options = options || {};
            this._genericSync = new GenericSync();
            this._callSuper(UIBase, 'constructor', options);
            this._createSurface(options);
            if(options.style) this.setStyle(options.styles);
        },

        /**
         * Sets CSS-style properties on the UIElement. Note that this
         *   is similar to the setProperties function supplied by the Surface
         *   class, but more efficient, since the Surface is only being
         *   re-rendered if needed.
         *
         * @method setStyle
         *
         * @param {Object} styles style dictionary of 'key' => 'value'
         */
        setStyle: function setStyle(styles) {
            for (var style in styles) {
                if (this._surface.properties[style] !== styles[style]) {
                    this._surface.properties[style] = styles[style];
                    this._surface._stylesDirty = true;
                }
            }
        },

        /**
         * Get the active CSS styles on the UIElement.
         *
         * @method getStyle
         * @return {Object} properties object
         */
        getStyle: function () {
            return this._surface.getProperties();
        },

        /**
         * Alias for setStyle
         *
         * @method setProperties
         * @deprecated
         * @param {Object} properties property dictionary of 'key' => 'value'
         */
        setProperties: function setProperties(properties) {
            return this.setStyle.call(this, properties);
        },

        /**
         * Set or overwrite inner (HTML) content of UIElement. Note
         *    that this causes a re-rendering if the content has changed.
         *
         * @method setContent
         * @param {string|Document Fragment} content HTML content
         */
        setContent: function setContent(content) {
            this._surface.setContent(content);
        },

        /**
         * Gets the content of the UIElement 
         *
         * @method getContent
         * @returns {String} HTML String content
         */
        getContent : function () {
            return this._surface.getContent();
        },

        /**
         * Destroys the UIElement
         *
         * @method destroy
         */
        destroy: function () {
            this._callSuper(UIBase, 'destroy');

            var id = this._surface.id;
            var self = this;
            var listener = function () {
                Entity.unregister(id);
                self._surface.removeListener('recall', listener);
                self._surface._eventOutput._owner = null;
                self._eventHandler._owner = null;
                self._eventHandler = null;
                self._surface = null;
            };
            this._surface.on('recall', listener);
            this._surface.unpipe(this._genericSync);
            this._surface.unpipe(this);
        },

        /**
         * Sets CSS classes on the UIElement 
         *
         * @method setClasses
         * @param {Array.string} classList
         */
        setClasses: function setClasses(classes) {
            this._surface.setClasses(classes);
        },

        /**
         * Gets the CSS class of the UIElement
         *  
         * @method getClasses
         * @return {Array.string} array of class names
         */
        getClasses : function () {
            return this._surface.getClassList();
        },

        // Helper method used internally to create and add surfaces to the
        // UIElement. Takes in options that gets set on the created Surface.
        _createSurface: function _createSurface(options) {
            // Apply options passed in to the underlying Surface.
            // Size should only be set to underlying StateModifier.
            this._surface = new Surface({
                classes: options.classes,
                properties: options.style,
                content: options.content
            });

            this._surface.elementType = options.type || 'div';

            this._rootNode.add(this._surface);

            this._surface.pipe(this._genericSync);
            // Set up event handling: Event on surface -> Emit event on UIElement
            this._surface.pipe(this);
        },

        /**
         * Generates the sync listener and emits the event
         *  
         * @private
         * @method _genSyncListener
         * @param {String} syncKey
         * @return {function} function emitting the sync key and 
         *   event
         */
        _genSyncListener: function _genSyncListener(syncKey) {
            return function(event) {
                this.emit(syncKey, event);
            };
        },

        /**
         * Initializes the inputs by piping to a generic sync 
         *
         * @private
         * @method _initInputs 
         */
        _initInputs: function _initInputs() {
            this._genericSync = new GenericSync(Object.keys(syncRegister));
            this._surface.pipe(this._genericSync);
        },

        /**
         * Adds a sync
         *  
         * @private
         * @method _addSync 
         * @param {String} syncName name of sync to add
         */
        _addSync: function(syncName) {
            if(!(syncName in this._genericSync._syncs)) {
                var sync = {};
                sync[syncName] = syncRegister[syncName];
                this._genericSync.addSync(sync);
            }
        },

        /**
         * Adds event listener on UIElement
         *  
         * @method on 
         * @param {String} event name of event 
         * @param {Function} action callback function
         */
        on: function on(event, action) {
            // Handle registered events
            var eventListItem = eventList[event];
            if(eventListItem) {
                for(var i = 0; i < eventListItem.length; i++) {
                    var eventObj = eventListItem[i];

                    var syncType = eventObj.syncType;
                    if(syncType !== null) {
                        this._addSync(syncType);
                        this._genericSync._syncs[syncType].on(eventObj.eventName, action);
                    } else {
                        // 'Native' events (e.g., 'click')
                        this._callSuper(UIBase, 'on', eventObj.eventName, action);
                    }
                }
            } else {
                // Custom events
                this._callSuper(UIBase, 'on', event, action);
            }
        },
        
        /**
         * Removes event listener on UIElement
         *  
         * @method off 
         * @param {String} event name of event 
         * @param {Function} action callback function
         */
        off: function off(event, action) {
            var eventListItem = eventList[event];
            if(eventListItem) {
                for(var i = 0; i < eventListItem.length; i++) {
                    var eventObj = eventListItem[i];

                    var syncType = eventObj.syncType;
                    if(syncType !== null) {
                        this._genericSync._syncs[syncType].removeListener(eventObj.eventName, action);
                    } else {
                        // 'Native' events (e.g., 'click')
                        this._callSuper(UIBase, 'off', eventObj.eventName, action);
                    }
                }
            } else {
                // Custom events
                this._callSuper(UIBase, 'off', event, action);
            }
        }
    });

    // Add aliases
    UIElement.addListener    = UIElement.on;
    UIElement.removeListener = UIElement.off;

    module.exports = UIElement;
});
