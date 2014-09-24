define(function(require, exports, module) {
    var UIElement           = require('core/UIElement');

    var UIContainer         = require('containers/UIContainer');
    var UIApplication       = require('containers/UIApplication');
    var UICard              = require('containers/UICard');
    var Button              = require('controls/UIButton');
    var Slider              = require('controls/UISlider');
    var _Toast              = require('controls/UIToast');
    var _ToggleButton       = require('controls/UIToggleButton');
    var UIAbstractButton    = require('controls/UIAbstractButton');
    var UIDialog            = require('controls/UIDialog');
    var UIFab               = require('controls/UIFab');
    var InputField          = require('controls/UIInputField');
    var UIPlus              = require('controls/UIPlus');
    var UIRadioGroup        = require('controls/UIRadioGroup');
    var UICheckboxGroup     = require('controls/UICheckboxGroup');
    var UIToggleButton      = require('controls/UIToggleButton');

    var card = new UICard({
        origin: [0.5, 0.5],
        align: [0.3, 0.08],
        size: [800, 60],
    });

    var cardTextElement = new UIElement({
        content: 'Famo.us UI Components',
        style: {
            fontSize: '28px',
            textAlign: 'center',
            padding: '.25em',
        }
    });

    card.addChild(cardTextElement);

    var slider = new Slider({
        origin: [0.5, 0.5],
        align: [0.5, 0.78],
    });
    slider.setSize(300, 40);
    slider.on('change', function (argument) {
        UIFab.setRotation(0, 0, 360*argument.value/100 * Math.PI/180);
    });

    var slider2 = new Slider({
        origin: [0.5, 0.5],
        align: [0.5, 0.85],
        thumbColor: '#d01716'
    });
    slider2.setSize(300, 40);
    slider2.on('change', function(argument){
        card2.setSize(150 + argument.value, 150 + argument.value);
        cardTextElement2.setStyle({
            fontSize: 12+argument.value/11 +'px'
        });
    });

    var slider3 = new Slider({
        origin: [0.5, 0.5],
        align: [0.5, 0.92],
        max: 550,
        thumbColor: '#5677fc',
    });
    slider3.setSize(300, 40);

    slider3.on('change', function(argument){
        card.setPosition( argument.value, 0.08);
    });

    var _toast = new _Toast({
        size: [300, 50],
        content: 'I am a toast'
    });

    var toggleButton = new UIToggleButton({
        size: [100, 20],
        align: [0.2, 0.80],
        origin: [0.5, 0.5],
        thumbOnColor: '#009688',
        barOnColor: '#009688'
    });

    var toggleButton2 = new UIToggleButton({
        size: [100, 20],
        align: [0.2, 0.85],
        origin: [0.5, 0.5],
        thumbOnColor: '#e51c23',
        barOnColor: '#e51c23'
    });
    var toggleButton3 = new UIToggleButton({
        size: [100, 20],
        align: [0.2, 0.9],
        origin: [0.5, 0.5],
        thumbOnColor: '#ffc107',
        barOnColor: '#ffc107'
    });

    var radioGroup = new UIRadioGroup({
        origin: [0, 0],
        align: [0.4, 0.25],
        size: [200, 300],
        labels: ['Orange', 'Yellow', 'Green'],
        colors: ['#ff5722', '#ffeb3b', '#259b24']
    });

    var UICheckboxGroup = new UICheckboxGroup({
        origin: [0, 0],
        align: [0.7, 0.25],
        size: [200, 300]
    });

    var card2 = new UICard({
        origin: [0.5, 0.5],
        align: [0.8, 0.7],
        size: [150, 150],
    });
    var cardTextElement2 = new UIElement({
        content: '4 weeks <br> <br> 40-60% less code <br> <br> More documentation than all of Famo.us combined',
        style: {
            fontSize: '12px',
            textAlign: 'center',
            padding: '1em',
        }
    });
    card2._addChild(cardTextElement2);

    var button = new Button({
        origin: [0.5, 0.5],
        align: [0.2, 0.25],
        size: [100, 40],
        content: 'Pop me',
        background: '#03a9f4'
    });

    var button1 = new Button({
        origin: [0.5, 0.5],
        align: [0.2, 0.35],
        size: [100, 40],
        content: 'Click me',
        background: '#673ab7'
    });

    var button2 = new Button({
        origin: [0.5, 0.5],
        align: [0.2, 0.45],
        size: [100, 40],
        content: 'Touch me',
        background: '#d01716'
    });

    button.on('click', function(){
        _toast.emit('pop');
    });

    button2.on('click', function(){
        UIDialog.show();
    });

    var UIFab = new UIFab({
        origin: [0.5, 0.5],
        align: [0.2, 0.6]
    });

    var inputField = new InputField({
        origin: [0.5, 0.5],
        align: [0.5, 0.6],
        size: [300, 40]
    });

    var mainApp = new UIApplication({
        children: [ card, card2, button, button1, button2,
                    slider, slider2, slider3, _toast,
                    radioGroup, UIFab, inputField, UICheckboxGroup,
                    toggleButton, toggleButton2, toggleButton3  ]
    });


    // FIXME zIndex!?
    var UIDialog = new UIDialog({
        opened: false
    });

    var dialogText = new UIElement({
        content: 'I am a UIDialog',
        style: {
            textAlign: 'center',
            lineHeight: '200px'
        }
    });
    UIDialog.popup._addChild(dialogText);

    mainApp.addChild(UIDialog);
});
