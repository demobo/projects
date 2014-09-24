define(function(require, exports, module) {
    var UIStretchBox = require('containers/UIStretchBox');
    var UIElement = require('core/UIElement');
    var App = require('containers/UIApplication');

    var COLORS = ['AE81FF', 'E6DB74', 'A6E22E', 'BED6FF', 'CFBFAD', 'BED6FF', 'FF007F'],
    SEQUENCEELEMENTS = 6,
    SEQUENCES = 5,
    elements = [],
    element,
    randomColor,
    childSequence;

    var app = new App();
    var sequence = new UIStretchBox({
        direction: 'x'
    });
    var background = new UIElement({
        style: {
            backgroundColor: 'black'
        }
    });
    
    app.addChild(background);
    app.addChild(sequence);
    addSequences(sequence);

    function addSequences (parentSequence) {
        var childSequence;

        for (var i = 0; i < SEQUENCES; i++) {
            childSequence = new UIStretchBox({
                direction: 'y'
            });
            fillSequence(childSequence, true, 10);
            parentSequence.addChild(childSequence);

            setInterval(randomSizeChange.bind(null, childSequence), 500);
        }
    }

    function fillSequence (sequence, addSequences, children) {
        var element,
        randomColor,
        randomInt = Math.round(Math.random() * (SEQUENCEELEMENTS - 1));

        for (var i = 0; i < children; i++) {
            randomColor = hexToRGB(COLORS[Math.round(Math.random() * (COLORS.length - 1))]);
            if(randomInt === i && addSequences){
                element = new UIStretchBox({
                    direction: 'x'
                });
                fillSequence(element, false, 3);
                setInterval(randomSizeChange.bind(null, element), 500);
            } else {
                element = new UIElement({
                    size: [50, 50],
                    style: {
                        border: '3px solid rgba(' + randomColor + ', 1)',
                    }
                });
            }
            sequence.addChild(element);
        }
    }

    function randomSizeChange (sequence) {
        var children = sequence.getChildren();
        var randomChild = children[Math.floor((Math.random() * children.length))];

        while (randomChild instanceof UIStretchBox != false) {
            randomChild = children[Math.floor((Math.random() * children.length))];
        }
        var randomSize = [Math.random() * 100, Math.random() * 100];

        randomChild.setSize(randomSize[0], randomSize[1], {duration: 1000});
    }

    function hexToRGB(h) {return '' + hexToR(h) + ',' + hexToG(h) + ',' + hexToB(h)};
    function hexToR(h) {return parseInt(h.substring(0,2),16)}
    function hexToG(h) {return parseInt(h.substring(2,4),16)}
    function hexToB(h) {return parseInt(h.substring(4,6),16)}
});