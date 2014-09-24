define(function(require, exports, module) {
    module.exports = window.FamousUI = {
        Base: require('./UIBase'),
        Element: require('./UIElement'),
        Component: require('./UIComponent')
    };
});
