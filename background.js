let color = "#818cf8";

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ color });
    console.log("Default background color set to %cgreen", `color: ${color}`);
});

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
