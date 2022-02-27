// Initialize butotn with users's prefered color
let changeColor = document.getElementById("changeColor");
let img = document.getElementById("button_img");
var block = document.getElementById("imgs");

chrome.tabs.query({ active: true, currentWindow: true }).then(([tab]) => {
  chrome.scripting.executeScript(
    {
      target: { tabId: tab.id },
      function: loadImages,
    },
    (urls) => {
      for (const frameResult of urls) {
        urls = frameResult.result;
        var imgs = urls.map(function (URL) {
          var img = document.createElement("img");
          img.src = URL;
          block.appendChild(img);
          return img;
        });
      }
    }
  );
});

changeColor.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: setPageBackgroundColor,
  });
});

// The body of this function will be execuetd as a content script inside the
// current page
function loadImages() {
  function isValidHttpUrl(string) {
    let url;

    try {
      url = new URL(string);
    } catch (_) {
      return false;
    }

    return url.protocol === "http:" || url.protocol === "https:";
  }

  imgs = document.getElementsByClassName("content__img");
  urls = [].map.call(imgs, (img) => img.src);
  urls = urls.filter((url) => isValidHttpUrl(url));
  chrome.storage.local.set({ urls: urls });

  return urls;
}

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

  imgs = document.getElementsByClassName("content__img");
  urls = [].map.call(imgs, (img) => img.src);
  urls = urls.filter((url) => isValidHttpUrl(url));

  console.log(urls);
  chrome.storage.sync.set({ urls });
  chrome.runtime.sendMessage(urls);
}
