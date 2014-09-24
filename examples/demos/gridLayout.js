define(function(require, exports, module) {
    var UIBootstrap = require('containers/UIBootstrap');
    var UIRow = require('containers/UIRow');
    var UIApp = require('containers/UIApplication');
    var UIElement = require('core/UIElement');

    var header;
    var footer;
    var bodyElements = [];
    var nestedElements = [];
    var COLORS = [
        'rgba(174,129,255,1)',
        'rgba(230,219,116,1)',
        'rgba(166,226,46,1)',
        'rgba(190,214,255,1)',
        'rgba(207,191,173,1)',
        'rgba(190,214,255,1)',
        'rgba(255,0,127,1)'
    ];
    
    //////////////////////////////////////////////////////////////////////
    // CREATE APP
    //////////////////////////////////////////////////////////////////////

    var app = new UIApp();

    //////////////////////////////////////////////////////////////////////
    // CREATE ELEMENTS
    //////////////////////////////////////////////////////////////////////

    generateElements();

    //////////////////////////////////////////////////////////////////////
    // DECLARE LAYOUT
    //////////////////////////////////////////////////////////////////////

    //note that the height makes no difference in the layout...
    var layout = new UIBootstrap({
        width: 0.8,
        origin: [0.5, 0],
        align: [0.5, 0],
        rows: [
            [
                {
                    element: bodyElements[0],
                    offset: { sm: 0 },
                    cols: { lg: 3, md: 6 }
                },
                {
                    element: bodyElements[1],
                    offset: { sm: 0 },
                    cols: { lg: 3, md: 6 }
                },
                {
                    element: bodyElements[2],
                    offset: { sm: 0 },
                    cols: { lg: 3, md: 6 }
                },
                {
                    element: bodyElements[3],
                    offset: { sm: 0 },
                    cols: { lg: 3, md: 6 }
                },
                {
                    element: bodyElements[4],
                    offset: { sm: 0 },
                    cols: { lg: 3, md: 6 }
                },
                {
                    element: [
                        {
                            element: nestedElements[0],
                            offset: { sm: 0 },
                            cols: { lg: 6 }
                        },
                        {
                            element: nestedElements[1],
                            offset: { sm: 0 },
                            cols: { lg: 6 }
                        }
                    ],
                    offset: { sm: 0 },
                    cols: { lg: 3, md: 6 }
                },
                {
                    element: bodyElements[6],
                    offset: { sm: 0 },
                    cols: { lg: 3, md: 6 }
                },
            ],
            [
                { element: header, offset: { sm: 0 }, cols: { lg: 12 } }
            ],
            [
                { element: footer ,offset: { sm: 0 }, cols: { lg: 12 } },
            ],
        ]
    });

    //////////////////////////////////////////////////////////////////////
    // ADD LAYOUT TO APP
    //////////////////////////////////////////////////////////////////////

    app.addChild(layout);

    //////////////////////////////////////////////////////////////////////
    // GENERATE ELEMENTS
    //////////////////////////////////////////////////////////////////////

    function generateElements () {
        header = new UIElement({
            content: 'This is a header',
            size: [undefined, 120],
            style: {
                fontFamily: 'Helvetica Neue',
                textAlign: 'center',
                fontSize: '22px',
                paddingTop: '32px',
                backgroundColor: COLORS[0]
            }
        })

        footer = new UIElement({
            content: 'This is a footer',
            size: [undefined, 120],
            style: {
                fontFamily: 'Helvetica Neue',
                textAlign: 'center',
                fontSize: '22px',
                paddingTop: '32px',
                backgroundColor: COLORS[0]
            }
        });

        for (var i = 0; i < 8; i++) {
            bodyElements.push(new UIElement({
                content: i.toString(),
                size: [undefined, 200],
                style: {
                    fontFamily: 'Helvetica Neue',
                    textAlign: 'center',
                    fontSize: '45px',
                    paddingTop: '70px',
                    backgroundColor: COLORS[i]
                }
            }))
        }

        for (var i = 0; i < 2; i++) {
            nestedElements.push(new UIElement({
                content: "HALF COL",
                size: [undefined, 200],
                style: {
                    fontFamily: 'Helvetica Neue',
                    textAlign: 'center',
                    fontSize: '45px',
                    paddingTop: '70px',
                    backgroundColor: COLORS[i]
                }
            }))
        }
    }
});
