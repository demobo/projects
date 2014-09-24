define(function(require, exports, module) {
    var inputField = require('controls/UIInputField');
    module.exports = new inputField({
      size: [300, 50],
      origin: [0.5, 0.5],
      align: [0.5, 0.5],
      fontSize: '18px',
      color: 'purple',
      placeholder: 'Type Something...'
    });
});
