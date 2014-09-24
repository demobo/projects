define(function(require, exports, module) {
    var UIBootstrap = require('containers/UIBootstrap');
    var UIRow = require('containers/UIRow');
    var UIApp = require('containers/UIApplication');
    var UIElement = require('core/UIElement');

    var elementStyle = {
        textAlign: 'center',
        backgroundColor: 'rgba(86,61,124,.15)',
        fontSize: '12px',
        color: '#333',
        paddingTop: '14px',
        border: '1px solid rgba(86,61,124,.2)'
    };

    //////////////////////////////////////////////////////////////////////
    // CREATE APP
    //////////////////////////////////////////////////////////////////////

    var app = new UIApp();

    //////////////////////////////////////////////////////////////////////
    // CREATE ELEMENTS
    //////////////////////////////////////////////////////////////////////

    var elements = generateElements(24);

    //////////////////////////////////////////////////////////////////////
    // DECLARE LAYOUT
    //////////////////////////////////////////////////////////////////////

    //note that the height makes no difference in the layout...
    var layout = new UIBootstrap({
        size: [0.9 * innerWidth, 100],
        rows: [
            [
                elements[0],
                elements[1],
                elements[2],
                elements[3],
                elements[4],
                elements[5],
                elements[6],
                elements[7],
                elements[8],
            ],[
                elements[9],
                elements[10],
                elements[11],
                elements[12],
                elements[13],
                elements[14],
                elements[15]
            ],[
                elements[16],
                elements[17],
                elements[18],
                elements[19],
                elements[20],
                elements[21],
                elements[22],
                elements[23],
            ]
        ]
    });

    //////////////////////////////////////////////////////////////////////
    // ADD LAYOUT TO APP
    //////////////////////////////////////////////////////////////////////

    app.addChild(layout);

    //////////////////////////////////////////////////////////////////////
    // HELPER FUNCTIONS
    //////////////////////////////////////////////////////////////////////

    function generateElements (n) {
        var color;
        var height;
        var randomBlockSize;
        var randomOffset;
        var element;
        var elements = [];

        for (var i = 0; i < n; i++) {
            height = 50;
            randomBlockSize = Math.floor(Math.random() * 3.2) + 1;
            randomOffset = Math.floor(Math.random() * 1.2);
            var element = new UIElement({
                content: randomBlockSize + '-blocks ' + randomOffset + '-offset',
                size: [undefined, height],
                style: elementStyle
            });

            elements.push({
                element: element,
                cols: randomBlockSize,
                offset: randomOffset
            });
        }
        return elements;
    }
});
