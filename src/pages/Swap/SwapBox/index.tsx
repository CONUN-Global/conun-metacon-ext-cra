import {Link} from "react-router-dom";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import Button from "../../../components/Button";
import TransactionInput from "../../../components/Form/TransactionInput";
import FormTransactionInput from "../../../components/Form/HookForm/FormTransactionInput";
import SwapSummary from "./SwapSummary";

import useCurrentToken from "../../../hooks/useCurrentToken";
import useStore from "../../../store/store";
import useTransferFee from "../../../hooks/useTransferFee";

import styles from "./SwapBox.module.scss";
import InfoButton from "../../../components/InfoButton";
import ConToConxSummary from "./ConToConxSummary";

type FormData = {
  amount: number;
};

export type Swap = {
  amount: number;
  gasLimit: number;
  gasPrice: number;
};

function SwapBox() {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [swap, setSwap] = useState<Swap | null>(null);

  const token = useCurrentToken();
  const balance = token.useBalance();

  const setCurrentToken = useStore((store) => store.setCurrentToken);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({ reValidateMode: "onChange" });

  const watchAmount = watch("amount");

  const { data } = useTransferFee({
    to: "",
    amount: String(watchAmount),
    token: "con",
  });

  const onSubmit: SubmitHandler<FormData> = async (values) => {
    setSwap({
      amount: values.amount,
      gasLimit: data?.fast?.gasLimit ?? 21000,
      gasPrice: Number(data?.fast?.gasPrice ?? 2),
    });

    setIsConfirmModalOpen(true);
  };

  const rejectSwap = () => {
    setIsConfirmModalOpen(false);
    setSwap(null);
  }

  const handleButtons = (action: "min" | "half" | "max") => {
    if (!balance.loading && balance.balance) {
      const userBalance = Number(balance.balance.payload);
      let valToUse = 0;

      if (action === "min") {
        valToUse = userBalance * 0.2;
      }
      if (action === "half") {
        valToUse = userBalance / 2;
      }
      if (action === "max") {
        valToUse = userBalance;
      }
      setValue("amount", valToUse);
    }
  };

  const amount = watch("amount");
  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.SwapBox}>
      <div className={styles.FromBox}>
        <FormTransactionInput
          token={token.token}
          label="Swap from"
          register={register("amount", {
            required: {
              value: true,
              message: "This is a required field",
            },
            pattern: {
              value: /^(([1-9][0-9]{0,17})|(0))([.][0-9]{0,17})?$/,
              message: "Number is invalid",
            },
            validate: {
              moreThanZero: (value) =>
                Number(value) <= 0 ? "Amount should be more than 0" : "" || true,
              lessThanTotalBalance: (value) =>
                Number(value) > Number(balance?.balance?.payload)
                  ? "You don't have enough balance"
                  : "" || true,
            },
          })}
          error={errors.amount}
          isSwapFrom={() =>
            setCurrentToken(token.token === "con" ? "conx" : "con")
          }
        />
        <div className={styles.MinHalfMax}>
          <Button
            type="button"
            variant="outlined"
            className={styles.MHMButton}
            onClick={() => handleButtons("min")}
          >
            Min
          </Button>
          <Button
            type="button"
            variant="outlined"
            className={styles.MHMButton}
            onClick={() => handleButtons("half")}
          >
            Half
          </Button>
          <Button
            type="button"
            variant="outlined"
            className={styles.MHMButton}
            onClick={() => handleButtons("max")}
          >
            Max
          </Button>
          <InfoButton>
            <div className={styles.InfoMsg}>
              Min: 20% of the total balance Max: the total balance
            </div>
          </InfoButton>
        </div>
      </div>
      <div className={styles.ToBox}>
        <TransactionInput
          value={amount}
          token={token.token === "con" ? "conx" : "con"}
          label="Swap to"
          readOnly
        />
      </div>

      <div className={styles.Buttons}>
        <Button type="reset" variant="secondary">
          <Link to="/">Cancel</Link>
        </Button>
        <Button type="submit" variant="primary">
          Next
        </Button>
      </div>
      {!!swap &&
      
        token.token === "con"? 
        <ConToConxSummary
        swap={swap}
        isOpen={isConfirmModalOpen}
        onClose={rejectSwap}
        /> :
        
        <SwapSummary
        swap={swap}
        isOpen={isConfirmModalOpen}
        onClose={rejectSwap}
        /> 
    }
    </form>
  );
}

export default SwapBox;
