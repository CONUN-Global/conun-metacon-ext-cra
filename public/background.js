/*global chrome */

let KEY = null;

chrome.runtime.onMessageExternal.addListener(function (
  request,
  sender,
  sendResponse
) {
  if (request) console.log("Verify a request was received")
  if (request.message) console.log("Request has message: ", request.message)
  
  // Receiving message from webpage
  if (request.message === "METACON_SEND_AUTH"){
    console.log("Received AUTH KEY from Metacon Webapp Ver.")
    KEY = request.payload;
    chrome.storage.sync.set({'METACONAUTH' : request.payload}, function(){
      console.log("Value was set to ", request.payload)
    })
    sendResponse({success: true, message: "AUTH_KEY_RECEIVED"})
  }
  console.log("Log all messages: ", request)
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){

  console.log("Background script received infernal message")
  console.log(request);
  if (request.message === "EXT_KEY_REQUEST"){
    console.log("Extension requests key")
    if (KEY){
      sendResponse({success: true, message: "AUTH_KEY_RECEIVED", payload:KEY, extra:"From runtime var"})
    } else {
      chrome.storage.sync.get('METACONAUTH', function(value){
        console.log("Value was retrieved", value)
        sendResponse({success: true, message: "AUTH_KEY_RECEIVED", payload:value, extra:"From infernal storage"})
      })
    }
  }

})