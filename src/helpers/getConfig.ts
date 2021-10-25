import instance from "../axios/instance";

/**
 * getConfig:
 * Check for config data in local storage
 *
 * if present, return it
 * if not present, fetch from API
 *
 * @returns contract config data
 */

// Promise<ContractConfigResponseObj>
async function getConfig() {

    console.log("Fetching...")
    const { data: configData }: any = await instance.get("/users/getConfig");
    console.log("This data was fetched", configData);
    return configData.payload;
  
}

export default getConfig;
