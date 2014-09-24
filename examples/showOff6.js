/* globals define */
define(function(require, exports, module) {
    var UIApplication       = require('containers/UIApplication');
    var UIElement           = require('core/UIElement');

    var size = 200;

    var app = new UIApplication({
        size: [size, size]
    }).center();

    var bottomElement = new UIElement({
        classes: ['backfaceVisibility'],
        size: [size, size],
        content: 'bottom',
        style: {
            background: '#e51c23'
        },
        opacity: 0.5
    }).center();

    var topElement = new UIElement({
        classes: ['backfaceVisibility'],
        size: [size, size],
        content: 'top',
        style: {
            background: '#e91e63'
        },
        opacity: 0.5
    }).center();

    var leftElement = new UIElement({
        classes: ['backfaceVisibility'],
        size: [size, size],
        content: 'left',
        style: {
            background: '#9c27b0'
        },
        opacity: 0.5
    }).center();

    var rightElement = new UIElement({
        classes: ['backfaceVisibility'],
        size: [size, size],
        content: 'right',
        style: {
            background: '#673ab7'
        },
        opacity: 0.5
    }).center();

    var frontElement = new UIElement({
        classes: ['backfaceVisibility'],
        size: [size, size],
        content: 'front',
        style: {
            background: '#3f51b5'
        },
        opacity: 0.5
    }).center();

    var backElement = new UIElement({
        classes: ['backfaceVisibility'],
        size: [size, size],
        content: 'back',
        style: {
            background: '#5677fc'
        },
        opacity: 0.5
    }).center();

    app.addChild(bottomElement);
    app.addChild(topElement);
    app.addChild(rightElement);
    app.addChild(leftElement);
    app.addChild(frontElement);
    app.addChild(backElement);

    bottomElement.setRotation(-Math.PI/2, Math.PI, 0);
    bottomElement.setPosition(0, size / 2, 0);

    topElement.setRotation(Math.PI/2, 0, 0);
    topElement.setPosition(0, -size / 2, 0);

    leftElement.setRotation(0, -Math.PI/2, 0);
    leftElement.setPosition(-size / 2, 0, 0);

    rightElement.setRotation(0, Math.PI/2, 0);
    rightElement.setPosition(size / 2, 0, 0);

    frontElement.setRotation(0, 0, 0);
    frontElement.setPosition(0, 0, size / 2);

    backElement.setRotation(Math.PI, 0, Math.PI);
    backElement.setPosition(0, 0, -size / 2);

    app.setRotation(Math.PI, Math.PI, Math.PI, {
        duration: 5000,
        curve: 'spring'
    });
    app.setPosition(0, 0, -500, {
        duration: 5000,
        curve: 'spring'
    });

    function constantOriginChange() {
        app.setOrigin(Math.random(), Math.random(), {
            duration: 1000,
            curve: 'spring'
        }, constantOriginChange);
    }

    constantOriginChange();
});
