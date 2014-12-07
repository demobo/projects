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
                    setTimeout(function () {
                        appWin.fullscreen();
                    }, 5000);
                },500);
            },500);
            appWin.onClosed.addListener(function () {
                if (app2Win) app2Win.close();
            });
        }
    );

	var w = 1024;
	var h = 768;
    chrome.app.window.create(
        'app2.html',
        {
            width: w,
            height: h,
//            state: "fullscreen",
            frame: 'chrome',
//            frame: 'none',
//            resizable: false
        },
        function(win) {
            app2Win = win;
            setTimeout(function(){
                app2Win.resizeTo(w-100, h-100);
                setTimeout(function(){
                    app2Win.resizeTo(w, h);
                    setTimeout(function(){
                        app2Win.moveTo(0, screen.height);
                        //ap2pWin.fullscreen();
                    },500);
                },5000);
            }, 500);
            app2Win.onClosed.addListener(function () {
                if (appWin) appWin.close();
            });
        }
    );

    
});
