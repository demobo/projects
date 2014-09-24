/* globals define */
define(function(require, exports, module) {
    var UIApplication = require('containers/UIApplication');
    var UIElement = require('core/UIElement');


    var app = new UIApplication({
        children: [
            new UIElement({
                    id:'square',
                    size:[200,200],
                    on: {
                        click: function() {
                            console.log('help me I am declarative');
                        }
                    },
                    style: {
                        background: '#333'
                    }
                })
        ]
    });

    app.getByID('square').on('click', function()
    {
        console.log('you found me via id!');
    });

});
