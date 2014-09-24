define(function(require, exports, module) {
    var InputFieldMultiLine = require('controls/InputFieldMultiLine');
    module.exports = new InputFieldMultiLine({
      size: [300, 50],
      origin: [0.5, 0.5],
      align: [0.5, 0.5],
      fontSize: '18px',
      // color: 'red',
      placeholder: 'Type Something...'
    });
});
