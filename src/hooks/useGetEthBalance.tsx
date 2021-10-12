import { useQuery } from "react-query";
import web3 from "src/web3";

import useCurrentUser from "./useCurrentUser";

function useGetEthBalance() {
  const { currentUser } = useCurrentUser();

  const { data, isLoading, refetch, isFetching } = useQuery(
    "get-eth-balance",
    async () => {
      const wei = await web3.eth.getBalance(currentUser?.walletAddress || "");
      const balance = web3.utils.fromWei(wei, "ether");
      return { payload: balance };
    },
    {
      enabled: !!currentUser?.walletAddress,
      cacheTime: 0,
      refetchOnMount: true,
      refetchOnWindowFocus: true,
      staleTime: 0,
    }
  );

  return { balance: data, loading: isLoading, refetch, isFetching };
}

export default useGetEthBalance;
