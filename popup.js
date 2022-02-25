// Initialize butotn with users's prefered color
let changeColor = document.getElementById("changeColor");
let img = document.getElementById("button_img");
chrome.storage.sync.get("color", ({ color }) => {
    changeColor.style.backgroundColor = color;
});
chrome.storage.sync.get("url", ({ url }) => {
    img.src = url;
});

// When the button is clicked, inject setPageBackgroundColor into current page
changeColor.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: setPageBackgroundColor,
    });
});

// The body of this function will be execuetd as a content script inside the
// current page
function setPageBackgroundColor() {
    function isValidHttpUrl(string) {
        let url;

        try {
            url = new URL(string);
        } catch (_) {
            return false;
        }

        return url.protocol === "http:" || url.protocol === "https:";
    }

    chrome.storage.sync.get("color", ({ color }) => {
        //document.body.style.backgroundColor = color;
        imgs = document.getElementsByClassName("content__img");
        urls = [].map.call(imgs, (img) => img.src);
        urls = urls.filter((url) => isValidHttpUrl(url));

        console.log(urls);
        chrome.storage.sync.set({ urls });
        chrome.runtime.sendMessage(urls);
    });
}
