import { getChromeStorage } from "./chrome/chromeStorage";

export async function getIsLoggerActive() {
  const shouldLog = await getChromeStorage("METACON_LOGGER_ACTIVE");

  return shouldLog || false;
}
