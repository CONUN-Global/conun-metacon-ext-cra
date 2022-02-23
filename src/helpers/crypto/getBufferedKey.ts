import web3 from "src/web3";

export function getBufferedKey(etherKey:string, from: string){
  web3.eth.defaultAccount = from!;
  let formattedPrivateKey = etherKey || "";
  if (formattedPrivateKey.includes("0x")) {
    formattedPrivateKey = formattedPrivateKey.slice(
      2,
      formattedPrivateKey.length
    );
  }
  return Buffer.from(formattedPrivateKey, "hex");
};