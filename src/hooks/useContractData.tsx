import { useQuery } from "react-query";
import getConfig from "src/helpers/getConfig";
import { ContractConfigResponseObj } from "src/types";

const useContractData = () => {
  const { data, isLoading } = useQuery<ContractConfigResponseObj>("contract-config", async () => {
    return await getConfig();
  });

  return {
    contractConfigData: data,
    isLoadingConfig: isLoading,
  };
};

export default useContractData;
