define(function(require, exports, module) {
    var UIStretchBox = require('containers/UIStretchBox'),
        UIElement = require('core/UIElement'),
        UIApp = require('containers/UIApplication'),
        Surface = require('famous/core/Surface'),
        UIButton = require('controls/UIButton');

    document.body.style.backgroundColor = "black";

    //////////////////////////////////////////////////////////////////////
    // DECLARE VARIABLES
    //////////////////////////////////////////////////////////////////////

    var COLORS = [
        'rgba(174,129,255,1)',
        'rgba(230,219,116,1)',
        'rgba(166,226,46,1)',
        'rgba(190,214,255,1)',
        'rgba(207,191,173,1)',
        'rgba(190,214,255,1)',
        'rgba(255,0,127,1)'],
        STRETCHBOXELEMENTS = 5,
        maxElSize = 100,
        elements = [];

    //////////////////////////////////////////////////////////////////////
    // CREATE SEQUENCE AND FILL WITH ELEMENTS THAT CHANGE SIZE
    //////////////////////////////////////////////////////////////////////


    var stretchBox = new UIStretchBox({
        direction: 'y'
    });

    var stretchBox2 = new UIStretchBox({
        direction: 'x'
    });
    
    var stretchBox3 = new UIStretchBox({
        direction: 'y'
    });

    fillStretchBox(stretchBox);
    fillStretchBox(stretchBox2);
    fillStretchBox(stretchBox3);

    stretchBox.addChildAt(stretchBox2, 2);
    stretchBox2.addChildAt(stretchBox3, 3);

    var sizeInterval = setInterval(randomSizeChange.bind(null, stretchBox), 1000);
    var sizeInterval = setInterval(randomSizeChange.bind(null, stretchBox2), 1000);
    var sizeInterval = setInterval(randomSizeChange.bind(null, stretchBox3), 1000);

    // var removeInterval = setInterval(randomRemove.bind(null, stretchBox), 1000);

    //////////////////////////////////////////////////////////////////////
    // CREATE APP AND ADD CHILDREN
    //////////////////////////////////////////////////////////////////////


    var app = new UIApp({
        children: [
            stretchBox
        ]
    });

    //////////////////////////////////////////////////////////////////////
    // HELPER FUNCTIONS
    //////////////////////////////////////////////////////////////////////

    function randomRemove (stretchBox) {
        if(stretchBox._children.length){
            var randomInt = Math.round(Math.random() * (stretchBox._children.length - 1));
            var randomElement = stretchBox._children[randomInt];
            stretchBox.removeChild(randomElement);
        } else clearInterval(removeInterval);
    }

    function fillStretchBox (stretchBox) {
        var element,
        randomColor,
        randomSize;

        for (var i = 0; i < STRETCHBOXELEMENTS; i++) {
            randomColor = COLORS[Math.round(Math.random() * (COLORS.length - 1))];
            randomSize = [Math.random() * maxElSize, Math.random() * maxElSize];
            element = new UIElement({
                size: randomSize,
                style: {
                    border: '3px solid ' + randomColor,
                    zIndex: 100
                }
            });
            stretchBox.addChild(element);
        }
    }

    function randomSizeChange (stretchBox) {
        if(stretchBox._children.length){
            var randomChild = stretchBox._children[Math.round((Math.random() * (stretchBox._children.length - 1)))];;
            while(randomChild instanceof UIStretchBox){
                randomChild = stretchBox._children[Math.round((Math.random() * (stretchBox._children.length - 1)))];
            }
            var randomSize = [Math.random() * maxElSize, Math.random() * maxElSize];

            randomChild.setSize(randomSize[0], randomSize[1], {duration: 3000});
        } else clearInterval(sizeInterval);
    }
});