import instance from "../axios/instance";
import { getChromeStorage, setChromeStorage } from "./chromeStorage";
import { METACON_CONFIG } from "../const";

/**
 * getConfig:
 * Check for config data in chrome storage
 *
 * if present, return it
 * if not present, fetch from API
 *
 * @returns contract config data
 */

async function getConfigFromChromeStorage() {
  return await getChromeStorage(METACON_CONFIG);
}

async function getConfigFromSource() {
  const { data: configData }: any = await instance.get("/users/getConfig");
  return configData.payload;
}

async function getConfig() {
  const localConfig = await getConfigFromChromeStorage();
  if (localConfig) {

    return localConfig;
  } else {

    const sourceConfig = await getConfigFromSource();
    setChromeStorage(METACON_CONFIG, sourceConfig);
    return sourceConfig;
  }
}

export default getConfig;