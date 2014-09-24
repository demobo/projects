//https://dl.dropboxusercontent.com/u/4151675/tla/index.html
/*
 - the threshold is a good idea. but to make it work, the finger size has to be remembered.
 so when the uer lifts the fingers an outs them back on in the same size, it has to be regiestered
 as the same mode.
 this might be solved by delaying counting the fingers, because then sthe finger size is
 not as easily changed between lifting and resetting the fingers.


 */


var frameRate = 60;
var H, S, L, wH, wW;
var touches = [];
var state = 'inner';
var fingerCount = 0;
var tutorialstep = 0;
var timer, tutorialtimer;

var fMax = 0;
var uS = 0;
var lastFMax = -1;
var lastUS = -1;
var initFMax = -1;
var initUS = -1;
var noFingers = true;


var originY = -1;
var originUnit = 0;
var lastYDiff = 0;
var lastUnit;
var scaleOffset = 0;
var yOffset = 0;


var fingerCenter = {};
var radius = 0;

var circleOffset = 40;
var sizeCircleRadius = [[-40, 80, 100, 120, 120],[0, 20, 50, 70, 70]];

// var touchDelay = 50;
var touchDelayTimer;
var touchDelayed = false;

var mapShowing = false;
var tutorialShowing = true;



$(function () {

    $(window).bind('resize', function() {
        wW = window.innerWidth;
        wH = window.innerHeight;
        console.log('window', wW, 'x', wH);
    });
    $(window).resize();


    tutorialInit();


    // tutorialtimer = setInterval(function() {
    //   redrawTutorial();
    // }, 1400);

    document.getElementById('touchLayer').addEventListener('touchstart', function(event) {
        event.preventDefault();
        touches = event.touches;
        touchDelayCheck(80);
        // recalculateFingers();
    }, false);


    document.getElementById('touchLayer').addEventListener('touchmove', function(event) {
        event.preventDefault();
        touches = event.touches;

        // console.log(touches);
    }, false);


    document.getElementById('touchLayer').addEventListener('touchend', function(event) {
        event.preventDefault();
        touches = event.touches;
        touchDelayCheck(50);
        // recalculateFingers();
    }, false);


    $('#mapButton').bind('click', function(event){
        enableMap();
    });


});



function touchDelayCheck(touchDelay) {
    if (touchDelayed == false) {
        touchDelayed = true;
        clearTimeout(touchDelayTimer);
        touchDelayTimer = setTimeout(function() {
            clearTimeout(touchDelayTimer);
            touchDelayed = false;
            recalculateFingers();
        }, touchDelay);
    }
}



function recalculateFingers() {

    if (typeof touches[0] === 'undefined' && noFingers == false) {
        console.log('released last finger');
        clearInterval(timer);
        saveUnitValueChange();
        resetMovementTracking();
        allFingersRemoved();
        return false;
        // all fingers were lifted
        // save unit changes
        // fade out all visuals
        // reset all values
    }

    if (mapShowing == true && noFingers == true && touches.length == 5) {
        console.log('5555555', mapShowing);
        disableMap();
        showTutorialIcons();
        return false;
    }

    if (noFingers == true && touches.length == 1) {
        firstFingerPlacedAfterNone();
        return false;
    }

    fMax = touches.length-1;

    if (noFingers == true && touches.length > 1) {
        disableMap();
        hideTutorialIcons();
        // noFingers = false;
        initFMax = touches.length-1;

        clearInterval(timer);
        timer = setInterval(function() {
            if (touchDelayed == false) {
                getFingerInfo();
            }
        }, 1000/frameRate);

        minTwoFingersPlaced();

        getFingerInfo();
    }


}



function firstFingerPlacedAfterNone() {
    console.log('One finger is not enough!');
    $('#singleFinger').css('left', touches[0].pageX).css('top', touches[0].pageY);
    $('#singleFinger').removeClass('animate');
    window.setTimeout(function(){
        $('#singleFinger').addClass('animate');
    }, 1);
}








function resetMovementTracking() {
    originY = -1;
    lastYDiff = -9999999;
    lastUnit = -1;


    console.log('reset tracking ------------------------');
}







function getFingerInfo() {
    var fingers = touches;
    var i;
    var fingers2 = [];

    //-------------------------------------------- distance of fingers

    for (i in fingers) {
        if (fingers[i].pageX) {
            fingers2.push(fingers[i]);
        }
    }

    var fingersW, fingersH;

    if (fMax > 0) {
        fingers2.sort(function(a,b){
            return a.pageX - b.pageX;
        });
    }

    fingersW = fingers2[fMax].pageX - fingers2[0].pageX;
    fingerCenter.x = Math.floor(fingers2[0].pageX + (fingersW)/2);

    if (fMax > 0) {
        fingers2.sort(function(a,b){
            return a.pageY - b.pageY;
        });
    }

    fingersH = fingers2[fMax].pageY - fingers2[0].pageY;

    //------------------------------------------------ finger center calculated


    fingerCenter.y = Math.floor(fingers2[0].pageY + (fingersH)/2);

    //------------------------------------------------- determine active circle radius from finger distances

    radius = 0;
    var lastDist;
    for (i=0; i<=fMax; i++) {
        lastDist = getDistance(fingers2[i], fingerCenter);
        if (lastDist > radius) {
            radius = lastDist;
        }
    }


    //------------------------------------------------- determine state (finger size)




    if (noFingers == true) {
        noFingers = false;

        if (radius-circleOffset > sizeCircleRadius[0][fMax]) {
            state = 'outer';
            initUS = 1;
            uS = 1;
            $('#centerLabel p').html(units[fMax][uS].desc);
            $('.outable').addClass('outer');

        } else {
            state = 'inner';
            initUS = 0;
            uS = 0;

            $('#centerLabel p').html(units[fMax][uS].desc);
            $('.outable').removeClass('outer');

        }

        resetScale();
        // displayModeIcon();
        changeTopDisplayIcon();
    }

    var thresh = sizeCircleRadius[0][fMax];
    // $('body').css('background', 'black');

    // $('#fingerCircleActive0').css('border', '4px solid #fff');

    if (state == 'outer' && radius < thresh+70) {
        radius = (thresh+70) - 22/((thresh+70)/((thresh+70) - (radius)));
        if (radius < thresh + 70 - 24) {
            radius = thresh + 70 - 24;
        }

        // $('body').css('background', 'blue');
    } else if (state == 'inner' && radius > thresh+30){
        radius = (thresh+30) + 15 * ( (radius - (thresh+30)) / (thresh+30+100) );
        if (radius > thresh + 30 + 15) {
            radius = thresh + 30 + 15;
        }
        // $('body').css('background', 'red');
    }


    // updateFingerTips();
    updateCircles();
    trackMovement();


}



function updateCircleState() {

    $('#fingerCircleActive0').removeClass('outer');

    window.setTimeout(function(){
        $('#fingerCircleActive0').addClass('outer');
    }, 1);

    // resetTracking();
}







function updateCircles() {

    $('#fingerCenter').css('left',fingerCenter.x).css('top', fingerCenter.y);
    $('#centerLabel').css('right', 786 - fingerCenter.x - 10).css('top', fingerCenter.y - 25);
    $('#level').css('top', fingerCenter.y).css('width', fingerCenter.x-36);
    $('#tag').css('top', fingerCenter.y + 14);

    // console.log('301 fMax and uS are', fMax, uS);
    if (state == 'outer') {
        placeCircle('#fingerCircle', fingerCenter.x, fingerCenter.y, sizeCircleRadius[0][fMax] + circleOffset + 50);
        scaleCircle('#fingerCircle', sizeCircleRadius[0][fMax] + circleOffset + 50);
    } else {
        placeCircle('#fingerCircle', fingerCenter.x, fingerCenter.y, sizeCircleRadius[0][fMax] + circleOffset + 90);
        scaleCircle('#fingerCircle', sizeCircleRadius[0][fMax] + circleOffset + 90);
    }

    placeCircle('#fingerCircleActive0', fingerCenter.x, fingerCenter.y, radius + circleOffset);
    scaleCircle('#fingerCircleActive0', radius + circleOffset)

}
















// only happens after all finger info hast been gotten 
function trackMovement() {

    var unitSize = units[initFMax][initUS].unitSize;

    var currentY = fingerCenter.y;

    var currentUnit = Math.floor(((currentY+yOffset) - (currentY+yOffset) % unitSize) / unitSize);

    // console.log('currentUnit', currentUnit);

    if (originY == -1) {
        originY = currentY;
        originUnit = currentUnit;
        // console.log('originuint', originUnit);
        // console.log('originy', originY);
    }



    var yDiff = originY - currentY;

    if (yDiff == lastYDiff) {
        return false;

    } else {
        lastYDiff = yDiff;
    }


    if (currentUnit == lastUnit) {
        return false;
    } else {
        lastUnit = currentUnit;
        updateScale();
    }


}









// function displayModeIcon() {
//   var iconSS = sizeCircleRadius[0][fMax] + 70;
//   
//   $('.modeIcon').text(fMax + 1);
//   $('.modeIcon').css('top', fingerCenter.y - iconSS/2).css('left', fingerCenter.x - iconSS/2);
//   // $('.modeIcon').css('width', iconSS).css('height', iconSS);
//   
//   window.setTimeout(function(){
//     $('.modeIcon').addClass('display');
//   }, 1);
// }





function changeTopDisplayIcon() {

    // $('#tdIcon'+ (lastFMax+1) +''+ (lastUS)).addClass('closeNow');
    // window.setTimeout(function(){
    // $('#tdIcon'+ (fMax+1) +''+ (uS)).removeClass('closeNow');

    $('.tdIcon').css('display', 'none');
    $('#tdIcon'+ (fMax+1) +''+ (uS)).css('display', 'inline-block');

    $('#tdIconW').addClass('active');
    // }, 1);
}






function resetScale() {
    console.log('RESET SCALE');
    lastFMax = initFMax;
    lastUS = initUS;

    // if (units[initFMax][initUS].now > units[initFMax][initUS].max) {
    //   units[initFMax][initUS].now == units[initFMax][initUS].min;
    // } else if (units[initFMax][initUS].now < units[initFMax][initUS].min) {
    //   units[initFMax][initUS].now = units[initFMax][initUS].max;
    // }

    var unitSize = units[initFMax][initUS].unitSize;
    var cU = units[initFMax][initUS];

    //-------------------------------------------------- determine scale offset

    scaleOffset = (unitSize - fingerCenter.y % unitSize) + Math.floor(unitSize/2);
    if (scaleOffset > unitSize) {
        scaleOffset -= unitSize;
    }
    // console.log('scaleOffset', scaleOffset);

    yOffset = scaleOffset;


    $('#scale').css('top', -scaleOffset+'px');

    $('.scaleUnit').css('height', unitSize + 'px');
    // $('#scaleIndicator').css('height', units[fMax][uS].unitSize);
    $('.scaleUnit.touched').removeClass('touched');
    $('.scaleUnit.originTouched').removeClass('originTouched');


    if (cU.kind == 'numbers') {
        // $('#tdText').removeClass('images');
        displayNewStatus(cU.now + cU.suffix, cU.now);
        $('.songImage').css('display', 'none');
        $('.songImage').css('display', 'none');

    } else if (cU.kind == 'text') {
        // $('#tdText').removeClass('images');
        displayNewStatus(cU.labels[cU.now], cU.labels[cU.now]);
        $('.songImage').css('display', 'none');

    } else if (cU.kind == 'images') {
        // $('#tdText').addClass('images');
        displayNewStatus('&nbsp;', cU.labels[cU.now]);
        $('.songImage').css('display', 'none');
        $('#songImage'+(cU.now+1)%cU.labels.length).css('display', 'inline-block');
    }


}










function updateScale() {
    // console.log('UPDATE SCALE');

    var unitSize = units[initFMax][initUS].unitSize;

    var yDiffInUnits = originUnit - lastUnit;

    $('.scaleUnit.touched').removeClass('touched');

    if (yDiffInUnits == 0) {
        // $('.scaleUnit:nth-child('+ (originUnit+1) +')').addClass('touched');

    } else if (yDiffInUnits < 0) {
        $('.scaleUnit:nth-child(n+' + (originUnit+2) +'):nth-child(-n+'+ (originUnit-yDiffInUnits+1) +')').addClass('touched');

    } else if (yDiffInUnits > 0) {
        $('.scaleUnit:nth-child(n+' + (originUnit-yDiffInUnits+1) +'):nth-child(-n+'+ (originUnit) +')').addClass('touched');
    }

    $('.scaleUnit:nth-child('+ (originUnit+1) +')').addClass('originTouched').addClass('touched');




    units[initFMax][initUS].now = parseFloat(units[initFMax][initUS].last) + yDiffInUnits * units[initFMax][initUS].increment;
    units[initFMax][initUS].now = roundToDec(units[initFMax][initUS].now, units[initFMax][initUS].decimals);

    // if (units[initFMax][initUS].now > units[initFMax][initUS].max) {
    //   units[initFMax][initUS].now == units[initFMax][initUS].min;
    // } else if (units[initFMax][initUS].now < units[initFMax][initUS].min) {
    //   units[initFMax][initUS].now = units[initFMax][initUS].max;
    // }

    var cU = units[initFMax][initUS];

    if (cU.kind == 'numbers') {
        displayNewStatus(cU.now + cU.suffix, cU.now);
        $('.songImage').css('display', 'none');
        // $('#tdText').css('background-image', '');

    } else if (cU.kind == 'text') {
        displayNewStatus(cU.labels[cU.now], cU.labels[cU.now]);
        $('.songImage').css('display', 'none');
        // $('#tdText').css('background-image', '');

    } else if (cU.kind == 'images') {
        displayNewStatus('&nbsp;', cU.labels[Math.abs(cU.now) % cU.labels.length]);
        $('.songImage').css('display', 'none');
        $('#songImage'+ Math.abs(cU.now) % cU.labels.length ).css('display', 'inline-block');
        // $('#tdText').css('background-image', 'url("icons/song'+cU.now+'.png")');
    }


    // displayNewStatus(units[initFMax][initUS].now + units[initFMax][initUS].suffix, units[initFMax][initUS].now);

}





function saveUnitValueChange() {

    console.log('fMax uS', fMax, uS);
    units[lastFMax][lastUS].last = units[lastFMax][lastUS].now;

}




// function updateUnitValue() {
//   
//   return false;
// 
// }





function minTwoFingersPlaced() {
    // noFingers = false;

    $('.MC').addClass('active');

    // $('body').css('background', '#505050');
    // $('.fadeAway').removeClass('fadeAway');

}






function allFingersRemoved() {
    noFingers = true;
    console.log('fmax and us set to', -1)
    uS = -1;
    fMax = -1;
    console.log('no fingers');

    $('.MC').removeClass('active');
    $('#tdIconW').removeClass('active');

    $('#fingerCircle').removeClass('colorChange');

    // $('.scaleUnit.touched').addClass('fadeAway');
    // $('.scaleUnit.originTouched').addClass('fadeAway');

    // $('.scaleUnit.touched').removeClass('touched');
    // $('.scaleUnit.originTouched').removeClass('originTouched');


    // $('body').css('background', '#303030');

    // $('.modeIcon').removeClass('display');
}







function disableMap() {
    mapShowing = false;
    $('#mapOverlay').addClass('idle');
    $('#mapButton').removeClass('idle');
    $('#mapButton').bind('click', function(event){
        event.preventDefault();
        enableMap();
        hideTutorialIcons();
    });
}



function enableMap() {
    mapShowing = true;
    $('#mapOverlay').removeClass('idle');
    $('#mapButton').addClass('idle');
}





function showTutorialIcons() {
    $('.tutorialIcon').addClass('active');
}

function hideTutorialIcons() {
    $('.tutorialIcon').removeClass('active');
}




















function displayNewStatus(statusString, stringNoUnits) {

    $('#tdText').html(statusString);
    // $('#tdSubText').html(units[fMax][uS].desc);
    $('#tag .rectangle').html(stringNoUnits);


}














function placeCircle(id, x, y, radius) {
    $(id).css('left', x + 'px').css('top', y + 'px').css('margin', '-' + radius + 'px');
};


function scaleCircle(id, radius) {
    $(id).css('height', radius*2+'px').css('width', radius*2+'px');
}


function getDistance(point1, point2) {
    var xDist, yDist;
    xDist = Math.abs(point1.pageX - point2.x);
    yDist = Math.abs(point1.pageY - point2.y);
    return Math.sqrt(xDist*xDist + yDist*yDist);
}


function getAngle(point1, point2) {

}



























