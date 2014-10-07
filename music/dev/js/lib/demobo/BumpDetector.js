// from https://github.com/leecrossley/cordova-plugin-shake-detection/blob/master/www/shake.js
define(function(require, exports, module) {
    module.exports = (function () {
        var smoothFun = function(x, x_new, fac){
            return fac * x + (1 - fac) * x_new;

        };
        //"use strict";
        var bump = {},
            watchId = null,
            options = { frequency: 100 },
            previousAcceleration = { x: null, y: null, z: null , timestamp: 0},
            bumpCallBack = null,
            smooth = {x: null, y:null, z:null},
            smoothSample = [],
            sampleSize = 4,
            threshold = .5,
            smoothedVariation = null,
            smoothedVariationPreLast = null,
            smoothedVariationLast = null;

        bump.delay = sampleSize * options.frequency;

        // Start watching the accelerometer for a bump gesture
        bump.startWatch = function (onBump) {
            if (onBump) {
                bumpCallBack = onBump;
            }
            watchId = navigator.accelerometer.watchAcceleration(getAccelerationSnapshot, handleError, options);
        };

        // Stop watching the accelerometer for a bump gesture
        bump.stopWatch = function () {
            if (watchId !== null) {
                navigator.accelerometer.clearWatch(watchId);
                watchId = null;
            }
        };

        // Gets the current acceleration snapshot from the last accelerometer watch
        function getAccelerationSnapshot() {
            navigator.accelerometer.getCurrentAcceleration(assessCurrentAcceleration, handleError);
        }

        // Assess the current acceleration parameters to determine a bump
        function assessCurrentAcceleration(acceleration) {
            var accelerationChange = {};
//            if (previousAcceleration.x !== null) {
//                // ---------------- change , to -
//                accelerationChange.x = Math.abs(previousAcceleration.x - acceleration.x);
//                accelerationChange.y = Math.abs(previousAcceleration.y - acceleration.y);
//                accelerationChange.z = Math.abs(previousAcceleration.z - acceleration.z);
//            }
//            cur = acceleration.x * acceleration.x + acceleration.y * acceleration.y + acceleration.z * acceleration.z;
//            pre = cur;


            if(smooth.x === null){
                smooth.x = acceleration.x;
                smooth.y = acceleration.y;
                smooth.z = acceleration.z;

            }else{
                smooth.x = smoothFun(smooth.x, acceleration.x, 0.9);
                smooth.y = smoothFun(smooth.y, acceleration.y, 0.9);
                smooth.z = smoothFun(smooth.z, acceleration.z, 0.9);
            }
            smoothSample.push(_.clone(smooth));
            if(smoothSample.length > sampleSize){
                checkThreshold();
                smoothSample = [];
            }
        }

        function checkThreshold(){
            var minVal = _.clone(smooth);
            var maxVal = _.clone(smooth);
            for(var i = 0; i < smoothSample.length; ++i){
                minVal.x = Math.min(minVal.x, smoothSample[i].x);
                minVal.y = Math.min(minVal.y, smoothSample[i].y);
                minVal.z = Math.min(minVal.z, smoothSample[i].z);
                maxVal.x = Math.max(maxVal.x, smoothSample[i].x);
                maxVal.y = Math.max(maxVal.y, smoothSample[i].y);
                maxVal.z = Math.max(maxVal.z, smoothSample[i].z);
            }

            var temp = {};
            temp.x = maxVal.x - minVal.x;
            temp.y = maxVal.y - minVal.y;
            temp.z = maxVal.z - minVal.z;
            var variation = Math.sqrt(temp.x * temp.x + temp.y * temp.y + temp.z * temp.z);
            if(smoothedVariation === null){
                smoothedVariation = variation;
                return;
            }
            smoothedVariation = smoothFun(smoothedVariation, variation, 0.9);
            if(smoothedVariationLast === null){
                smoothedVariationLast = smoothedVariation;
                return;
            }

            if(smoothedVariationPreLast === null){
                smoothedVariationPreLast = smoothedVariationLast;
                smoothedVariationLast = smoothedVariation;
                return;
            }
            if(smoothedVariationLast > smoothedVariationPreLast &&
                smoothedVariationLast > smoothedVariation &&
                smoothedVariationLast > threshold){
//                console.log("bumped");
                if(typeof bumpCallBack === "function") bumpCallBack();
            }
//            console.log(variation, smoothedVariation, smoothedVariationLast, smoothedVariationPreLast, "????");
            smoothedVariationPreLast = smoothedVariationLast;
            smoothedVariationLast = smoothedVariation;
        }
            //console.log(acceleration.x, acceleration.y, acceleration.z);
            //console.log("change", accelerationChange.x, accelerationChange.y, accelerationChange.z);
//            if (accelerationChange.x + accelerationChange.y + accelerationChange.z > 30) {
//                // bump detected
//                accelerationChange.timestamp = Math.abs(previousAcceleration.timestamp - acceleration.timestamp);
//                console.log('bumped', accelerationChange.timestamp,previousAcceleration.timestamp, acceleration.timestamp);
//                previousAcceleration.timestamp = acceleration.timestamp;
//                if(accelerationChange.timestamp >= 2000){
//                    if (typeof bumpCallBack === "function") {
//                        bumpCallBack();
//                    }
//                    bump.stopWatch();
//                    setTimeout(bump.startWatch, 1000); // ??
//                }
//                previousAcceleration.x = null;
//                previousAcceleration.y = null;
//                previousAcceleration.z = null;
//                previousAcceleration = {
//                    x: null,
//                    y: null,
//                    z: null
//                };
//            } else {
//                previousAcceleration.x = acceleration.x;
//                previousAcceleration.y = acceleration.y;
//                previousAcceleration.z = acceleration.z;
//                previousAcceleration = {
//                    x: acceleration.x,
//                    y: acceleration.y,
//                    z: acceleration.z
//                };
//            }
//        }


        // Handle errors here
        function handleError() {
        }

        return bump;
    })();
});