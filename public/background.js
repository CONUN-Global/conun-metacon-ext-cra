/*global chrome */

let KEY = null;
let LOGIN_PACKAGE = null;
let TXNS = null;

const extMsg = {

  WEBAPP_SEND_AUTH :"WEBAPP_SEND_AUTH",
  BKG_AUTH_KEY_RECEIVED:"BKH_AUTH_KEY_RECEIVED",

  WEBAPP_SEND_LOGIN:"WEBAPP_SEND_LOGIN",
  BKG_PACKAGE_RECEIVED:"BKG_PACKAGE_RECEIVED",

  WEBAPP_SEND_TXNS: "WEBAPP_SEND_TXNS",
  BKG_TXNS_RECEIVED: "BKG_TXNS_RECEIVED",
  
  EXT_LOGIN_PACKAGE_REQUEST:"EXT_LOGIN_PACKAGE_REQUEST",
  BKG_SEND_LOGIN_PACKAGE:"BKG_SEND_AUTH_KEY_PACKAGE",
  
  EXT_AUTH_REQUEST:"EXT_AUTH_REQUEST",
  BKG_SEND_AUTH_KEY:"BKG_SEND_AUTH_KEY",

  EXT_TXN_REQUEST: "EXT_TXN_REQUEST",
  BKG_SEND_TXNS:"BKG_SEND_TXNS",

}

const METACON_AUTH = "METACON_AUTH";
const METACON_LOGIN ="METACON_LOGIN";
const METACON_TXNS = "METACON_TXNS";

chrome.runtime.onMessageExternal.addListener(async function (
  request,
  sender,
  sendResponse
) {

  // Receiving message from webpage
  if (request.message === extMsg.WEBAPP_SEND_AUTH){
    console.log("Received AUTH KEY from Metacon Webapp")
    KEY = request.payload;
    chrome.storage.sync.set({METACON_AUTH : request.payload}, function(){
      console.log("Auth was set to ", request.payload)
    })
    sendResponse({success: true, message: extMsg.BKG_AUTH_KEY_RECEIVED})
  }

  else if (request.message === extMsg.WEBAPP_SEND_LOGIN){
    console.log("Received LOGIN PACKAGE from Metacon Webapp")
    LOGIN_PACKAGE = request.payload;
    chrome.storage.sync.set({METACON_LOGIN : request.payload}, function(){
      console.log("Login was set to ", request.payload)
    })
    sendResponse({success: true, message: extMsg.BKG_PACKAGE_RECEIVED})
  }

  else if (request.message === extMsg.WEBAPP_SEND_TXNS){
    console.log("Received TXNS from Metacon Webapp")
    TXNS = request.payload;
    chrome.storage.sync.set({METACON_TXNS : request.payload}, function(){
      console.log("Txns were set to ", request.payload)
    })

  }
  console.log("Log all messages: ", request)
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){

  console.log("Background script received infernal message")
  console.log(request);
  if (request.message === extMsg.EXT_AUTH_REQUEST){
    console.log("Extension requests key")
    if (KEY){
      sendResponse({success: true, message: extMsg.BKG_SEND_AUTH_KEY, payload:KEY, extra:"From runtime var"})
    } else {
      chrome.storage.sync.get(METACON_AUTH, function(value){
        console.log("Value was retrieved", value)
        sendResponse({success: true, message: extMsg.BKG_SEND_AUTH_KEY, payload:value, extra:"From infernal storage"})
      })
    }
  }

  else if (request.message === extMsg.EXT_LOGIN_PACKAGE_REQUEST){
    console.log("Extension requests login details from bkg")
    if (LOGIN_PACKAGE){
      sendResponse({success: true, message: extMsg.BKG_SEND_LOGIN_PACKAGE, payload:LOGIN_PACKAGE, extra:"From runtime"})
    } else {
      chrome.storage.sync.get(METACON_LOGIN, function(value){
        console.log("Value was retrieved", value)
        sendResponse({success: true, message: extMsg.BKG_SEND_LOGIN_PACKAGE, payload:value, extra:"From infernal storage"})
      })
    }
  }

  else if (request.message === extMsg.EXT_TXN_REQUEST){
    console.log("Extension requests login details from bkg")
    if (TXNS){
      sendResponse({success: true, message: extMsg.BKG_SEND_TXNS, payload:TXNS, extra:"From runtime"})
    } else {
      chrome.storage.sync.get(METACON_TXNS, function(value){
        console.log("Value was retrieved", value)
        sendResponse({success: true, message: extMsg.BKG_SEND_TXNS, payload:value, extra:"From infernal storage"})
      })
    }
  }
})