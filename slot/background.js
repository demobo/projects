chrome.app.runtime.onLaunched.addListener(function() {
	chrome.app.window.create(
        'app.html',
        {
//            state: "fullscreen",
            frame: 'chrome',
            resizable: false
        }
    );

    chrome.app.window.create(
        'app2.html',
        {
//            state: "fullscreen",
            frame: 'chrome',
            resizable: false
        }
    );
});
