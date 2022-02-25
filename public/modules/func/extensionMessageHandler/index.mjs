/* global chrome */

import { extMsg, storageKeys } from "../../const.mjs";

function handleLoginPackageRequest(sendResponse) {
  chrome.storage.sync.get(storageKeys.METACON_LOGIN, function (value) {
    sendResponse({
      success: true,
      message: extMsg.BKG_SEND_LOGIN_PACKAGE,
      payload: value,
      extra: "From infernal storage",
    });
  });
}

export function handleExtensionMessage(request, sendResponse) {
  switch (request.message) {
    case extMsg.EXT_LOGIN_PACKAGE_REQUEST:
      handleLoginPackageRequest(sendResponse);
      break;
    default:
      break;
  }
}
