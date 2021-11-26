import { extMsg } from "src/const";

export default async function getLoginFromBg() {
  const getLoginPackage = async () =>
    new Promise((resolve) =>
      chrome.runtime.sendMessage(
        { message: extMsg.EXT_LOGIN_PACKAGE_REQUEST },
        function (response) {
          resolve(response.payload);
        }
      )
    );
  const loginPackage: any = await getLoginPackage();

  return loginPackage ?? "";
}
