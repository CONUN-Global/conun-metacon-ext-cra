import { useQuery } from "react-query";
import { METACON_NOTIFICATIONS_ACTIVE } from "src/const";
import {
  setChromeStorage,
  getChromeStorage,
} from "src/helpers/chrome/chromeStorage";

function useChromeNotification() {
  function setNotificationOption(state: boolean) {
    setChromeStorage(METACON_NOTIFICATIONS_ACTIVE, state);
  }
  async function getNotificationOption(): Promise<Boolean> {
    return (await getChromeStorage(METACON_NOTIFICATIONS_ACTIVE)) as Boolean;
  }

  const { data: notificationsActive } = useQuery(
    "notifications-setting",
    async () => {
      return await getNotificationOption();
    },
    {
      refetchOnMount: "always",
    }
  );

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
    if (!!notificationsActive)
      sendNotification("Metacon", message, "Swap Transaction Update");
  };
  const transferNotification = (message: string) => {
    if (!!notificationsActive)
      sendNotification("Metacon", message, "Transfer Transaction Update");
  };

  return {
    swapNotification,
    transferNotification,
    setNotificationOption,
    notificationsActive,
  };
}

export default useChromeNotification;
