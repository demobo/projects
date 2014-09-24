/*globals require*/
require.config({
    shim: {

    },
    paths: {
        famous: 'lib/famous',
        requirejs: 'lib/requirejs/require',
        almond: 'lib/almond/almond',
        ionicons: 'lib/ionicons/fonts/*',
        controls: '../controls',
        core: '../core',
        containers: '../containers'
    },
    packages: [

    ]
});

// http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

var toRequire = getParameterByName('require') || 'famous-demo';

require([toRequire]);
