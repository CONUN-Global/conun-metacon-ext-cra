import { Link } from "react-router-dom";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import Button from "../../../components/Button";
import TransactionInput from "../../../components/Form/TransactionInput";
import FormTransactionInput from "../../../components/Form/HookForm/FormTransactionInput";
import InfoButton from "../../../components/InfoButton";
import ConToConxSummary from "./ConToConxSummary";
import ConxToConSummary from "./ConxToConSummary";

import useCurrentToken from "../../../hooks/useCurrentToken";
import useStore from "../../../store/store";

import { routes } from "src/const";

import styles from "./SwapBox.module.scss";

type FormData = {
  amount: number;
};

export type Swap = {
  amount: number;
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

  const onSubmit: SubmitHandler<FormData> = async (values) => {
    setSwap({
      amount: values.amount,
    });

    setIsConfirmModalOpen(true);
  };

  const rejectSwap = () => {
    setIsConfirmModalOpen(false);
    setSwap(null);
  };

  function rectifyDecimal(num: number) {
    if (num > 10000000000) {
      // The highest number possible is 9,999,999,999
      return 9999999999;
    } else {
      let fixedString = num.toFixed(6);
      if (fixedString.length > 9) {
        return parseFloat(fixedString.slice(0, 10));
      }
      return parseFloat(fixedString);
    }
  }

  const handleButtons = (action: "min" | "half" | "max") => {
    if (!balance.loading && balance.balance) {
      const userBalance = Number(balance.balance.payload);
      let valToUse = 0;

      if (action === "min") {
        valToUse = rectifyDecimal(userBalance * 0.2);
      }
      if (action === "half") {
        valToUse = rectifyDecimal(userBalance / 2);
      }
      if (action === "max") {
        valToUse = rectifyDecimal(userBalance);
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
              value: /^(([1-9][0-9]{0,10})|(0))([.][0-9]{0,10})?$/,
              message: "Number is invalid",
            },
            maxLength: {
              value: 10,
              message: "Number must be less than 10 digits long",
            },
            validate: {
              moreThanZero: (value) =>
                Number(value) <= 0
                  ? "Amount should be more than 0"
                  : "" || true,
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
          <Link to={routes.index}>Cancel</Link>
        </Button>
        <Button type="submit" variant="primary">
          Next
        </Button>
      </div>
      {isConfirmModalOpen && !!swap?.amount && token.token === "con" ? (
        <ConToConxSummary
          swap={swap}
          isOpen={isConfirmModalOpen}
          onClose={rejectSwap}
        />
      ) : (
        <ConxToConSummary
          swap={swap}
          isOpen={isConfirmModalOpen}
          onClose={rejectSwap}
        />
      )}
    </form>
  );
}

export default SwapBox;
