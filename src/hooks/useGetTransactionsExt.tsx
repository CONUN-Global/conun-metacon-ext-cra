import { useQuery } from "react-query";
import getTxnsFromBg from "src/helpers/getTxnsFromBkg";


function useGetTransactionsExt(){

   const {data, isLoading, isError} = useQuery("EXT_TXNS", async ()=> {
      const txns = await getTxnsFromBg();
      return txns
    })
    return {
      txns: data,
      isLoading,
      isError
    }



}

export default useGetTransactionsExt

