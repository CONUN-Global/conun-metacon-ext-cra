import { setRecentTransactions } from "../helpers/recentTransactions";
import useStore from "../store/store";
import { RecentTransaction } from "../types";

const TRANSACTION_LIMIT = 10;

function useTransactionList() {
  const recentTransactions = useStore((store) => store.recentTransactions);
  const setStoreRecentTransactions = useStore(
    (store) => store.setRecentTransactions
  );

  const getTransactions = () => {
    return recentTransactions;
  };

  const addTransaction = (transaction: RecentTransaction) => {
    const newTransactions = [transaction, ...recentTransactions];

    if (newTransactions.length > TRANSACTION_LIMIT) {
      newTransactions.splice(TRANSACTION_LIMIT);
    }
    setRecentTransactions(newTransactions);
    setStoreRecentTransactions(newTransactions);
  };

  const modifyTransactions = (transaction: RecentTransaction) => {
    const newTransactions = recentTransactions.map((t: RecentTransaction) => {
      if (t.hash === transaction.hash) {
        return transaction;
      }
      return t;
    });
    setRecentTransactions(newTransactions);
    setStoreRecentTransactions(newTransactions);
  };

  const updateTransactionStatus = (
    transaction: RecentTransaction,
    txStatus: "success" | "failed"
  ) => {
    if (txStatus === "success") {
      modifyTransactions({ ...transaction, status: "success" });
    } else if (txStatus === "failed") {
      modifyTransactions({ ...transaction, status: "failed" });
    }
  };

  return { getTransactions, addTransaction, updateTransactionStatus };
}

export default useTransactionList;
