define(function(require, exports, module) {
    document.getElementsByTagName('html')[0].style.background = '#000';

    // main requires
    var UIContainer         = require('containers/UIContainer');
    var UIElement           = require('core/UIElement');
    var UIApplication       = require('containers/UIApplication');
    var UIButton            = require('controls/UIButton');

    // element data
    var data = [
        ['H', 'Hydrogen', '1.00794', 1, 1],
        ['He', 'Helium', '4.002602', 18, 1],
        ['Li', 'Lithium', '6.941', 1, 2],
        ['Be', 'Beryllium', '9.012182', 2, 2],
        ['B', 'Boron', '10.811', 13, 2],
        ['C', 'Carbon', '12.0107', 14, 2],
        ['N', 'Nitrogen', '14.0067', 15, 2],
        ['O', 'Oxygen', '15.9994', 16, 2],
        ['F', 'Fluorine', '18.9984032', 17, 2],
        ['Ne', 'Neon', '20.1797', 18, 2],
        ['Na', 'Sodium', '22.98976...', 1, 3],
        ['Mg', 'Magnesium', '24.305', 2, 3],
        ['Al', 'Aluminium', '26.9815386', 13, 3],
        ['Si', 'Silicon', '28.0855', 14, 3],
        ['P', 'Phosphorus', '30.973762', 15, 3],
        ['S', 'Sulfur', '32.065', 16, 3],
        ['Cl', 'Chlorine', '35.453', 17, 3],
        ['Ar', 'Argon', '39.948', 18, 3],
        ['K', 'Potassium', '39.948', 1, 4],
        ['Ca', 'Calcium', '40.078', 2, 4],
        ['Sc', 'Scandium', '44.955912', 3, 4],
        ['Ti', 'Titanium', '47.867', 4, 4],
        ['V', 'Vanadium', '50.9415', 5, 4],
        ['Cr', 'Chromium', '51.9961', 6, 4],
        ['Mn', 'Manganese', '54.938045', 7, 4],
        ['Fe', 'Iron', '55.845', 8, 4],
        ['Co', 'Cobalt', '58.933195', 9, 4],
        ['Ni', 'Nickel', '58.6934', 10, 4],
        ['Cu', 'Copper', '63.546', 11, 4],
        ['Zn', 'Zinc', '65.38', 12, 4],
        ['Ga', 'Gallium', '69.723', 13, 4],
        ['Ge', 'Germanium', '72.63', 14, 4],
        ['As', 'Arsenic', '74.9216', 15, 4],
        ['Se', 'Selenium', '78.96', 16, 4],
        ['Br', 'Bromine', '79.904', 17, 4],
        ['Kr', 'Krypton', '83.798', 18, 4],
        ['Rb', 'Rubidium', '85.4678', 1, 5],
        ['Sr', 'Strontium', '87.62', 2, 5],
        ['Y', 'Yttrium', '88.90585', 3, 5],
        ['Zr', 'Zirconium', '91.224', 4, 5],
        ['Nb', 'Niobium', '92.90628', 5, 5],
        ['Mo', 'Molybdenum', '95.96', 6, 5],
        ['Tc', 'Technetium', '(98)', 7, 5],
        ['Ru', 'Ruthenium', '101.07', 8, 5],
        ['Rh', 'Rhodium', '102.9055', 9, 5],
        ['Pd', 'Palladium', '106.42', 10, 5],
        ['Ag', 'Silver', '107.8682', 11, 5],
        ['Cd', 'Cadmium', '112.411', 12, 5],
        ['In', 'Indium', '114.818', 13, 5],
        ['Sn', 'Tin', '118.71', 14, 5],
        ['Sb', 'Antimony', '121.76', 15, 5],
        ['Te', 'Tellurium', '127.6', 16, 5],
        ['I', 'Iodine', '126.90447', 17, 5],
        ['Xe', 'Xenon', '131.293', 18, 5],
        ['Cs', 'Caesium', '132.9054', 1, 6],
        ['Ba', 'Barium', '132.9054', 2, 6],
        ['La', 'Lanthanum', '138.90547', 4, 9],
        ['Ce', 'Cerium', '140.116', 5, 9],
        ['Pr', 'Praseodymium', '140.90765', 6, 9],
        ['Nd', 'Neodymium', '144.242', 7, 9],
        ['Pm', 'Promethium', '(145)', 8, 9],
        ['Sm', 'Samarium', '150.36', 9, 9],
        ['Eu', 'Europium', '151.964', 10, 9],
        ['Gd', 'Gadolinium', '157.25', 11, 9],
        ['Tb', 'Terbium', '158.92535', 12, 9],
        ['Dy', 'Dysprosium', '162.5', 13, 9],
        ['Ho', 'Holmium', '164.93032', 14, 9],
        ['Er', 'Erbium', '167.259', 15, 9],
        ['Tm', 'Thulium', '168.93421', 16, 9],
        ['Yb', 'Ytterbium', '173.054', 17, 9],
        ['Lu', 'Lutetium', '174.9668', 18, 9],
        ['Hf', 'Hafnium', '178.49', 4, 6],
        ['Ta', 'Tantalum', '180.94788', 5, 6],
        ['W', 'Tungsten', '183.84', 6, 6],
        ['Re', 'Rhenium', '186.207', 7, 6],
        ['Os', 'Osmium', '190.23', 8, 6],
        ['Ir', 'Iridium', '192.217', 9, 6],
        ['Pt', 'Platinum', '195.084', 10, 6],
        ['Au', 'Gold', '196.966569', 11, 6],
        ['Hg', 'Mercury', '200.59', 12, 6],
        ['Tl', 'Thallium', '204.3833', 13, 6],
        ['Pb', 'Lead', '207.2', 14, 6],
        ['Bi', 'Bismuth', '208.9804', 15, 6],
        ['Po', 'Polonium', '(209)', 16, 6],
        ['At', 'Astatine', '(210)', 17, 6],
        ['Rn', 'Radon', '(222)', 18, 6],
        ['Fr', 'Francium', '(223)', 1, 7],
        ['Ra', 'Radium', '(226)', 2, 7],
        ['Ac', 'Actinium', '(227)', 4, 10],
        ['Th', 'Thorium', '232.03806', 5, 10],
        ['Pa', 'Protactinium', '231.0588', 6, 10],
        ['U', 'Uranium', '238.02891', 7, 10],
        ['Np', 'Neptunium', '(237)', 8, 10],
        ['Pu', 'Plutonium', '(244)', 9, 10],
        ['Am', 'Americium', '(243)', 10, 10],
        ['Cm', 'Curium', '(247)', 11, 10],
        ['Bk', 'Berkelium', '(247)', 12, 10],
        ['Cf', 'Californium', '(251)', 13, 10],
        ['Es', 'Einstenium', '(252)', 14, 10],
        ['Fm', 'Fermium', '(257)', 15, 10],
        ['Md', 'Mendelevium', '(258)', 16, 10],
        ['No', 'Nobelium', '(259)', 17, 10],
        ['Lr', 'Lawrencium', '(262)', 18, 10],
        ['Rf', 'Rutherfordium', '(267)', 4, 7],
        ['Db', 'Dubnium', '(268)', 5, 7],
        ['Sg', 'Seaborgium', '(271)', 6, 7],
        ['Bh', 'Bohrium', '(272)', 7, 7],
        ['Hs', 'Hassium', '(270)', 8, 7],
        ['Mt', 'Meitnerium', '(276)', 9, 7],
        ['Ds', 'Darmstadium', '(281)', 10, 7],
        ['Rg', 'Roentgenium', '(280)', 11, 7],
        ['Cn', 'Copernicium', '(285)', 12, 7],
        ['Uut', 'Unutrium', '(284)', 13, 7],
        ['Fl', 'Flerovium', '(289)', 14, 7],
        ['Uup', 'Ununpentium', '(288)', 15, 7],
        ['Lv', 'Livermorium', '(293)', 16, 7],
        ['Uus', 'Ununseptium', '(294)', 17, 7],
        ['Uuo', 'Ununoctium', '(294)', 18, 7]
    ];

    console.log('%cAn Alexander Gugel production, featuring Imtiaz Majeed', 'color: #0066cc;');

    // Element cards are UIElements
    var Element = UIElement.extend({
        constructor: function(options) {
            options.content = '<div class="number">' + options.i + '</div>' +
                              '<div class="symbol">' + data[options.i][0] + '</div>' +
                              '<div class="details">' + data[options.i][1] + '<br>' + data[options.i][2] + '</div>';
            options.classes = ['backfaceVisibility', 'element'];
            options.style = {
                background: 'rgba(0,127,127,' + ( Math.random() * 0.5 + 0.25 ) + ')'
            };
            UIElement.prototype.constructor.call(this, options);
            this.setPosition(window.innerWidth*Math.random(), window.innerHeight*Math.random(), 10000);
            this.setRotation(Math.PI*100, 0, 0);
            this.glow();
            this.center();
        },

        // initial animation of elements forming the periodic table
        goHome: function() {
            this.paraflowing = false;
            this.setRotation(0, 0, 0, { duration: 1000, curve: 'spring' });
            this.setPosition(-18*(this.options.size[0] + this.options.margin)*0.5 + (data[this.options.i][3] - 1)*(this.options.size[0] + this.options.margin), - 10*(this.options.size[1] + this.options.margin)*0.5 + (data[this.options.i][4] - 1)*(this.options.size[1] +this.options.margin), 100, { duration: 1500, curve: 'inOutExpo' });
            this.setPosition(-18*(this.options.size[0] + this.options.margin)*0.5 + (data[this.options.i][3] - 1)*(this.options.size[0] + this.options.margin), - 10*(this.options.size[1] + this.options.margin)*0.5 + (data[this.options.i][4] - 1)*(this.options.size[1] +this.options.margin), 0, { duration: 1500, curve: 'spring' });
        },

        // helix formation
        goHelix: function() {
            this.paraflowing = false;
            this.setRotation(0, 0, 0, { duration: 1000, curve: 'spring' });
            var phi = this.options.i * 0.175 + Math.PI;
            var x = 900 * Math.sin(phi);
            var y = - (this.options.i * 8) + 450;
            var z = 900 * Math.cos(phi);

            this.setPosition(x, y, z+100, { duration: 1000, curve: 'inOutQuad' });
            this.setPosition(x, y, z, { duration: 1500, curve: 'spring' });
        },

        // sphere formation
        goSphere: function() {
            this.paraflowing = false;
            this.setRotation(0, 0, 0, { duration: 1000, curve: 'spring' });
            var phi = Math.acos( -1 + ( 2 * this.options.i ) / data.length );
            var theta = Math.sqrt( data.length * Math.PI ) * phi;

            var x = 800 * Math.cos( theta ) * Math.sin( phi );
            var y = 800 * Math.sin( theta ) * Math.sin( phi );
            var z = 800 * Math.cos( phi );

            this.setPosition(x, y, z+100, { duration: 1000, curve: 'inOutQuad' });
            this.setPosition(x, y, z, { duration: 1500, curve: 'spring' });
        },

        // grid formation
        goGrid: function() {
            this.paraflowing = false;
            this.setRotation(0, 0, 0, { duration: 1000, curve: 'spring' });
            var x = ( ( this.options.i % 5 ) * 400 ) - 800;
            var y = ( - ( Math.floor( this.options.i / 5 ) % 5 ) * 400 ) + 800;
            var z = ( Math.floor( this.options.i / 25 ) ) * 1000 - 2000;

            this.setPosition(x, y, z+100, { duration: 1000, curve: 'inOutQuad' });
            this.setPosition(x, y, z, { duration: 1500, curve: 'spring' });
        },
        
        // paraflow aka explosion
        goParaflow: function(index) {
            this.paraflowPos = [
                (Math.floor(index / 15) - 3.5) * 270,
                ((index % 5) - 2) * 350,
                (Math.floor(index / 5) % 3) * 400 - 500
            ]; 
            //if(!this.paraflowing) this.setPosition(this.paraflowPos[0], this.paraflowPos[1], this.paraflowPos[2], { duration: 1000, curve: 'inOutQuad' });
            this.paraflowing = true;

            var duration = 1000;

            function _getRandomLoc() {
               return (window.innerWidth/2 - Math.random()*window.innerWidth)*10;
            }
            
            this.translateAxis = Math.random();
            var currentPosition = this.getPosition();
            if(this.translateAxis < 0.33) 
                this.setPosition(_getRandomLoc(), currentPosition[1], currentPosition[2], { duration: duration, curve: 'linear' });
            if(0.33 > this.translateAxis < 0.66) 
                this.setPosition(currentPosition[0], _getRandomLoc(), currentPosition[2], { duration: duration, curve: 'linear' });
            if(0.66 > this.translateAxis < 1) 
                this.setPosition(currentPosition[0], currentPosition[1], _getRandomLoc(), { duration: duration, curve: 'linear' }); 
        },

        // make each Element glow in opacity
        glow: function() {
            this.setOpacity(0.5 + 0.5*Math.random(), { duration: 1000 }, this.glow.bind(this));
        }
    });

    // The periodic table is an UIContainer
    var periodicTable = window.periodicTable = new (UIContainer.extend({
        constructor: function() {
            UIContainer.prototype.constructor.call(this, {
                size: [0, 0], // Size needs to be [0, 0] in order to make the rotation work properly
                elementWidth: 120,
                elementHeight: 160,
                elementMargin: 15
            });
            this.elements = [];

            // create Elements for each element in data
            for (var i = 0; i < data.length; i++) {
                var element = new Element({
                    i: i,
                    size: [this.options.elementWidth, this.options.elementHeight],
                    margin: 15
                });
                this.elements.push(element);
                this._addChild(element);
            }
            this.center();
            this.goHome();

            this.setPosition(0, 0, -2500, { curve: 'outBack', duration: data.length*25 });

            this.setRotation(Math.PI, Math.PI, Math.PI);
            this.startAutoRotate();
        },

        // call goHome formation on every element
        goHome: function(delay) {
            for (var i = 0; i < this.elements.length; i++) 
                this.elements[i].setDelay(i*25).goHome();
        },

        // call goHelix formation on every element
        goHelix: function() {
            for (var i = 0; i < this.elements.length; i++) 
                this.elements[i].setDelay(i*25).goHelix();
        },

        // call goSphere formation on every element
        goSphere: function(delay) {
            for (var i = 0; i < this.elements.length; i++) 
                this.elements[i].setDelay(i*25).goSphere();
        },

        // call goGrid formation on every element
        goGrid: function() {
            for (var i = 0; i < this.elements.length; i++) 
                this.elements[i].setDelay(i*25).goGrid();
        },

        // call goGrid formation on every element
        goParaflow: function() {
            for (var i = 0; i < this.elements.length; i++) 
                this.elements[i].setDelay(i*25).goParaflow(i);
        },

        // autoRotate on initial animation
        startAutoRotate: function() {
            this.setRotation(0, 0, 0, {
                duration: 5000,
                curve: 'inOutExpo'
            });
        }
    }))();

    // ux is being used as an overlay in order to catch the drag event
    var ux = new UIElement({
        style: {
            cursor: 'move'
        }
    });

    // rotate on drag
    ux.on('tapUpdate', function(event) {
        var previousRotation = periodicTable.getRotation();
        periodicTable.setRotation(previousRotation[0] + (event.delta[1]/100), previousRotation[1] + (event.delta[0]/100), previousRotation[2]);
    });

    // zoom on scroll
    ux.on('scrollUpdate', function(event) {
        periodicTable._translateState.halt();
        var previousZ = periodicTable.getPosition()[2];
        var newZ = previousZ - event.position[1]/10;
        newZ = newZ <= 0 ? newZ : 0;
        newZ = newZ >= -10000 ? newZ : -10000;

        periodicTable.setPosition(0, 0, newZ);
    });

    // Buttons and click events
    var goHomeButton = new UIButton({
        content: 'Table',
        background: 'none'
    });
    goHomeButton.on('click', function() { periodicTable.goHome(); }); 
    goHomeButton.setPosition(10, 10);

    var goHelixButton = new UIButton({
        content: 'Helix',
        background: 'none'
    });
    goHelixButton.on('click', function() { periodicTable.goHelix(); });
    goHelixButton.setPosition(10, 50);

    var goSphereButton = new UIButton({
        content: 'Sphere',
        background: 'none'
    });
    goSphereButton.on('click', function() { periodicTable.goSphere(); });
    goSphereButton.setPosition(10, 90);

    var goGridButton = new UIButton({
        content: 'Grid',
        background: 'none'
    });
    goGridButton.on('click', function() { periodicTable.goGrid(); });
    goGridButton.setPosition(10, 130);

    var goParaflowButton = new UIButton({
        content: 'Asplode',
        background: 'none'
    });
    goParaflowButton.on('click', function() { periodicTable.goParaflow(); });
    goParaflowButton.setPosition(10, 170);

    // Add everything to our app
    var app = new UIApplication({children: [ux, periodicTable, goHelixButton, goHomeButton, 
                                            goSphereButton, goGridButton, goParaflowButton]});
});
