import { useQuery } from "react-query";

import useCurrentUser from "./useCurrentUser";

import web3 from "src/web3";

function useGetConBalance() {
  const { currentUser } = useCurrentUser();

  const { data, isLoading, refetch, isFetching } = useQuery(
    "get-con-balance",
    async () => {
      const contract = new web3.eth.Contract(
        JSON.parse(process.env.NEXT_PUBLIC_ABI || ""),
        process.env.NEXT_PUBLIC_CONTRACT_ADDRESS
      );

      const data = await contract.methods
        .balanceOf(currentUser?.walletAddress)
        .call();

      const balance = await web3.utils.fromWei(data);

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

export default useGetConBalance;
