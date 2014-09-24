/*globals require*/
require.config({
    shim: {

    },
    paths: {
        famous: '../lib/famous',
        requirejs: '../lib/requirejs/require',
        almond: '../lib/almond/almond',
        controls: '../controls',
        core: '../core',
        containers: '../containers'
    },
    packages: [

    ]
});

require(["main"]);
