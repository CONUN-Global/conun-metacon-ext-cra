import { getExtensionID } from "./chrome/chromeExtID";

export default function generateReferrer() {
  const extensionID = getExtensionID();

  const objString = JSON.stringify([extensionID, Date.now().toString()]);
  return btoa(objString);
}
