export function openExtInTab() {
  chrome.tabs.create({ url: chrome.runtime.getURL("index.html") });
}
