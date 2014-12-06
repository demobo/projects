// from https://github.com/leecrossley/cordova-plugin-shake-detection/blob/master/www/shake.js
define(function(require, exports, module) {
    module.exports = (function () {
        //"use strict";
        var bump = {},
            watchId = null,
            options = { frequency: 300 },
            previousAcceleration = { x: null, y: null, z: null , timestamp: 0},
            bumpCallBack = null;

        // Start watching the accelerometer for a bump gesture
        bump.startWatch = function (onBump) {
            if (onBump) {
                bumpCallBack = onBump;
            }
            watchId = navigator.accelerometer.watchAcceleration(getAccelerationSnapshot, handleError, options);
        };

        // Stop watching the accelerometer for a bump gesture
        bump.stopWatch = function () {
            console.log("stoped");
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
            if (previousAcceleration.x !== null) {
                // ---------------- change , to -
                accelerationChange.x = Math.abs(previousAcceleration.x - acceleration.x);
                accelerationChange.y = Math.abs(previousAcceleration.y - acceleration.y);
                accelerationChange.z = Math.abs(previousAcceleration.z - acceleration.z);
            }
            //console.log(acceleration.x, acceleration.y, acceleration.z);
            //console.log("change", accelerationChange.x, accelerationChange.y, accelerationChange.z);
            if (accelerationChange.x + accelerationChange.y + accelerationChange.z > 10) {
                // bump detected
                accelerationChange.timestamp = Math.abs(previousAcceleration.timestamp - acceleration.timestamp);
                console.log('bumped', accelerationChange.timestamp,previousAcceleration.timestamp, acceleration.timestamp);
                previousAcceleration.timestamp = acceleration.timestamp;
                if(accelerationChange.timestamp >= 1000){
                    if (typeof bumpCallBack === "function") {
                        bumpCallBack();
                    }
                    bump.stopWatch();
                    setTimeout(bump.startWatch, 1000); // ??
                }
                previousAcceleration.x = null;
                previousAcceleration.y = null;
                previousAcceleration.z = null;
//                previousAcceleration = {
//                    x: null,
//                    y: null,
//                    z: null
//                };
            } else {
                previousAcceleration.x = acceleration.x;
                previousAcceleration.y = acceleration.y;
                previousAcceleration.z = acceleration.z;
//                previousAcceleration = {
//                    x: acceleration.x,
//                    y: acceleration.y,
//                    z: acceleration.z
//                };
            }
        }

        // Handle errors here
        function handleError() {
        }

        return bump;
    })();
});