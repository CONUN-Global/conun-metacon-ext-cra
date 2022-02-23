export function setChromeStorage(keyName: string, payload: any) {
  chrome.storage.sync.set({ [keyName]: payload });
}

export async function getChromeStorage(keyName: string) {
  return new Promise((resolve, reject) => {
    try {
        chrome.storage.sync.get(keyName, function (value) {
            resolve(value[keyName]);
        })
    }
    catch (ex) {
        reject(ex);
    }
});
}