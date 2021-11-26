/*global chrome */

let LOGIN_PACKAGE = null;
let TXNS = null;

const extMsg = {
  WEBAPP_SEND_AUTH: "WEBAPP_SEND_AUTH",
  BKG_AUTH_KEY_RECEIVED: "BKH_AUTH_KEY_RECEIVED",

  WEBAPP_SEND_LOGIN: "WEBAPP_SEND_LOGIN",
  BKG_PACKAGE_RECEIVED: "BKG_PACKAGE_RECEIVED",

  WEBAPP_SEND_TXNS: "WEBAPP_SEND_TXNS",
  BKG_TXNS_RECEIVED: "BKG_TXNS_RECEIVED",

  EXT_LOGIN_PACKAGE_REQUEST: "EXT_LOGIN_PACKAGE_REQUEST",
  BKG_SEND_LOGIN_PACKAGE: "BKG_SEND_AUTH_KEY_PACKAGE",

  EXT_AUTH_REQUEST: "EXT_AUTH_REQUEST",
  BKG_SEND_AUTH_KEY: "BKG_SEND_AUTH_KEY",

  EXT_TXN_REQUEST: "EXT_TXN_REQUEST",
  BKG_SEND_TXNS: "BKG_SEND_TXNS",

  EXT_SEND_TXNS: "EXT_SEND_TXNS",

  WEBAPP_SEND_LOGOUT_REQUEST: "WEBAPP_SEND_LOGOUT_REQUEST",
  BKG_LOGOUT_ACKNOWLEDGED: "BKG_LOGOUT_ACKNOWLEDGED",
};

const METACON_LOGIN = "METACON_LOGIN";
const METACON_TXNS = "METACON_TXNS";
const METACON_LOGGER_ACTIVE = "METACON_LOGGER_ACTIVE";

// Messages from Webapp
chrome.runtime.onMessageExternal.addListener(async function (
  request,
  sender,
  sendResponse
) {
  console.log(`sender`, sender.url)
  if (request.message === extMsg.WEBAPP_SEND_LOGIN) {
    LOGIN_PACKAGE = request.payload;
    chrome.storage.sync.set({ METACON_LOGIN: request.payload });
    chrome.storage.sync.set({
      METACON_LOGGER_ACTIVE: request.payload.webAppUsingLogger,
    });
    sendResponse({ success: true, message: extMsg.BKG_PACKAGE_RECEIVED });
  } else if (request.message === extMsg.WEBAPP_SEND_TXNS) {
    chrome.storage.sync.set({ METACON_TXNS: request.payload });
    sendResponse({ success: true, message: extMsg.BKG_PACKAGE_RECEIVED });
  } else if (request.message === extMsg.WEBAPP_SEND_LOGOUT_REQUEST) {
    chrome.storage.sync.set({ [METACON_LOGIN]: null });
    chrome.storage.sync.set({ [METACON_TXNS]: null });
    chrome.storage.sync.set({ [METACON_LOGGER_ACTIVE]: null });
    sendResponse({ success: true, message: extMsg.BKG_LOGOUT_ACKNOWLEDGED });
  }
});

// Messages from extension
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === extMsg.EXT_LOGIN_PACKAGE_REQUEST) {
    if (LOGIN_PACKAGE) {
      sendResponse({
        success: true,
        message: extMsg.BKG_SEND_LOGIN_PACKAGE,
        payload: LOGIN_PACKAGE,
        extra: "From runtime",
      });
    } else {
      chrome.storage.sync.get(METACON_LOGIN, function (value) {
        sendResponse({
          success: true,
          message: extMsg.BKG_SEND_LOGIN_PACKAGE,
          payload: value,
          extra: "From infernal storage",
        });
      });
    }
  } else if (request.message === extMsg.EXT_TXN_REQUEST) {
    if (TXNS) {
      sendResponse({
        success: true,
        message: extMsg.BKG_SEND_TXNS,
        payload: TXNS,
        extra: "From runtime",
      });
    } else {
      chrome.storage.sync.get(METACON_TXNS, function (value) {
        sendResponse({
          success: true,
          message: extMsg.BKG_SEND_TXNS,
          payload: value,
          extra: "From infernal storage",
        });
      });
    }
  } else if (request.message === extMsg.EXT_SEND_TXNS) {
    TXNS = [request.payload, ...TXNS];

    if (TXNS.length > 10) {
      TXNS.splice(10);
    }
    sendResponse({
      success: true,
      message: extMsg.BKG_TXNS_RECEIVED,
      payload: TXNS,
    });
  }
});
