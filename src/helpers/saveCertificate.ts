import { getIdentity } from "./identity";

export function saveFileIdentity(walletAddress: string) {
  console.log("importbackup");
  const blob = new Blob([btoa(JSON.stringify(getIdentity()).toString())], {
    type: "text/plain;charset=utf-8",
  });
  saveAs(blob, `${walletAddress}.json`);
}

/* 

Identity is an object:


{"walletAddress":"","credentials":{"certificate":"","privateKey":""},"mspId":"","type":""}

This is the contents of the certificate.
These should exist in the background's login package.


*/
