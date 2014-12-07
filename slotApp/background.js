chrome.app.runtime.onLaunched.addListener(function() {
	chrome.app.window.create(
        'app.html',
        {
            width: screen.width,
            height: screen.height,
//            state: "fullscreen",
            frame: 'chrome',
//            frame: 'none',
//            resizable: false
        },
        function(win) {
            appWin = win;
            setTimeout(function(){
                appWin.resizeTo(screen.width-100, screen.height-100);
                setTimeout(function(){
                    appWin.resizeTo(screen.width, screen.height);
                },500);
            },500);
        }
    );

    chrome.app.window.create(
        'app2.html',
        {
            width: screen.width,
            height: screen.height,
//            state: "fullscreen",
            frame: 'chrome',
//            frame: 'none',
//            resizable: false
        },
        function(win) {
            app2Win = win;
            setTimeout(function(){
                app2Win.resizeTo(screen.width-100, screen.height-100);
                setTimeout(function(){
                    app2Win.resizeTo(screen.width, screen.height);
                    setTimeout(function(){
                        app2Win.moveTo(0,screen.height);
                    },500);
                },500);
            },500);
        }
    );
});
