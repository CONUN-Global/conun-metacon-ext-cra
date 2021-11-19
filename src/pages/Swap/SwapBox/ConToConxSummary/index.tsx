import { useState } from "react";

import { useHistory } from "react-router";

import Divider from "../../../../components/Divider";
import Modal from "../../../../components/Modal";
import Button from "../../../../components/Button";

import useTransactionList from "../../../../hooks/useTransactionList";
import useCurrentToken from "../../../../hooks/useCurrentToken";

import { GAS_FEE_DIVIDEND, GAS_LIMIT_MULTIPLIER_FOR_SWAP } from "src/const";

import { Token } from "../../../../types/index";
import { Swap } from "..";

import styles from "./SwapSummary.module.scss";
import useCurrentUser from "src/hooks/useCurrentUser";
import GasFeeBox from "./GasFeeBox";
import useSwapFromContoCONX from "src/hooks/useSwapFromContoCONX";
import LoadingOverlay from "./LoadingOverlay";
import web3 from "src/web3";
import useTransferFee from "src/hooks/useTransferFee";

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
  const [depositFee, setDepositFee] = useState<number | undefined>(undefined);

  const history = useHistory();

  const { token } = useCurrentToken();
  const currentUser = useCurrentUser();

  const { addTransaction } = useTransactionList();

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

  function boostDepositFee(depositData:string){
    try {

      const rawFee = Number(web3.utils.fromWei(depositData))
      return rawFee * 1.1
    } catch  (e)
    {
      console.log(`boostDepositFee e`, e)
    }
  }


  const onApprove = async () => {
      
    if (swap && !isLoadingApprovalFee){

      const depositData = await getDepositFee();

      setDepositFee(boostDepositFee(depositData));
      setSwapStage(stage.deposit); 

    }
  }


  const onConfirm = async () => {

    if (swap && depositFee) {
      let txHash: any;
      try{

        txHash = await performDeposit(depositFee);
      } catch (e){
        console.log(`perform Deposit e`, e)
      }
        if (!!txHash){

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
        }
      history.push("/");
    }


  };

  return (
    <Modal
      className={styles.SwapSummary}
      isOpen={isOpen}
      onClose={onClose}
      title="Swap Summary"
    >
      {(isLoadingApprovalFee || isLoadingDepositFee) &&
        <LoadingOverlay/>
      }
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
