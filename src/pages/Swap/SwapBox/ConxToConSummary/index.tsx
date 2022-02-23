import { useHistory } from "react-router";

import Divider from "../../../../components/Divider";
import Modal from "../../../../components/Modal";
import Button from "../../../../components/Button";

import useTransactionList from "../../../../hooks/useTransactionList";
import useCurrentToken from "../../../../hooks/useCurrentToken";

import { Swap } from "..";

import styles from "../SwapSummary.module.scss";

import GasFeeBox from "../GasFeeBox";
import useSwapFromCONXtoCon from "src/hooks/useSwapFromCONXtoCon";
import LoadingOverlay from "../LoadingOverlay";
import Total from "../Total";
import { routes } from "src/const";

interface SwapSummaryProps {
  isOpen: boolean;
  swap: Swap | null;
  onClose: () => void;
}

function ConToConxSummary({ swap, isOpen, onClose }: SwapSummaryProps) {
  const history = useHistory();
  const { token } = useCurrentToken();
  const { addTransaction } = useTransactionList();

  const { claimFee, isLoadingClaimFee, swapFromCONX } = useSwapFromCONXtoCon({
    value: swap?.amount!,
  });

  const onConfirm = async () => {
    if (swap && !isLoadingClaimFee) {
      let txHash: any;
      try {
        txHash = await swapFromCONX(claimFee!);
      } catch (e) {}
      if (!!txHash) {
        addTransaction({
          txType: "swap",
          hash: txHash,
          token: token,
          swapInfo: {
            from: "conx",
            to: "con",
          },
          amount: Number(swap?.amount),
          date: new Date().toISOString(),
          status: "pending",
        });
      }
      history.push(routes.index);
    }
  };

  return (
    <Modal
      className={styles.SwapSummary}
      isOpen={isOpen}
      onClose={onClose}
      title="Swap Summary"
    >
      {isLoadingClaimFee && <LoadingOverlay />}
      <p className={styles.ReviewText}>
        Please review the details, and if everything is correct, click confirm.
      </p>
      <div className={styles.SwapBox}>
        <div className={styles.SwapInput}>
          <span className={styles.Label}>From:</span>
          <div className={styles.Input}>
            <div>
              <span>{swap?.amount}</span>
            </div>
            <span>{token}</span>
          </div>
        </div>
        <div className={styles.SwapInput}>
          <span className={styles.Label}>To:</span>
          <div className={styles.Input}>
            <div>
              <span>{swap?.amount}</span>
            </div>
            <span>{token === "conx" ? "con" : "conx"}</span>
          </div>
        </div>
      </div>
      <Divider />
      <div className={styles.GasFeeSection}>
        <GasFeeBox label="Est. Swap Fee" gasFee={claimFee?.gasPrice} />
      </div>
      <Divider />
      <div className={styles.TotalBox}>
        <div className={styles.LabelBox}>
          <span className={styles.Label}>Total</span>
          <span className={styles.SubLabel}>Amount + gas fee</span>
        </div>
        <Total
          token={token}
          amount={swap?.amount}
          gasFee={claimFee?.gasPrice}
        />
      </div>

      <div className={styles.ButtonsContainer}>
        <Button type="button" onClick={onClose} variant="secondary">
          Reject
        </Button>
        <Button type="button" onClick={onConfirm} disabled={isLoadingClaimFee}>
          Submit
        </Button>
      </div>
    </Modal>
  );
}

export default ConToConxSummary;
