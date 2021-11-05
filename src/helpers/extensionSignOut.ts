import { METACON_LOGGER_ACTIVE, METACON_LOGIN, METACON_TXNS } from "src/const";

export function extensionSignOut() {
  chrome.storage.sync.set({ [METACON_LOGIN]: null });
  chrome.storage.sync.set({ [METACON_TXNS]: null });
  chrome.storage.sync.set({ [METACON_LOGGER_ACTIVE]: null });
}
