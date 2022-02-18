export function openExtInTab() {
  chrome.tabs.create({ url: chrome.runtime.getURL("index.html") });
}

export function openPageInTab(page: string) {
  chrome.tabs.create({
    url: chrome.runtime.getURL("index.html#" + page + "?tab=true"),
  });
}
/* 

This function needs to run only when the extension is open in the popup

Possible APIs that can help:

chrome.extension.getExtensionTabs / getViews
chrome.instance.getID



*/
