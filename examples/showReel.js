/* Quick and dirty showReel. Don't use this as a guideline. */

/*globals define*/
define(function(require, exports, module) {
    var UIDialog            = require('controls/UIDialog');
    var UIElement           = require('core/UIElement');
    var UIComponent         = require('core/UIComponent');
    var Easing              = require('famous/transitions/Easing');
    var Card                = require('controls/UICard');
    var UIButton            = require('controls/UIButton');
    var UIRadioButton       = require('controls/UIRadioButton');
    var Timer               = require('famous/utilities/Timer');
    var ToggleButton        = require('controls/UIToggleButton');
    var CheckBox            = require('controls/UICheckBox');
    var UIApplication       = require('containers/UIApplication');


    var FancyBox = CheckBox.extend({
        constructor: function(options) {
            CheckBox.prototype.constructor.call(this, {
                size: [50, 50]
            });

            this.setOpacity(0.1, {
                duration: 1000,
                curve: Easing.inBounce
            });
            this.setOpacity(1, {
                duration: 1000,
                curve: Easing.inBounce
            });
            this.setAlign([Math.random(), Math.random()], {
                duration: 5000,
                curve: Easing.outElastic
            });
            this.setRotation(Math.PI, Math.PI, Math.PI, {
                duration: 3000,
                curve: Easing.inOutQuad
            }).setRotation(Math.PI, Math.PI, Math.PI/2, {
                duration: 200,
                curve: Easing.inOutQuad
            }).setRotation(Math.PI, Math.PI/2, 0, {
                duration: 200,
                curve: Easing.inOutQuad
            }).setRotation(Math.PI/2, 0, 0, {
                duration: 200,
                curve: Easing.inOutQuad
            }).setRotation(0, 0, 0, {
                duration: 200,
                curve: Easing.inOutQuad
            }, function() {

            }.bind(this));

            var toggleCounter = 0;
            var toggleInterval = setInterval(function () {
                if (toggleCounter++ === 5) {
                    return clearInterval(toggleInterval);
                }
                this.toggle();
            }.bind(this), 500);
        }
    });

    var showReel = new (UIComponent.extend( /** @lends UIComponent.prototype */ {
        constructor: function() {
            UIComponent.prototype.constructor.call(this, {
            });

            // Background
            this.background = new UIElement({
                size: [undefined, undefined],
                style: {
                    background: '#ccc'
                },
                opacity: 0
            });

            this._addChild(this.background);

            // Card
            this.card = new Card({
                align: [0.5, 0.5],
                origin: [0.5, 0.5],
                size: [500, 500],
                opacity: 0,
            });

            this.cardTextElement = new UIElement({
                content: 'I am a card.',
                style: {
                    fontSize: '30px',
                    textAlign: 'center',
                    padding: '1em',
                    boxShadow: '0 2px 100px 0 rgba(0, 0, 0, 0.16)'
                }
            });
            this.card._addChild(this.cardTextElement);

            this.UIRadioButton = new UIRadioButton({
                size: [100, 100],
                opacity: 0
            }).center();

            this.button1 = new UIButton({
                opacity: 0
            }).center();

            this.button2 = new UIButton({
                opacity: 0,
                background: '#d01716'
            }).center();

            this.button3 = new UIButton({
                opacity: 0,
                background: '#00796b'
            }).center();

            this.button4 = new UIButton({
                opacity: 0,
                background: '#6d4c41'
            }).center();

            this.card._addChild(this.UIRadioButton);
            this.card._addChild(this.button1);
            this.card._addChild(this.button2);
            this.card._addChild(this.button3);
            this.card._addChild(this.button4);
            this._addChild(this.card);

            // UIDialog
            this.UIDialog = new UIDialog({
                popupSize: [700, 400],
                opened: false
            });

            this.UIDialog.popup._addChild(new UIElement({
                content: 'Look, I am a UIDialog!',
                style: {
                    fontSize: '30px',
                    padding: '1em',
                    textAlign: 'center',
                    lineHeight: '350px'
                }
            }));

            this._addChild(this.UIDialog);

            Timer.setTimeout(function() {
                this.next(0);
            }.bind(this), 100);
        },

        next: function(state) {
            switch (state) {
                case 0:
                    // Show background
                    this.background.setOpacity(1, {
                        duration: 100,
                        curve: Easing.inEase
                    }, function() {
                        this.next(state+1);
                    }.bind(this));
                    break;
                case 1:
                    this.card.setOpacity(1, {
                        duration: 500,
                        curve: Easing.inExp
                    });
                    this.card.setScale(0, 0, 0);
                    this.card.setScale(1, 1, 1, {
                        duration: 500,
                        curve: Easing.outElastic
                    }, function() {
                        this.card.setRotation(0, 0, Math.PI*6, {
                            duration: 1000,
                            curve: Easing.inOutQuad
                        });
                        this.card.setRotation(0, 0, 0, {
                            duration: 1000,
                            curve: Easing.inOutQuad
                        }, function() {
                            this.next(state+1);
                        }.bind(this));
                    }.bind(this));
                    this.setDelay(1000);
                    break;
                case 2:
                    this.cardTextElement.setContent('This is a radio button.');
                    this.UIRadioButton.setOpacity(1, {
                        duration: 1000,
                        curve: Easing.inEase
                    }, function() {
                        this.UIRadioButton.toggle();
                        var toggleCounter = 0;
                        var toggleInterval = Timer.setInterval(function () {
                            if (toggleCounter++ === 3) {
                                this.UIRadioButton.setOpacity(0, {
                                    duration: 100,
                                    curve: Easing.inQuad
                                }, function() {
                                    this.next(state+1);
                                }.bind(this));
                                return clearInterval(toggleInterval);
                            }
                            this.UIRadioButton.toggle();
                        }.bind(this), 500);
                    }.bind(this));
                    break;
                case 3:
                    this.cardTextElement.setContent('Here are more buttons.<br>' +
                                'They might look like Polymer Elements, but they are<br>' +
                                ' done entirely in Famo.us.');
                    this.button1.setOpacity(1);
                    this.button2.setOpacity(1);
                    this.button3.setOpacity(1);
                    this.button4.setOpacity(1);
                    this.button1.setPosition(0, 200, 0, {
                        duration: 300,
                        curve: Easing.outBounce
                    }, function() {
                        this.button2.setPosition(0, 150, 0, {
                            duration: 300,
                            curve: Easing.outBounce
                        }, function() {
                            this.button3.setPosition(0, 100, 0, {
                                duration: 300,
                                curve: Easing.outBounce
                            }, function() {
                                this.button4.setPosition(0, 50, 0, {
                                    duration: 300,
                                    curve: Easing.outBounce
                                });

                                Timer.setTimeout(function() {
                                    this.button1.setOpacity(0, {
                                        duration: 1000,
                                        curve: Easing.inQuad
                                    });
                                    this.button2.setOpacity(0, {
                                        duration: 1000,
                                        curve: Easing.inQuad
                                    });
                                    this.button3.setOpacity(0, {
                                        duration: 1000,
                                        curve: Easing.inQuad
                                    });
                                    this.button4.setOpacity(0, {
                                        duration: 1000,
                                        curve: Easing.inQuad
                                    });
                                    this.next(state+1);
                                }.bind(this), 3000);
                            }.bind(this));
                        }.bind(this));
                    }.bind(this));
                    break;
                case 4:
                    this.cardTextElement.setContent('But there is so much more...');
                    this.card.setDelay(2000).setOpacity(0, {
                        duration: 100,
                        curve: Easing.inQuad
                    }, function() {
                        this.next(state+1);
                    }.bind(this));
                    break;
                case 5:
                    this.UIDialog.show(undefined).setDelay(3000).setAlign([1, 0], {
                        duration: 1000,
                        curve: Easing.outBounce
                    }, function() {
                        this.next(state+1);
                    }.bind(this));
                    break;
                case 6:
                    var fancyBoxes = [];

                    var fancyBoxInterval = setInterval(function() {
                        if (fancyBoxes.length === 10) {
                            clearInterval(fancyBoxInterval);
                            setTimeout(function() {
                                for (var i = 0; i < fancyBoxes.length; i++) {
                                    fancyBoxes[i].setAlign([0.5, 0.5], {
                                        duration: 100,
                                        curve: Easing.outElastic
                                    });
                                }
                                this.next(state+1);
                            }.bind(this), 1000);
                        }
                        var fancyBox = new FancyBox();
                        fancyBoxes.push(fancyBox);
                        this._addChild(fancyBox);
                    }.bind(this), 300);
                    break;
                case 7:
                    location.reload();
                    break;
            }
        }
    }))();


    var app = new UIApplication({
        children: [
            showReel
        ]
    });





    // var CollapseableList = UIComponent.extend( /** @lends UIComponent.prototype */ {
    //     constructor: function() {
    //         UIComponent.prototype.constructor.call(this);
    //     }
    // });
    //

    //
    // var fancyBoxes = [];
    //
    // var fancyBoxInterval = setInterval(function() {
    //     if (fancyBoxes.length === 5) {
    //         clearInterval(fancyBoxInterval);
    //     }
    //     var fancyBox = new FancyBox({
    //         origin: [0.5, 0.5],
    //         style: {
    //             background: '#333'
    //         },
    //         classes: ['backfaceVisibility']
    //     });
    //     fancyBoxes.push(fancyBox);
    //     showReel._addChild(fancyBox);
    // }, 300);
    //
    // setTimeout(function() {
    //     for (var k = 0; k < fancyBoxes.length; k++) {
    //         var fancyBox = fancyBoxes[k];
    //         fancyBox.setRotation(Math.PI/2.5, 0, 0, {
    //             duration: 300,
    //             curve: Easing.inBounce
    //         }, function() {
    //             fancyBox.setPosition(0, 10*k, 10*k);
    //         });
    //     }
    // }, 8000);


    //
    //
    // // UIDialog
    // var UIDialog = new UIDialog({
    //     popupSize: [700, 100],
    //     opened: false
    // });
    // showReel._addChild(UIDialog);
    //
    // UIDialog.popup._addChild(new UIElement({
    //     content: 'Welcome to the future.',
    //     style: {
    //         padding: '20px',
    //         textAlign: 'center',
    //         fontSize: '20px',
    //         lineHeight: '60px'
    //     }
    // }));
    // UIDialog.show();
    //
    //
    // // Text slides
    // var slides = [
    //     'It\'s as easy as jQuery.',
    //     'But as performant as Famo.us'
    // ];
    //
    // var slideElement = new (UIElement.extend( /** @lends UIElement.prototype */ {
    //     constructor: function() {
    //         UIElement.prototype.constructor.apply(this, arguments);
    //     }
    // }))({
    //     content: '',
    //     opacity: 0,
    //     style: {
    //         textAlign: 'center',
    //         lineHeight: window.innerHeight + 'px'
    //     }
    // });
    // showReel._addChild(slideElement);

    // Show UIDialog
    // UIDialog.show(undefined, function() {
    //     setTimeout(function() {
    //         UIDialog.setAlign([1, 0], {
    //             duration: 1000,
    //             curve: Easing.outBounce
    //         }, function() {
    //             for (var j = 0; j < slides.length; j++) {
    //                 setTimeout(function() {
    //                     slideElement.setOpacity(0, {
    //                         duration: 100,
    //                         curve: Easing.inBounce
    //                     }, function() {
    //                         slideElement.setContent(slides.shift());
    //                     });
    //                     slideElement.setOpacity(1, {
    //                         duration: 100,
    //                         curve: Easing.inBounce
    //                     });
    //                 }, 4000*j);
    //             }
    //         });
    //     }, 1500);
    // });

});
