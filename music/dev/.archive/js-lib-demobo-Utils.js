var demobo=demobo||{};
(function(){var a={S4:function(){return(65536*(1+Math.random())|0).toString(16).substring(1)},guid:function(){return a.S4()+a.S4()+"-"+a.S4()+"-"+a.S4()+"-"+a.S4()+"-"+a.S4()+a.S4()+a.S4()},getDeviceID:_.memoize(function(){return"undefined"!=typeof demobo_guid?demobo_guid:a.guid()}),isChrome:_.memoize(function(){return navigator.userAgent.match(/(Chrome)/)}),isMobile:_.memoize(function(){return navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)}),isAndroid:_.memoize(function(){return navigator.userAgent.match(/(Android)/)}),isIOS:_.memoize(function(){return navigator.userAgent.match(/(iPhone|iPod|iPad)/)}),
generateCode:function(a){return Math.random().toString(36).substr(2,a)}};demobo.Utils=a})();
