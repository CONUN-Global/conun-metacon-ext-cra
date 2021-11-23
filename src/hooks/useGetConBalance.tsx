import { useQuery } from "react-query";

import web3 from "src/web3";

import useCurrentUser from "./useCurrentUser";

import getConfig from "../helpers/getConfig";

function useGetConBalance() {
  const { currentUser, isLoading:isLoadingUser } = useCurrentUser();

  const { data, isLoading, refetch, isFetching } = useQuery(
    "get-con-balance",
    async () => {
      const configData = await getConfig();

      const contract = new web3.eth.Contract(
        configData?.conContract?.abiRaw,
        configData?.conContract?.address
      );

      const data = await contract.methods
        .balanceOf(currentUser?.walletAddress)
        .call();

      const balance = web3.utils.fromWei(data);

      return { payload: balance };
    },
    {
      enabled: !!currentUser?.walletAddress && !isLoadingUser,
      cacheTime: 0,
      refetchOnMount: true,
      refetchOnWindowFocus: true,
      staleTime: 0,
    }
  );

  return { balance: data, loading: isLoading, refetch, isFetching };
}

export default useGetConBalance;
