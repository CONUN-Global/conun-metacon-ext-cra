import isWindowPresent from "./isWindowPresent";

export function getChromeAuthToken() {
  if (!isWindowPresent()) {
    return "";
  }
  return chrome.storage.local.get(["METACON_AUTH_KEY"]);
}

export function setChromeAuthToken(key: string) {
  chrome.storage.sync.set({"METACON_AUTH_KEY": key})
}


export async function getChromeAuthHeader() {
  const getToken = async () =>
    new Promise((resolve) =>
      chrome.storage.sync.get(["METACON_AUTH_KEY"], (result) => resolve(result))
    );

  const token: any = await getToken();

  return token ?? "";
}