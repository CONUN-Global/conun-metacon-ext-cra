import { useQuery } from "react-query";
import { getChromeStorage } from "src/helpers/chrome/chromeStorage";
import { METACON_TXNS } from "src/const";
import { RecentTransaction } from "src/types";

function useGetTransactionsExt() {
  const { data, isLoading, isError } = useQuery("EXT_TXNS", async () => {
    const res = await getChromeStorage(METACON_TXNS);
    return res as RecentTransaction[];
  });
  return {
    txns: data,
    isLoading,
    isError,
  };
}

export default useGetTransactionsExt;
