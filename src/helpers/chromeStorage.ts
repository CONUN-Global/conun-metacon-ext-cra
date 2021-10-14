export function setChromeStorage(keyName: string, payload: any) {
  chrome.storage.sync.set({ [keyName]: payload });
}

export async function getChromeStorage(keyName: string) {
  return new Promise<any>((resolve) =>
      chrome.storage.sync.get(keyName, (result) => resolve(result))
    );
}
