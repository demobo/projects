var demobo = demobo || {};

(function() {
    var DollarRecognizer  = demobo.Dollar3DRecognizer;

    demobo.SimpleBump = (function () {
//        this.dollarRecognizer = new DollarRecognizer([]);
//        window.dollarRecognizer = this.dollarRecognizer;
        //"use strict";
        var bump = {},
            dollarRecognizer = new DollarRecognizer(new Array([],[],[])),
            watchId = null,
            options = { frequency: 60 },
            bumpCallBack = null,
            samples = [],
            currIndex = 0,
            sampleSize = 100,
            margin = 32, // should great than 1
//            ref = new Firebase("https://demobofire.firebaseio.com/bumpData/gesture"),
//            sampleRef = new Firebase("https://demobofire.firebaseio.com/bumpData/gesture"),
            gesture = 0,
            threshold = 9,
            counter = 0,
            templateData = [],
            triggerRecognize = null;


        window.dollarRecognizer = this.dollarRecognizer;
        _.each(demobo.bumpData, function(data, index){
            dollarRecognizer.AddTemplate("g" + index, standardize(data.data,index));
            templateData.push(standardize(data.data));
        }.bind(this));
//        sampleRef.on('value', function(data){
//            window.dollarRecognizer = dollarRecognizer;
//            _.each(data.val(), function(data, index){
//                dollarRecognizer.AddTemplate("g" + index, standardize(data.data,index));
//                templateData.push(standardize(data.data));
//            });
//            window.template = templateData;
////            this.dollarRecognizer = new DollarRecognizer(templateData);
//        }.bind(this));

        function standardize(pointsData, i){
            var  standardizeData = [];
            standardizeData[0] = []; // x and y
            standardizeData[1] = []; // x and z
            standardizeData[2] = []; // y and z
            if(i)var num = parseInt(i.substring(1));
            _.each(pointsData, function(data, index){
                var XY = {};
                var XZ = {};
                var YZ = {};
                XY.X = _.clone(data.x);
                XY.Y = _.clone(data.y);
                XZ.X = _.clone(data.x);
                XZ.Y = _.clone(data.z);
                YZ.X = _.clone(data.y);
                YZ.Y = _.clone(data.z);
//                var atom = {};
//                atom.X = index * 2;
//                atom.Y = Math.floor(pointsData.length -  Math.abs(index - pointsData.length / 2));
//                atom.Y = Math.floor(50 + 200 * Math.random());
//                atom.X = Math.floor(120 / margin * index);
//                atom.Y = data.x * data.x + data.y * data.y + data.z * data.z;
//                atom.Y = Math.sqrt(data.x * data.x + data.y * data.y + data.z * data.z);
//                atom.X = Math.abs(Math.floor(data.x * 100));
//                atom.Y = Math.floor((data.y * 100 + 600)/3);
//                console.log(atom.X, atom.Y);
                standardizeData[0].push(XY);
                standardizeData[1].push(XZ);
                standardizeData[2].push(YZ);
            });
//            console.log(standardizeData);
            var result = [];
            result[0] = _.clone(standardizeData[0]);
            result[1] = _.clone(standardizeData[1]);
            result[2] = _.clone(standardizeData[2]);
            return _.clone(result);
        }


        // Start watching the accelerometer for a bump gesture
        bump.startWatch = function (onBump) {
            if (onBump) {
                bumpCallBack = onBump;
            }
            watchId = navigator.accelerometer.watchAcceleration(getAccelerationSnapshot, handleError, options);
            triggerRecognize = _.throttle(function(){
                setTimeout(function(){
                    var result = dollarRecognizer.Recognize(getData(), false);
                    var num = parseInt(result.Name.substring(2));
                    if(num <= 9 && counter <= 4){
                        console.log('success', result, "!!!!!!!!!!!", counter);
                        bumpCallBack();
                        counter = 0;
                    }else{
                        console.log('fail', result, "???????????", counter);
                        counter = 0;
                    }
                }, 200)
            }.bind(this), 500, {leading: false, trailing: false});
        };

        // Stop watching the accelerometer for a bump gesture
        bump.stopWatch = function () {
            console.log("stoped");
            if (watchId !== null) {
                navigator.accelerometer.clearWatch(watchId);
                watchId = null;
            }
            bumpCallBack = null;
            triggerRecognize = null;
        };

        // Gets the current acceleration snapshot from the last accelerometer watch
        function getAccelerationSnapshot() {
            navigator.accelerometer.getCurrentAcceleration(assessCurrentAcceleration, handleError);
        }

        // Assess the current acceleration parameters to determine a bump
        function assessCurrentAcceleration(acceleration) {
            // ----------------------------- collect data
            if(samples.length < sampleSize){
                ++ currIndex;
                samples.push(_.clone(acceleration));
            }else{
                ++ currIndex;
                currIndex = currIndex % samples.length;
                samples[currIndex] = _.clone(acceleration);
            }
            if(samples.length > margin * 2 && detectShake()){
                console.log('bumped');
            }
        }
        function takeSnapShot(){
            if(samples.length < sampleSize) return;
            var result = [];
            var start = (currIndex - margin * 2 + samples.length) % samples.length;
            for(var i = 0; i < margin * 2 ; ++i){
                result.push(_.clone(samples[(start + i) % samples.length]));
            }
//            console.log(result);
            var obj = {};
            obj['g' + gesture] = {};
            obj['g' + gesture].data =  _.extend({}, result) ;
            obj['g' + gesture].state = true;
            obj['g' + gesture].isBump = true;
            gesture ++;
            ref.update(obj);
        }
        var triggerSnapShot = _.throttle(function(){
            takeSnapShot.call(this);
        }.bind(this), 1000, {trailing: false});


        function detectShake(){
//            var leftData = samples[(currIndex + samples.length - 2 - margin) % samples.length];
//            var midData    = samples[(currIndex + samples.length - 1 - margin) % samples.length];
//            var rightData    = samples[(currIndex + samples.length - margin) % samples.length];
//            var leftForce = calculateForce(leftData);
//            var midForce = calculateForce(midData);
//            var rightForce = calculateForce(rightData);
//            if(Math.abs(midForce - leftForce) > threshold && Math.abs(midForce - rightForce)){
//                console.log('get it', leftForce, midForce, rightForce);
//                var result = dollarRecognizer.Recognize(getData(), false);
//                if(result.Name === 'gg0' || result.Name === 'gg1' || result.Name === 'gg2'){
//                    console.log('success', result, "!!!!!!!!!!!");
//                }else{
//                    console.log('fail', result, "???????????");
//                }
//                takeSnapShot();
//
//            }
//            console.log(samples, currIndex, samples.length);
            var force = calculateForce((samples[(currIndex - 1 + samples.length) % samples.length]));

            var relative = Math.abs(force - 9.8);
            if(relative > threshold){
                console.log('triggered', counter)
                counter ++;
//                triggerSnapShot.call(this);
                triggerRecognize.call(this);
            }

        }


        function getData(){
            var result = [];
            var start = (currIndex - margin * 2 + samples.length) % samples.length;
            for(var i = 0; i < margin * 2 ; ++i){
                result.push(_.clone(samples[(start + i) % samples.length]));
            }
            return standardize(result);
        }
        window.getData = getData;



        function calculateForce(data){
            return Math.sqrt(data.x * data.x + data.y * data.y + data.z * data.z);
        }

        // Handle errors here
        function handleError() {
        }
        //-------------------------
//        bump.prototype.enableSampleCollect = function(){
//            isAddSample = true;
//        };
//        bump.prototype.disableSampleCollect = function(){
//            isAddSample = false;
//        };


        return bump;
    })();

})();