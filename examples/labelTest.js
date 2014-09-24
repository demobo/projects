/* globals define */
define(function(require, exports, module) {
    document.getElementsByTagName('html')[0].style.background = '#000';

    var UIApplication = require('containers/UIApplication');

    var UIContainer = require('containers/UIContainer');
    var Prism = require('RectangularPrism');
    var UIElement = require('core/UIElement');
    var UIButton = require('controls/UIButton');
    var UIStretchBox = require('containers/UIStretchBox');
    var UISlider = require('controls/UISlider');
    var UILabel = require('controls/UILabel');


    var app = new UIApplication({
    	children: [
    		new UILabel({
    			id: 'testLabel',
    			style: { color:'#fff' },
    			position: [100,100],
    			text:'blarg!'
    		}),
    		new UIButton({
    			content: 'Measure the Label',
    			on: {
    				click: function() {
    					console.log(app.getByID('testLabel').getSize());
    				}
    			}
    		}),
    		new UIButton({
    			content: 'Change the text',
    			position: [200, 0],
    			on: {
    				click: function() {
    					var label = app.getByID('testLabel');
    					label.setText(label.getText()+' blarg!');
    				}
    			}
    		})

    	]
    })
});