function useChromeNotification() {
  function sendNotification(
    title: string,
    message: string,
    contextMessage: string = ""
  ) {
    chrome.notifications.create({
      title,
      message,
      contextMessage,
      type: "basic",
    });
  }

  const swapNotification = (message: string) => {
    sendNotification("Metacon", message, "Swap Transaction Update");
  };

  return {
    swapNotification,
  };
}

export default useChromeNotification;
