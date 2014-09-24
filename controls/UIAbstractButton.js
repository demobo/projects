/**
 * @deprecated use UIButtonBase instead
 */

define(function(require, exports, module) {

  var UIComponent = require('../core/UIComponent');
  var UIElement = require('../core/UIElement');

  var UIAbstractButton = UIComponent.extend( /** @lends UIComponent.prototype */ {
    constructor: function(options) {
      this._callSuper(UIComponent, 'constructor', options);

      this.buttonBackground = new UIElement(options);
      this._addChild(this.buttonBackground);

      _bindEvents.call(this);
    }
  });

  function _bindEvents() {
    this.buttonBackground.on('click', function() {
      this.emit('click');
    }.bind(this));
  }

  module.exports = UIAbstractButton;
});
