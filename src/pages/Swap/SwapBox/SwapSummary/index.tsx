import { useHistory } from "react-router";

import Divider from "../../../../components/Divider";
import Modal from "../../../../components/Modal";
import Button from "../../../../components/Button";

import useTransactionList from "../../../../hooks/useTransactionList";
import useSwapFromCon from "../../../../hooks/useSwapFromCon";
import useSwapFromConx from "../../../../hooks/useSwapFromConx";
import useCurrentToken from "../../../../hooks/useCurrentToken";

import { GAS_FEE_DIVIDEND, GAS_LIMIT_MULTIPLIER_FOR_SWAP } from "src/const";

import { Token } from "../../../../types/index";
import { Swap } from "..";

import {ReactComponent as InfoIcon} from "../../../../assets/icons/info-icon.svg";

import styles from "./SwapSummary.module.scss";

function Total({
  token,
  amount,
  gasFee,
}: {
  token: Token;
  amount: number | undefined;
  gasFee: number;
}) {
  if (token === "conx") {
    return (
      <span
        className={styles.TotalAmount}
      >{`${amount} ${token.toLocaleUpperCase()} + ${gasFee.toFixed(
        6
      )} ETH`}</span>
    );
  }

  return (
    <span
      className={styles.TotalAmount}
    >{`${amount} ${token.toLocaleUpperCase()} + ${gasFee.toFixed(
      6
    )} ETH`}</span>
  );
}

interface SwapSummaryProps {
  isOpen: boolean;
  swap: Swap | null;
  onClose: () => void;
}

function SwapSummary({ swap, isOpen, onClose }: SwapSummaryProps) {
  const { token } = useCurrentToken();

  const { swapFromCon, isLoading } = useSwapFromCon();
  const { swapFromConx, isLoading: isLoadingFromConx } = useSwapFromConx();

  const history = useHistory();

  const { addTransaction } = useTransactionList();

  const onConfirm = async () => {
    if (swap) {
      let txHash: any;
      if (token === "con") {
        txHash = await swapFromCon({
          amount: swap.amount,
          gasLimit: swap?.gasLimit ?? 21000,
          gasPrice: Number(swap?.gasPrice ?? 2),
        });
      }

      if (token === "conx") {
        txHash = await swapFromConx({
          amount: swap?.amount,
          gasLimit: swap?.gasLimit ?? 21000,
          gasPrice: Number(swap?.gasPrice ?? 2),
        });
      }

      addTransaction({
        txType: "swap",
        hash: txHash,
        token: token,
        swapInfo: {
          from: token,
          to: token === "con" ? "conx" : "con",
        },
        amount: Number(swap?.amount),
        date: new Date().toISOString(),
        status: "pending",
      });

      history.push("/");
    }
  };

  const gasFee =
    (Number(swap?.gasPrice ?? 0) *
      Number(swap?.gasLimit ?? 0 * GAS_LIMIT_MULTIPLIER_FOR_SWAP ?? 0)) /
    GAS_FEE_DIVIDEND;

  return (
    <Modal
      className={styles.SwapSummary}
      isOpen={isOpen}
      onClose={onClose}
      title="Swap Summary"
    >
      <p className={styles.ReviewText}>
        Please review the details, and if everything is correct, click confirm.
      </p>
      <div className={styles.SwapBox}>
        <div className={styles.SwapInput}>
          <span className={styles.Label}>From</span>
          <div className={styles.Input}>
            <div>
              <span>{swap?.amount}</span>
            </div>
            <span>{token}</span>
          </div>
        </div>
        <div className={styles.SwapInput}>
          <span className={styles.Label}>To</span>
          <div className={styles.Input}>
            <div>
              <span>{swap?.amount}</span>
            </div>
            <span>{token === "conx" ? "con" : "conx"}</span>
          </div>
        </div>
      </div>
      <Divider />
      <div className={styles.EstimatedGasBox}>
        <div className={styles.GasLabel}>
          <span className={styles.Text}>Estimated Gas Fee</span>
          <InfoIcon className={styles.InfoIcon} />
        </div>
        <div className={styles.GasValueBox}>
          <span className={styles.GasValue}>{gasFee.toFixed(6)} ETH</span>
        </div>
      </div>
      <Divider />
      <div className={styles.TotalBox}>
        <div className={styles.LabelBox}>
          <span className={styles.Label}>Total</span>
          <span className={styles.SubLabel}>Amount + gas fee</span>
        </div>

        <Total token={token} amount={swap?.amount} gasFee={gasFee} />
      </div>

      <div className={styles.ButtonsContainer}>
        <Button type="button" onClick={onClose} variant="secondary">
          Reject
        </Button>
        <Button
          type="button"
          onClick={onConfirm}
          disabled={isLoading || isLoadingFromConx}
        >
          Confirm
        </Button>
      </div>
    </Modal>
  );
}

export default SwapSummary;
