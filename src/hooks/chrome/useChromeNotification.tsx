function useChromeNotification() {
  function sendNotification(
    title: string,
    message: string,
    contextMessage: string = ""
  ) {
    chrome.notifications.create({
      iconUrl: "./favicon.ico",
      title,
      message,
      contextMessage,
      type: "basic",
    });
  }

  const swapNotification = (message: string) => {
    sendNotification("Metacon", message, "Swap Transaction Update");
  };
  const transferNotification = (message: string) => {
    sendNotification("Metacon", message, "Transfer Transaction Update");
  };

  return {
    swapNotification,
    transferNotification,
  };
}

export default useChromeNotification;
