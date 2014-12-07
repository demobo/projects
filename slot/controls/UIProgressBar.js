define(function(require, exports, module) {
  var UIElement   = require('../core/UIElement');
  var UIComponent = require('../core/UIComponent');

  var UIProgressBar = UIComponent.extend( /** @lends UIComponent.prototype */ {
    constructor: function(options) {
      this._callSuper(UIComponent, 'constructor', options);

      // Values exposed to user via options object
      this.vale          = this.options.value         || 0;
      this.max           = this.options.max           || 100;
      this.inactiveColor = this.options.inactiveColor || '#9e9e9e';
      this.bufferColor   = this.options.bufferColor   || '#a3e9a4';
      this.activeColor   = this.options.activeColor   || '#259b24';

      // Default bar values
      this._barHeight    = 3;

      this._createInactiveBar();
      this._createBufferBar();
      this._createActiveBar();
      this._layout();
      // this._bindEvents();
    },

    _createInactiveBar: function _createInactiveBar() {
      this.inactiveBar = new UIElement();
      this.inactiveBar.setStyle({
        backgroundColor: this.inactiveColor
      });
      this._addChild(this.inactiveBar);
    },

    _createBufferBar: function _createBufferBar() {
      this.bufferBar = new UIElement();
      this.bufferBar.setStyle({
        backgroundColor: this.bufferColor
      });
      this._addChild(this.bufferBar);
    },

    _createActiveBar: function _createActiveBar() {
      this.activeBar = new UIElement();
      this.activeBar.setStyle({
        backgroundColor: this.activeColor
      });
      this._addChild(this.activeBar);
    },

    _layout: function _layout() {
      var progressBarSize = this.getSize();

      this.inactiveBar.setSize(progressBarSize[0], this._barHeight);
      this.inactiveBar.setPosition(0, (progressBarSize[1] - this._barHeight) / 2, 0);

      this.bufferBar.setSize(0, this._barHeight);
      this.bufferBar.setPosition(0, (progressBarSize[1] - this._barHeight) / 2, 0);

      this.activeBar.setSize(progressBarSize[0] / 4, this._barHeight);
      this.activeBar.setPosition(0, (progressBarSize[1] - this._barHeight) / 2, 0);
    }
  });

  module.exports = UIProgressBar;
});
