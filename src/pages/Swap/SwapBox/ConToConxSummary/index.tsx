import { useState } from "react";

import { useHistory } from "react-router";

import Divider from "../../../../components/Divider";
import Modal from "../../../../components/Modal";
import Button from "../../../../components/Button";

import useTransactionList from "../../../../hooks/useTransactionList";
import useSwapFromCon from "../../../../hooks/useSwapFromCon";
import useCurrentToken from "../../../../hooks/useCurrentToken";

import { GAS_FEE_DIVIDEND, GAS_LIMIT_MULTIPLIER_FOR_SWAP } from "src/const";

import { Token } from "../../../../types/index";
import { Swap } from "..";

import styles from "./SwapSummary.module.scss";
import useCurrentUser from "src/hooks/useCurrentUser";
import GasFeeBox from "./GasFeeBox";
import useSwapFromContoCONX from "src/hooks/useSwapFromContoCONX";

interface SwapSummaryProps {
  isOpen: boolean;
  swap: Swap | null;
  onClose: () => void;
}

enum stage {
  "approval",
  "deposit",
}

type SwapStage = stage.approval | stage.deposit;

function Total({
  token,
  amount,
  gasFee,
}: {
  token: Token;
  amount: number | undefined;
  gasFee: number | undefined;
}) {
  if (gasFee) {
    return (
      <span
        className={styles.TotalAmount}
      >{`${amount} ${token.toLocaleUpperCase()} + ${gasFee?.toFixed(
        6
      )} ETH`}</span>
    );
  }
  return (
    <span
      className={styles.TotalAmount}
    >{`${amount} ${token.toLocaleUpperCase()} + ... ETH`}</span>
  );

}

function ConToConxSummary({ swap, isOpen, onClose }: SwapSummaryProps) {
  const [swapStage, setSwapStage] = useState<SwapStage>(stage.approval);
  const [depositFee, setDepositFee] = useState(undefined);


  const history = useHistory();

  const { token } = useCurrentToken();
  const currentUser = useCurrentUser();

  const { addTransaction } = useTransactionList();
  // const { swapFromCon, isLoading } = useSwapFromCon();

  const {
    approvalFee,
    isLoadingApprovalFee,
    getDepositFee,
    isLoadingDepositFee,
    performDeposit,
  } = useSwapFromContoCONX({
    value: swap?.amount!,
    gasLimit: swap?.gasLimit!,
    gasPrice: swap?.gasPrice!,
  });

  const val = swap?.amount ? swap.amount.toString() : "0";


  const onApprove = async () => {
      
    if (swap && !isLoadingApprovalFee){

      const depositData = await getDepositFee();
      setDepositFee(depositData);
      setSwapStage(stage.deposit); 

    }
  }


  const onConfirm = async () => {
    // if (swap) {
    //   let txHash: any;
    //   txHash = await swapFromCon({
    //     amount: swap.amount,
    //     gasLimit: swap?.gasLimit ?? 21000,
    //     gasPrice: Number(swap?.gasPrice ?? 2),
    //   });
    //   addTransaction({
    //     txType: "swap",
    //     hash: txHash,
    //     token: token,
    //     swapInfo: {
    //       from: token,
    //       to: token === "con" ? "conx" : "con",
    //     },
    //     amount: Number(swap?.amount),
    //     date: new Date().toISOString(),
    //     status: "pending",
    //   });
    //   history.push("/");
    // }
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
        <GasFeeBox label="Est. Approval Gas Fee" gasFee={approvalFee} />
        <GasFeeBox label="Est. Swap Gas Fee" gasFee={depositFee} />
      </div>
      <Divider />
      <div className={styles.TotalBox}>
        <div className={styles.LabelBox}>
          <span className={styles.Label}>Total</span>
          <span className={styles.SubLabel}>Amount + gas fee</span>
        </div>

        {/* <Total token={token} amount={swap?.amount} gasFee={gasFee} /> */}
        totel
      </div>

      <div className={styles.ButtonsContainer}>
        <Button type="button" onClick={onClose} variant="secondary">
          Reject
        </Button>
        {swapStage === stage.approval ? (
          <Button
            type="button"
            onClick={onApprove}
            disabled={isLoadingApprovalFee || isLoadingDepositFee}
          >
            Approve
          </Button>
        ) : (
          <Button
            type="button"
            onClick={onConfirm}
            disabled={isLoadingDepositFee}
          >
            Submit
          </Button>
        )}
      </div>
    </Modal>
  );
}

export default ConToConxSummary;
