/* globals define */
define(function(require, exports, module) {
    var UIApplication = require('containers/UIApplication');
    var UIElement = require('core/UIElement');
    var Transitionable = require('famous/transitions/Transitionable');

    var InputExampleSurface = UIElement.extend( /** @lends UIElement.prototype */ {
        constructor: function(options) {
            this._callSuper(UIElement, 'constructor', options);
        }
    });

    var background = new UIElement({
        style: {
            background: '#333'
        }
    });

    //------------------- Tap Input Log -------------------//
    var tapCount = 0;
    var tapDisplay = new UIElement({
        size: [100, 200],
        content: '<p>Tap/Click Sync</p><p>Count: '+tapCount+'<p>',
        style: {background: 'white', fontSize: '10px'}
    });
    function updateTapDisplay(){
        tapDisplay.setContent('<p>Tap/Click Sync</p><p>Count: '+tapCount+'<p>');
    }

    //------------------- Drag Input Log -------------------//
    var dragStartCount = 0;
    var dragEndCount = 0;
    var dragPos = [0, 0];
    var dragDelta = [0, 0];
    var dragVel = [0, 0];

    var dragDisplay = new UIElement({
        size: [100, 200],
        position: [110, 0, 0],
        content: '<p>Drag Sync</p>' +
                 '<p>Start: '+ dragStartCount +'<p>' +
                 '<p>End: '+ dragEndCount +'<p>' +
                 '<p>Position: ['+ dragPos +']<p>' +
                 '<p>Delta: ['+ dragDelta +']<p>' +
                 '<p>Velocity: ['+ dragVel +']<p>',
        style: {background: 'white', fontSize: '10px'}
    });
    function updateDragDisplay(){
        dragDisplay.setContent(
         '<p>Drag Sync</p>' +
                 '<p>Start: '+ dragStartCount +'<p>' +
                 '<p>End: '+ dragEndCount +'<p>' +
                 '<p>Position: ['+ dragPos +']<p>' +
                 '<p>Delta: ['+ dragDelta +']<p>' +
                 '<p>Velocity: ['+ dragVel +']<p>'
        );
    }

    //------------------- Scroll Input Log -------------------//
    var scrollStartCount = 0;
    var scrollEndCount = 0;
    var scrollPos = [0, 0];
    var scrollDelta = [0, 0];
    var scrollVel = [0,0];

    var scrollDisplay = new UIElement({
        size: [100, 200],
        position: [220, 0, 0],
        content: '<p>Scroll Sync</p>' +
                 '<p>Start: '+ scrollStartCount +'<p>' +
                 '<p>End: '+ scrollEndCount +'<p>' +
                 '<p>Position: ['+ scrollPos +']<p>' +
                 '<p>Delta: ['+ scrollDelta +']<p>' +
                 '<p>Velocity: ['+ scrollVel +']<p>',
        style: {background: 'white', fontSize: '10px'}
    });
    function updateScrollDisplay(){
        scrollDisplay.setContent(
         '<p>Scroll Sync</p>' +
                 '<p>Start: '+ scrollStartCount +'<p>' +
                 '<p>End: '+ scrollEndCount +'<p>' +
                 '<p>Position: ['+ scrollPos +']<p>' +
                 '<p>Delta: ['+ scrollDelta +']<p>' +
                 '<p>Velocity: ['+ scrollVel +']<p>'
        );
    }

    //------------------- Touch Input Log -------------------//
    var touchStartCount = 0;
    var touchEndCount = 0;
    var touchPos = [0, 0];
    var touchDelta = [0, 0];
    var touchVel = [0,0];

    var touchDisplay = new UIElement({
        size: [100, 200],
        position: [330, 0, 0],
        content: '<p>Touch Sync</p>' +
                 '<p>Start: '+ touchStartCount +'<p>' +
                 '<p>End: '+ touchEndCount +'<p>' +
                 '<p>Position: ['+ touchPos +']<p>' +
                 '<p>Delta: ['+ touchDelta +']<p>' +
                 '<p>Velocity: ['+ touchVel +']<p>',
        style: {background: 'white', fontSize: '10px'}
    });
    function updateTouchDisplay(){
        touchDisplay.setContent(
         '<p>Touch Sync</p>' +
                 '<p>Start: '+ touchStartCount +'<p>' +
                 '<p>End: '+ touchEndCount +'<p>' +
                 '<p>Position: ['+ touchPos +']<p>' +
                 '<p>Delta: ['+ touchDelta +']<p>' +
                 '<p>Velocity: ['+ touchVel +']<p>'
        );
    }

    //------------------- Pinch Input Log -------------------//
    var pinchStartCount = 0;
    var pinchEndCount = 0;
    var pinchCenter = ['n/a', 'n/a'];
    var pinchDelta = 0;
    var pinchVel = 0;
    var pinchDistance = 0;
    var pinchDisplacement = 0;

    var pinchDisplay = new UIElement({
        size: [100, 200],
        position: [440, 0, 0],
        content: '<p>Pinch Sync</p>' +
                 '<p>Start: '+ pinchStartCount +'<p>' +
                 '<p>End: '+ pinchEndCount +'<p>' +
                 '<p>Center: ['+ pinchCenter +']<p>' +
                 '<p>Delta: '+ pinchDelta +'<p>' +
                 '<p>Velocity: '+ pinchVel +'<p>' +
                 '<p>Distance: '+ pinchDistance +'<p>' +
                 '<p>Displacement: '+ pinchDisplacement +'<p>',
        style: {background: 'white', fontSize: '10px'}
    });
    function updatePinchDisplay(){
        pinchDisplay.setContent(
         '<p>Pinch Sync</p>' +
                 '<p>Start: '+ pinchStartCount +'<p>' +
                 '<p>End: '+ pinchEndCount +'<p>' +
                 '<p>Center: ['+ pinchCenter +']<p>' +
                 '<p>Delta: '+ pinchDelta +'<p>' +
                 '<p>Velocity: '+ pinchVel +'<p>' +
                 '<p>Distance: '+ pinchDistance +'<p>' +
                 '<p>Displacement: '+ pinchDisplacement +'<p>'
        );
    }

    //------------------- Scale Input Log -------------------//
    var scaleStartCount = 0;
    var scaleEndCount = 0;
    var scaleScale = 1;
    var scaleDelta = 0;
    var scaleVel = 0;
    var scaleDistance = 0;
    var scaleDisplacement = 0;
    var scaleAdjustedScale = 1;

    var scaleDisplay = new UIElement({
        size: [100, 200],
        position: [0, 210, 0],
        content: '<p>Scale Sync</p>' +
                 '<p>Start: '+ scaleStartCount +'<p>' +
                 '<p>End: '+ scaleEndCount +'<p>' +
                 '<p>Scale: '+ scaleScale +'<p>' +
                 '<p>Delta: '+ scaleDelta +'<p>' +
                 '<p>Distance: '+ scaleDistance +'<p>'+
                 '<p>Adjusted Scale: '+ scaleAdjustedScale +'<p>',
        style: {background: 'white', fontSize: '10px'}
    });
    function updateScaleDisplay(){
        scaleDisplay.setContent(
         '<p>Scale Sync</p>' +
                 '<p>Start: '+ scaleStartCount +'<p>' +
                 '<p>End: '+ scaleEndCount +'<p>' +
                 '<p>Scale: '+ scaleScale +'<p>' +
                 '<p>Delta: '+ scaleDelta +'<p>' +
                 '<p>Distance: '+ scaleDistance +'<p>'+
                 '<p>Adjusted Scale: '+ scaleAdjustedScale +'<p>'
        );
    }

    //------------------- Rotate Input Log -------------------//
    var rotateStartCount = 0;
    var rotateEndCount = 0;
    var rotateAngle = 0;
    var rotateAngleUpdate = 0;

    var rotateDisplay = new UIElement({
        size: [100, 200],
        position: [110, 210, 0],
        content: '<p>Rotate Sync</p>' +
                 '<p>Start: '+ rotateStartCount +'<p>' +
                 '<p>End: '+ rotateEndCount +'<p>' +
                 '<p>Angle: '+ rotateAngle +'<p>' +
                 '<p>Angle Update: '+ rotateAngleUpdate +'<p>',
        style: {background: 'white', fontSize: '10px'}
    });
    function updateRotateDisplay(){
        rotateDisplay.setContent(
         '<p>Rotate Sync</p>' +
                 '<p>Start: '+ rotateStartCount +'<p>' +
                 '<p>End: '+ rotateEndCount +'<p>' +
                 '<p>Angle: '+ rotateAngle +'<p>' +
                 '<p>Angle Update: '+ rotateAngleUpdate +'<p>'
        );
    }

    //------------------- Mouse Input Log -------------------//
    var mouseoverCount = 0;
    var mouseoutCount = 0;
    var mouseupCount = 0;

    var mouseDisplay = new UIElement({
        size: [100, 200],
        position: [550, 0, 0],
        content: '<p>Mouse Events</p>' +
                 '<p>mouseover: '+ mouseoverCount +'<p>' +
                 '<p>mouseout: '+ mouseoutCount +'<p>' +
                 '<p>mouseup: '+ mouseupCount +'<p>',
        style: {background: 'white', fontSize: '10px'}
    });
    function updateMouseDisplay(){
        mouseDisplay.setContent(
         '<p>Mouse Events</p>' +
                 '<p>mouseover: '+ mouseoverCount +'<p>' +
                 '<p>mouseout: '+ mouseoutCount +'<p>' +
                 '<p>mouseup: '+ mouseupCount +'<p>'
        );
    }

    //------------------- Set up Input Surf -------------------//
    var activeInputs = {
        drag: false,
        scroll: false,
        touch: false,
        pinch: false,
        scale: false,
        rotate: false
    };
    var inputSurface = new InputExampleSurface({
        align: [0.5, 1],
        origin: [0.5, 0.5],
        position: [0, -300],
        size: [300, 300],
        content: '<p>Input Example Surf</p>' + 
                 '<p>Active Inputs: </p>',
        style: {
            backgroundImage: "url('http://static2.businessinsider.com/image/51dd6b0ceab8eaa223000013-480/giant-panda-bear-bamboo.jpg')",
            color: 'red',
            backgroundPosition: 'center',
            borderRadius: '50%',
            textAlign: 'center'
        }   
    });
    function updateInputSurf(){
        var activeInputStr = "";
        for(var key in activeInputs) {
            if(activeInputs[key]) {
                activeInputStr += key + "; "
            }
        }

        inputSurface.setContent(
            '<p>Input Example Surf</p>' + 
            '<p>Active Inputs: '+activeInputStr+'</p>'
        );
    }
    
    //------------------- Tap -------------------//
    inputSurface.on('tap', function(data){
        tapCount++;
        updateTapDisplay();
    });

    //------------------- Drag -------------------//
    inputSurface.on('dragStart', function(){
        dragStartCount++;
        activeInputs.drag = true;
        updateDragDisplay();
        updateInputSurf();
    });
    inputSurface.on('dragUpdate', function(data){
        dragPos = [data.position[0], data.position[1]];
        dragDelta = [data.delta[0], data.delta[1]];
        dragVel = [Math.round(data.velocity[0] * 10) / 10, Math.round(data.velocity[1] * 10) / 10];
        updateDragDisplay();

        // Move surface
        var currentPos = inputSurface.getPosition();
        inputSurface.setPosition(
            data.delta[0] + currentPos[0], data.delta[1] + currentPos[1]
        );
    });
    inputSurface.on('dragEnd', function(){
        dragEndCount++;
        activeInputs.drag = false;
        updateDragDisplay();
        updateInputSurf();
    });

    //------------------- Scroll -------------------//
    inputSurface.on('scrollStart', function(){
        scrollStartCount++;
        activeInputs.scroll = true;
        updateScrollDisplay();
        updateInputSurf();
    });
    inputSurface.on('scrollUpdate', function(data){
        scrollPos = [data.position[0], data.position[1]];
        scrollDelta = [data.delta[0], data.delta[1]];
        scrollVel = [Math.round(data.velocity[0] * 10) / 10, Math.round(data.velocity[1] * 10) / 10];

        //update scale
        var scaleFactor = -scrollPos[1] / 10000;
        var currentScale = inputSurface.getScale()[1];
        scaleFactor += currentScale;
        inputSurface.setScale(scaleFactor, scaleFactor);

        updateScrollDisplay();
    });
    inputSurface.on('scrollEnd', function(){
        scrollEndCount++;
        activeInputs.scroll = false;
        updateScrollDisplay();
        updateInputSurf();
    });

    //------------------- Touch -------------------//
    inputSurface.on('touchStart', function(){
        touchStartCount++;
        activeInputs.touch = true;
        updateTouchDisplay();
        updateInputSurf();
    });
    inputSurface.on('touchUpdate', function(data){
        touchPos = [data.position[0], data.position[1]];
        touchDelta = [data.delta[0], data.delta[1]];
        touchVel = [Math.round(data.velocity[0] * 10) / 10, Math.round(data.velocity[1] * 10) / 10];
        updateTouchDisplay();
    });
    inputSurface.on('touchEnd', function(){
        touchEndCount++;
        activeInputs.touch = false;
        updateTouchDisplay();
        updateInputSurf();
    });

    //------------------- Pinch -------------------//
    inputSurface.on('pinchStart', function(){
        pinchStartCount++;
        activeInputs.pinch = true;
        updatePinchDisplay();
        updateInputSurf();
    });
    inputSurface.on('pinchUpdate', function(data){
        pinchCenter = data.center;
        pinchDelta = Math.round(data.delta * 10)/10;
        pinchVel = Math.round(data.velocity * 10)/10;
        pinchDistance = Math.round(data.distance * 10)/10;
        pinchDisplacement = Math.round(data.displacement * 10)/10;
        updatePinchDisplay();
    });
    inputSurface.on('pinchEnd', function(){
        pinchEndCount++;
        activeInputs.pinch = false;
        updatePinchDisplay();
        updateInputSurf();
    });

    //------------------- Scale -------------------//
    inputSurface.on('scaleStart', function(){
        scaleStartCount++;
        activeInputs.scale = true;
        updateScaleDisplay();
        updateInputSurf();
    });
    inputSurface.on('scaleUpdate', function(data){
        scaleScale = Math.round(data.scale * 100)/100;
        scaleDelta = Math.round(data.delta * 10)/10;
        scaleVel = Math.round(data.velocity * 10)/10;
        scaleDistance = Math.round(data.distance * 10)/10;

        //update scale
        var scaleFactor = scaleScale - 1;
        if(scaleFactor > 0) {
            scaleFactor *= 0.05;
        } else {
            scaleFactor *= 0.1;
        }
        scaleFactor += inputSurface.getScale()[0]
        scaleFactor = Math.round(scaleFactor * 100)/100;
        scaleAdjustedScale = scaleFactor;
        inputSurface.setScale(scaleFactor, scaleFactor);

        updateScaleDisplay();
    });
    inputSurface.on('scaleEnd', function(){
        scaleEndCount++;
        activeInputs.scale = false;
        updateScaleDisplay();
        updateInputSurf();
    });

    //------------------- Rotate -------------------//
    inputSurface.on('rotateStart', function(){
        rotateStartCount++;
        activeInputs.rotate = true;
        updateRotateDisplay();
        updateInputSurf();
    });
    inputSurface.on('rotateUpdate', function(data){
        rotateAngleUpdate = Math.round(data.angle * 100) / 100;

        //update rotation
        var currentRotation = inputSurface.getRotation()[2];
        inputSurface.setRotation(0, 0, rotateAngle + rotateAngleUpdate);

        updateRotateDisplay();
    });
    inputSurface.on('rotateEnd', function(){
        rotateEndCount++;
        activeInputs.rotate = false;
        rotateAngle = rotateAngleUpdate;
        updateRotateDisplay();
        updateInputSurf();
    });

    //------------------- Mouse -------------------//
    inputSurface.on('mouseover', function(){
        mouseoverCount++;
        updateMouseDisplay();
    });

    inputSurface.on('mouseout', function(){
        mouseoutCount++;
        updateMouseDisplay();
    });

    inputSurface.on('mouseup', function(){
        mouseupCount++;
        updateMouseDisplay();
    });




    //------------------- UI Application -------------------//
    var app = new UIApplication({
        children: [
            background,
            inputSurface,
            tapDisplay,
            dragDisplay,
            scrollDisplay,
            touchDisplay,
            pinchDisplay,
            mouseDisplay,
            scaleDisplay,
            rotateDisplay
        ]
    });
});
