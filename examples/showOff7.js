/* globals define */
define(function(require, exports, module) {
    var UIComponent         = require('core/UIComponent');
    var UIElement           = require('core/UIElement');
    var UIApplication       = require('containers/UIApplication');

    var size = 100;

    var Cube = UIComponent.extend({
        constructor: function(i) {
            this._callSuper(UIComponent, 'constructor', {
                size: [size, size],
                align: [Math.random(), Math.random()],
                origin: [Math.random(), Math.random()]
            });

            this.container = new UIApplication({
                size: [size, size]
            });

            this.container.center();

//            this.super();

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


            this.container.addChild(bottomElement);
            this.container.addChild(topElement);
            this.container.addChild(rightElement);
            this.container.addChild(leftElement);
            this.container.addChild(frontElement);
            this.container.addChild(backElement);

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

            this._addChild(this.container);

            this.constantRotation.apply(this);
            this.constantRepositioning.apply(this);
        },

        constantRepositioning: function constantRepositioning() {
            var duration = 5000*Math.random();

            this.container.setAlign(Math.random(), Math.random(), {
                duration: duration,
                curve: 'spring'
            });

            this.container.setScale(Math.random(), Math.random(), Math.random(), {
                duration: duration,
                curve: 'spring'
            }, constantRepositioning.bind(this));
        },

        constantRotation: function constantRotation() {
            this.container.setRotation(Math.PI*Math.random(), Math.PI*Math.random(), Math.PI*Math.random(), {
                duration: 5000*Math.random(),
                curve: 'spring'
            }, constantRotation.bind(this));
        }
    });

    var app = new UIApplication();

    for (var i = 0; i < 50 ; i++) {
        app.addChild(new Cube(i));
    }
});
