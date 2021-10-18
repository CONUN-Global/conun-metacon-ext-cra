chrome.runtime.sendMessage(
  "lndoindcpdpifcbcjdbpjmemfhhemloi",
  { message: "WEBAPP_HELLO", payload: null },
  (response) => {
    console.log(`Extension Responds:`, response);

    if (response.success) {
      console.log("Success");
    } else {
      console.log("Failure");
    }
  }
);