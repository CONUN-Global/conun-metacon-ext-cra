/*global chrome */

import { handleExtensionMessage } from "./modules/func/extensionMessageHandler/index.mjs";
import { handleExternalMessages } from "./modules/func/externalMessageHandler/index.mjs";

// Messages from Webapp
chrome.runtime.onMessageExternal.addListener(async function (
  request,
  _,
  sendResponse
) {
  handleExternalMessages(request, sendResponse);
});

// Messages from extension
chrome.runtime.onMessage.addListener(function (request, _, sendResponse) {
  handleExtensionMessage(request, sendResponse);
});
