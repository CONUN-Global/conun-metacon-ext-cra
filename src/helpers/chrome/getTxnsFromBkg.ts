import { extMsg } from "src/const";

export default async function getTxnsFromBg() {
  const getTxns = async () =>
    new Promise((resolve) =>
      chrome.runtime.sendMessage(
        { message: extMsg.EXT_TXN_REQUEST },
        function (response) {
          resolve(response.payload);
        }
      )
    );
  const loginPackage: any = await getTxns();

  return loginPackage ?? "";
}
