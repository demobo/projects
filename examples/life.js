/* globals define */
define(function(require, exports, module) {
    document.getElementsByTagName('html')[0].style.background = '#000';
    var UIApplication = require('containers/UIApplication');
    var UIContainer = require('containers/UIContainer');
    var Prism = require('RectangularPrism');
    var UIElement = require('core/UIElement');
    var UIComponent = require('core/UIComponent');
    var UIButton = require('controls/UIButton');
    var UIStretchBox = require('containers/UIStretchBox');
    var UISlider = require('controls/UISlider');
    var UILabel = require('controls/UILabel');
    window.Entity = require('famous/core/Entity');

    var mainContainer = window.container = new UIContainer({
        id: 'mainContainer',
        position: [600, 100, -500]
    });

    var parentThreshold = 2; // live cells needed to "birth" a new live cell
    var lonelinessThreshold = 2; // adjacent live cells needed to sustain a live cell
    var overcrowdingThreshold = 6; // adjacent live cells needed to kill a live cell


    var app = new UIApplication({
        style: {
            backgroundColor: '#000'
        },
        children: [
            new UIElement({
                style: {
                    cursor: 'move'
                },
                on: {
                    dragUpdate: function(event) {
                        var previousRotation = mainContainer.getRotation();
                        mainContainer.setRotation(previousRotation[0] + (event.delta[1] / 100), previousRotation[1] + (event.delta[0] / 100), previousRotation[2]);

                    },
                    scrollUpdate: function(event) {
                        mainContainer._translateState.halt();
                        var previousZ = mainContainer.getPosition()[2];
                        var newZ = previousZ - event.position[1] / 10;
                        newZ = newZ <= 100 ? newZ : 100;
                        newZ = newZ >= -10000 ? newZ : -10000;

                        mainContainer.setPosition(600, 100, newZ);
                    }
                }
            }),
            mainContainer,
            new UIButton({
                content: 'Run Step',
                on: {
                    click: runStep
                }
            }),
            new UIButton({
                id: 'playButton',
                content: 'Play',
                position: [200, 0],
                on: {
                    click: play
                }
            }),
            new UIButton({
                id: 'pauseButton',
                content: 'Pause',
                position: [400, 0],
                on: {
                    click: pause 
                }
            }),
            new UIStretchBox({
                position: [20, 300],
                direction: 'y',
                padding: 20,
                children: [
                    new UILabel({
                        id: 'birthLabel',
                        style: {
                            color: '#eaeaea'
                        },
                        text: birthLabelText()
                    }),
                    new UISlider({
                        size: [250, 20],
                        min: 0,
                        max: 10,
                        value: parentThreshold,
                        on: {
                            change: function(p_evt) {
                                parentThreshold = p_evt.value;
                                app.getByID('birthLabel').setText(birthLabelText());
                            }
                        }
                    }),
                    new UIComponent({
                        size: [0, 10]
                    }), // good old fashioned spacer

                    new UILabel({
                        id: 'lonelinessLabel',
                        style: {
                            color: '#eaeaea'
                        },
                        text: lonelinessLabelText()
                    }),
                    new UISlider({
                        size: [250, 20],
                        min: 0,
                        max: 10,
                        value: lonelinessThreshold,
                        on: {
                            change: function(p_evt) {
                                lonelinessThreshold = p_evt.value;
                                app.getByID('lonelinessLabel').setText(lonelinessLabelText());
                            }
                        }
                    }),
                    new UIComponent({
                        size: [0, 10]
                    }), // good old fashioned spacer
                    new UILabel({
                        id: 'crowdingLabel',
                        style: {
                            color: '#eaeaea'
                        },
                        text: crowdingLabelText()
                    }),
                    new UISlider({
                        size: [250, 20],
                        min: 0,
                        max: 10,
                        value: overcrowdingThreshold,
                        on: {
                            change: function(p_evt) {
                                overcrowdingThreshold = p_evt.value;
                                app.getByID('crowdingLabel').setText(crowdingLabelText());
                            }
                        }
                    }),
                ]
            })
        ]
    });

    function birthLabelText() {
        return 'Birth [0-10] : ' + parentThreshold + ((parentThreshold != 1) ? ' adjacent cells.' : ' adjacent cell.');
    }

    function lonelinessLabelText() {
        return 'Loneliness [0-10] : ' + lonelinessThreshold + ((lonelinessThreshold != 1) ? ' adjacent cells.' : ' adjacent cell.');
    }

    function crowdingLabelText() {
        return 'Crowding [0-10] : ' + overcrowdingThreshold + ((overcrowdingThreshold != 1) ? ' adjacent cells.' : ' adjacent cell.');
    }


    var gridW = 8;
    var gridH = 5;
    var gridD = 5;

    var cellW = 75;
    var cellPadding = 10;
    var cellSpace = cellW+cellPadding;
    
    function createGrid(p_width, p_height, p_depth) {
        var grid = [];

        for (var x = 0; x < p_width; x++) {
            grid.push([]);
            for (var y = 0; y < p_height; y++) {
                var zRow = [];
                for (var z = 0; z < p_depth; z++) {
                    zRow.push(0);
                }
                grid[x].push(zRow);
            }
        }
        return grid;
    }

    var currentGrid = createGrid(gridW, gridH, gridD);
    var nextGrid = createGrid(gridW, gridH, gridD);


    // assumes both are the same dimensions
    function createNextGrid(p_currentGrid, p_nextGrid, p_width, p_height, p_depth) {

        var operationCount = 0;
        var x, y, z, xBefore, xAfter, yBefore, yAfter, zBefore, zAfter, liveNeighborCount;
        var neighborsX, neighborsY, neighborsZ;
        var nextAlive;
        for (x = 0; x < p_width; x++) {
            neighborsX = [(x - 1 + p_width) % p_width, x, (x + 1) % p_width];
            for (y = 0; y < p_height; y++) {
                neighborsY = [(y - 1 + p_height) % p_height, y, (y + 1) % p_height];
                for (z = 0; z < p_depth; z++) {
                    neighborsZ = [(z - 1 + p_depth) % p_depth, z, (z + 1) % p_depth];
                    nextAlive = -1;
                    liveNeighborCount = 0;
                    var currenlyAlive = p_currentGrid[x][y][z];
                    for (var nX = 0; nX < 3; nX++) {
                        for (var nY = 0; nY < 3; nY++) {
                            for (var nZ = 0; nZ < 3; nZ++) {
                                if (nX != 1 || nY != 1 || nZ != 1) {
                                    liveNeighborCount += p_currentGrid[neighborsX[nX]][neighborsY[nY]][neighborsZ[nZ]];
                                    if (!currenlyAlive && liveNeighborCount >= parentThreshold) {
                                        //console.log('Giving Birth!');
                                        nextAlive = 1;
                                        nX = nY = nZ = 4; // super break
                                    } else if (currenlyAlive && liveNeighborCount >= overcrowdingThreshold) {
                                        //console.log('Too crowded, dying!');
                                        nextAlive = 0;
                                        nX = nY = nZ = 4; // super break
                                    }
                                }
                            }
                        }
                    }
                    if (nextAlive == -1) {
                        // not found yet
                        if (currenlyAlive && liveNeighborCount<=lonelinessThreshold) {
//console.log('Lonely, dying!');                                        
                            nextAlive = 0;
                        } else {
                            nextAlive = currenlyAlive;
                        }
                    }
                    if (currenlyAlive != nextAlive) {
                        operationCount++;
                        if (currenlyAlive) {
                            killCell(p_nextGrid, x, y, z);
                        } else {
                            birthCell(p_nextGrid, x, y, z);
                        }
                    } else {
                        p_nextGrid[x][y][z] = currenlyAlive;
                    }
                }
            }
        }
        console.log('Total ops: ' + operationCount);
    }

    function randoColor() {
        return 'rgba(' +
            Math.floor(Math.random() * 255) +
            ', ' +
            Math.floor(Math.random() * 255) +
            ', ' +
            Math.floor(Math.random() * 255) +
            ', 0.5)';
    }

    function birthCell(p_grid, p_x, p_y, p_z) {
        //console.log('birthing ' + p_x + ' ' + p_y + ' ' + p_z);

        p_grid[p_x][p_y][p_z] = 1;

        var cell = new Prism({
            id: p_x + '_' + p_y + '_' + p_z,
            mainContent: ' ',
            backgroundColor: randoColor(),
            size: [cellW, cellW],
            depth: cellW,
            position: [cellSpace * p_x, cellSpace * p_y, cellSpace * p_z],
            opacity:0,
            rotation:[Math.PI/2, 0, 0]
        });
        mainContainer.addChild(cell);
        cell.setDelay(p_z*75+p_y*20+p_x).setOpacity(1, {duration:500, curve:'inOutQuad'});
        cell.setRotation(0,0,0, {duration:400, curve:'inOutQuad'});
    }

    function killCell(p_grid, p_x, p_y, p_z) {
        p_grid[p_x][p_y][p_z] = 0;
        var cell = app.getByID(p_x+'_'+p_y+'_'+p_z);
        if (!cell) return;
        cell.setDelay(p_x*75+p_y*20+p_z).setOpacity(0, {duration:500, curve:'inOutQuad'}, function()
            {
               mainContainer.destroyChild(cell); 
            });
//console.log('killing ' + p_x + ' ' + p_y + ' ' + p_z);
        cell.setRotation(0, Math.PI/2, 0, {duration:400, curve:'inOutQuad'})
    }

    var startAlive = gridW*gridH*gridD/8;
    for (var i=0; i<startAlive; i++) {
        var x = Math.floor(Math.random()*gridW);
        var y = Math.floor(Math.random()*gridH);
        var z = Math.floor(Math.random()*gridD);
        if (currentGrid[x][y][z]!=1) {
            birthCell(currentGrid, x, y, z);
        }
    }

    function runStep() {
        createNextGrid(currentGrid, nextGrid, gridW, gridH, gridD);
        var tmp = currentGrid;
        currentGrid = nextGrid;
        nextGrid = tmp;
    }

    var playInterval;
    function play() {
        runStep();
        playInterval = setInterval(runStep, 2000);
    }

    function pause() {
        clearInterval(playInterval);
    }

});
