import { useState } from "react";
import classNames from "classnames";
import {Link} from "react-router-dom";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

import Button from "@/components/Button";
import FormInput from "@/components/Form/HookForm/FormInput";
import FormTransactionInput from "@/components/Form/HookForm/FormTransactionInput";
import Switch from "@/components/Switch";
import FormGasInput from "@/components/Form/HookForm/FormGasInput";
import NonHookGasInput from "@/components/Form/Input/NonHookGasInput";
import TransactionSummary from "./TransactionSummary";

import useCurrentToken from "@/hooks/useCurrentToken";
import useTransferFee from "@/hooks/useTransferFee";

import styles from "./TransferBox.module.scss";

const speeds: {
  id: "slow" | "average" | "fast";
  label: string;
  default: string;
}[] = [
  { id: "slow", label: "Slow", default: "0.000059" },
  { id: "average", label: "Average", default: "0.000069" },
  { id: "fast", label: "Fast", default: "0.000073" },
];

type FormData = {
  type: string;
  amount: string;
  to: string;
  fee: "slow" | "average" | "fast";
  gasPrice: number;
  gasLimit: number;
  isAdvanced: boolean;
};

export type Transaction = {
  amount: string;
  to: string;
  gasPrice: number;
  gasLimit: number;
};

function TransferBox() {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [transaction, setTransaction] = useState<Transaction | null>(null);

  const token = useCurrentToken();

  const { balance } = token.useBalance();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    control,
  } = useForm<FormData>({
    defaultValues: {
      type: "ETH",
      fee: "average",
      isAdvanced: false,
    },
  });

  // The watches help the form to update / know what to rerender
  const watchTo = watch("to");
  const watchIsAdvanced = watch("isAdvanced");
  const watchGasFee = watch(["gasLimit", "gasPrice"]);
  const watchAmount = watch("amount", "0");

  const { data } = useTransferFee({
    to: watchTo,
    amount: watchAmount,
    token: token.token,
  });

  //To submit the form
  const onSubmit: SubmitHandler<FormData> = async (values) => {
    const gasLimit = values.isAdvanced
      ? values?.gasLimit
      : data?.[values?.fee]?.gasLimit;

    const gasPrice = values.isAdvanced
      ? +values?.gasPrice
      : data?.[values?.fee]?.gasPrice;

    setIsConfirmModalOpen(true);
    setTransaction({
      amount: values.amount,
      to: values.to,
      gasLimit: gasLimit || 0,
      gasPrice: +(gasPrice || 0),
    });
  };

  // Conx has no fees after all
  const hasFee = token.token !== "conx";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.TransferBox}>
      {/* The first box, AMOUNT */}
      <FormTransactionInput
        autoComplete="amount"
        register={register("amount", {
          required: {
            value: true,
            message: "Please specify an amount",
          },
          validate: {
            moreThanZero: (value) =>
              Number(value) <= 0 ? "Amount should be more than 0" : "" || true,
            lessThanTotalBalance: (value) =>
              Number(value) > Number(balance?.payload)
                ? "You don't have enough balance"
                : "" || true,
          },
        })}
        type="number"
        label="Amount"
        step="0.0001"
        min={0}
        error={errors.amount}
        token={token.token}
      />

      {/* The second box, TO ADDRESS */}
      <FormInput
        autoComplete="to"
        register={register("to", {
          required: {
            value: true,
            message: "Please specify an address",
          },
          pattern: {
            value: /^0x[a-fA-F0-9]{40}$/,
            message: "Address not valid",
          },
        })}
        className={styles.Input}
        label="To Address"
        error={
          !hasFee || data || !watchTo
            ? errors.to
            : { type: "validate", message: "Address not valid" }
        }
      />

      {/* 
        The advanced options refer to being able to set gas fees and stuff yourself.
        Otherwise, you choose a speed.

        If CONX selected then something else
      
      */}
      {hasFee ? (
        <>
          {watchIsAdvanced ? (
            <div className={styles.AdvancedOptions}>
              <div className={styles.AdvancedLabel}>
                SET GAS LIMIT AND FEE MANUALLY
              </div>
              <div className={styles.AdvancedControls}>
                <FormGasInput
                  defaultValue={data?.average?.gasLimit}
                  type="number"
                  label="Gas Limit"
                  register={register("gasLimit", {
                    required: {
                      value: watchIsAdvanced,
                      message: "This is required",
                    },
                  })}
                  error={errors.gasLimit}
                />
                <FormGasInput
                  defaultValue={data?.average?.gasPrice}
                  type="number"
                  register={register("gasPrice", {
                    required: {
                      value: watchIsAdvanced,
                      message: "This is required",
                    },
                  })}
                  label="Gas Price"
                  error={errors.gasPrice}
                />
                <NonHookGasInput
                  id="calculatedFee"
                  label="Gas Fee"
                  type="number"
                  defaultValue={
                    (+data?.average?.gasPrice! * +data?.average?.gasLimit!) /
                    1000000000
                  }
                  readOnly
                  value={
                    watchGasFee?.[0] &&
                    watchGasFee?.[1] &&
                    (watchGasFee?.[1] * watchGasFee?.[0]) / 1000000000
                  }
                />
              </div>
            </div>
          ) : (
            <div className={styles.AdvancedOptions}>
              <div className={styles.AdvancedLabel}>CHOOSE SPEED</div>

              <Controller
                control={control}
                name="fee"
                defaultValue="average"
                render={({ field: { onChange, value } }) => (
                  <div className={styles.SpeedPicker}>
                    {speeds.map((speed) => (
                      <button
                        key={speed.id}
                        type="button"
                        onClick={() => onChange(speed.id)}
                        className={classNames(styles.Speed, {
                          [styles.active]: value === speed.id,
                        })}
                      >
                        <div className={styles.SpeedLabel}>{speed.label}</div>
                        <div className={styles.SpeedValue}>
                          {data?.[speed?.id]?.total.toFixed(6)
                            ? `${data?.[speed?.id]?.total.toFixed(6)} ${
                                token.token
                              }`
                            : "---"}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              />
            </div>
          )}
          <Controller
            name="isAdvanced"
            control={control}
            defaultValue={!!watchIsAdvanced}
            render={({ field: { value, onChange } }) => (
              <Switch
                id="advanced-switch"
                label="Advanced Options"
                className={styles.Switch}
                checked={value}
                onChange={onChange}
              />
            )}
          />
        </>
      ) : (
        <div className={styles.ConxIsFree}>
          <div className={styles.Label}>Speed &amp; Fees</div>
          <div className={styles.MessageBox}>
            <span className={styles.Message}>
              ConX is always fast and always free!
            </span>
          </div>
        </div>
      )}
      <div className={styles.Buttons}>
        {/* Expect this to be broken */}
        <Link to="/">
          
            <Button
              className={styles.ConfirmButton}
              type="reset"
              variant="secondary"
            >
              Cancel
            </Button>
          
        </Link>
        <Button
          className={classNames(styles.ConfirmButton, {
            [styles.hasFee]: hasFee && data,
          })}
          type="submit"
          variant="primary"
        >
          Next
        </Button>
      </div>
      <TransactionSummary
        transaction={transaction}
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
      />
    </form>
  );
}

export default TransferBox;
