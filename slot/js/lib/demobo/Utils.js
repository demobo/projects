var demobo = demobo || {};

(function() {
    var u = {
        // Generate four random hex digits.
        S4: function() {
            return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
        },

        // Generate a pseudo-GUID by concatenating random hexadecimal.
        guid: function() {
            return (u.S4()+ u.S4()+"-"+ u.S4()+"-"+ u.S4()+"-"+ u.S4()+"-"+ u.S4()+ u.S4()+ u.S4());
        },

        getDeviceID: _.memoize(function() {
            return (typeof demobo_guid != 'undefined') ? demobo_guid : u.guid();
        }),

        isChrome: _.memoize(function () {
            return navigator.userAgent.match(/(Chrome)/);
        }),
        
        isMobile: _.memoize(function () {
	        return navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/);
	    }),

        isAndroid: _.memoize(function () {
            return navigator.userAgent.match(/(Android)/);
        }),

        isIOS: _.memoize(function () {
            return navigator.userAgent.match(/(iPhone|iPod|iPad)/);
        })
    };

    demobo.Utils = u;
})();