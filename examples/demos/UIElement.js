define(function(require, exports, module) {
    var ElementUI = require('controls/UIElement');
    var Transform = require('famous/core/Transform');
    
    var boxElement = new ElementUI({
        size: [300, 300],
        content: 'yolo',
        classes: ['button?'],
        style: {
          backgroundColor: '#9c9c9c'
        }
    });

    boxElement.setTransform(Transform.translate(400, 400, 0), {
      duration: 3000, 
      curve: 'linear'
    });

    module.exports = boxElement; 
});
