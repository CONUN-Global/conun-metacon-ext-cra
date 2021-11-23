import { extMsg } from "src/const";

export default async function sendTxnsToBkg(txnsToSend:any) {
  const sendTxns = async () =>
    new Promise((resolve) =>
      chrome.runtime.sendMessage(
        { message: extMsg.EXT_SEND_TXNS, payload:txnsToSend },
        function (response) {
          resolve(response.payload);
        }
      )
    );
  const txns: any = await sendTxns();

  return txns ?? [];
}
