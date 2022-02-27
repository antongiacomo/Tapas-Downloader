// Initialize butotn with users's prefered color
let downloadButton = document.getElementById("download-button");
var block = document.getElementById("imgs");
var imageUrlList = [];
chrome.tabs.query({ active: true, currentWindow: true }).then(([tab]) => {
  chrome.scripting.executeScript(
    {
      target: { tabId: tab.id },
      function: loadImages,
    },
    (urls) => {
      for (const frameResult of urls) {
        imageUrlList = frameResult.result;

        var imgs = imageUrlList.map(function (URL) {
          var img = document.createElement("img");
          img.src = URL;
          block.appendChild(img);
          return img;
        });
      }
    }
  );
});

downloadButton.addEventListener("click", async () => {
  downloadImages(imageUrlList);
});

// The body of this function will be execuetd as a content script inside the
// current page
function loadImages() {
  const filterUrl = (imgs) => {
    urls = [].map.call(imgs, (img) => img.src);
    urls = urls.filter((url) => isValidHttpUrl(url));
    return urls;
  };

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
  urls = filterUrl(imgs);
  // chrome.storage.local.set({ urls: urls });

  return urls;
}

function downloadImages(urls) {
  chrome.runtime.sendMessage(urls);
}
