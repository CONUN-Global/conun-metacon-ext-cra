/* global chrome */

import { extMsg, storageKeys } from "../../const.mjs";

function handleReceiveLogin(request, sendResponse) {
  chrome.storage.sync.set({ [storageKeys.METACON_LOGIN]: request.payload });
  chrome.storage.sync.set({
    [storageKeys.METACON_LOGGER_ACTIVE]: request.payload.webAppUsingLogger,
  });
  chrome.storage.sync.set({ [storageKeys.METACON_NOTIFICATIONS_ACTIVE]: true });
  sendResponse({ success: true, message: extMsg.BKG_PACKAGE_RECEIVED });
}

function handleLogoutRequest(sendResponse) {
  chrome.storage.sync.set({ [storageKeys.METACON_LOGIN]: null });
  chrome.storage.sync.set({ [storageKeys.METACON_TXNS]: null });
  chrome.storage.sync.set({ [storageKeys.METACON_LOGGER_ACTIVE]: null });
  chrome.storage.sync.set({ [storageKeys.METACON_NOTIFICATIONS_ACTIVE]: null });
  sendResponse({ success: true, message: extMsg.BKG_LOGOUT_ACKNOWLEDGED });
}

export function handleExternalMessages(request, sendResponse) {
  switch (request.message) {
    case extMsg.WEBAPP_SEND_LOGIN:
      handleReceiveLogin(request, sendResponse);
      break;
    case extMsg.WEBAPP_SEND_LOGOUT_REQUEST:
      handleLogoutRequest(sendResponse);
      break;
    default:
      break;
  }
}
