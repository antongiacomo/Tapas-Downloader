chrome.runtime.onMessage.addListener(function (arg, sender, sendResponse) {
    [].map.call(arg, (url) => {
        var filename = url.substring(url.lastIndexOf("/") + 1);
        chrome.downloads.download({
            url: url,
            filename: filename,
            saveAs: false,
        });
    });
});