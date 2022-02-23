import { getChromeStorage } from "../chrome/chromeStorage";

import { METACON_LOGIN } from "src/const";

export async function getIdentity() {
  const res = await getChromeStorage(METACON_LOGIN);
  return res;
}
