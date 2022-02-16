import { useState } from "react";
import { toast } from "react-toastify";

import Button from "src/components/Button";
import Input from "src/components/Form/Input";
import Modal from "src/components/Modal";

// import useStore from "../../../store/store";

import styles from "./AddWalletModal.module.scss";

interface Props {
  isOpen: boolean;
  closeHandler: () => void;
}

function AddWalletModal({ isOpen, closeHandler }: Props) {
  // const logger = useStore((store) => store.loggerInstance);

  const [newWalletKey, setNewWalletKey] = useState("");

  // const { verify } = useVerifyPW();

  // const onSecurityConfirmation = async (checked: boolean) => {
  //   try {
  //     const verifySuccess: any = await verify(password);
  //     if (verifySuccess) {
  //       setNeedPassword(checked);
  //       setPassword("");
  //       closeHandler();
  //     }
  //   } catch (error: any) {
  //     logger?.sendLog({
  //       logTarget: "SetNeedPassword",
  //       tags: ["test"],
  //       level: "ERROR",
  //       message: error,
  //     });
  //     toast.error(error?.response?.data?.payload ?? "Sorry an error happened");
  //     setPassword("");
  //   }
  // };

  const handleSubmitWalletKey = () => {
    toast.success("You added the new wallet, " + newWalletKey)!;
    closeHandler();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeHandler}
      className={styles.WalletModal}
      title="Add Wallet to Certificate"
    >
      <div className={styles.TextboxContainer}>
        <Input
          label="Wallet Private Key"
          type="text"
          onChange={(e) => setNewWalletKey(e?.target?.value)}
          value={newWalletKey}
        ></Input>
      </div>
      <div className={styles.ButtonContainer}>
        <Button size="smaller" variant="secondary" onClick={closeHandler}>
          CANCEL
        </Button>
        <Button
          size="smaller"
          disabled={!newWalletKey}
          onClick={handleSubmitWalletKey}
        >
          SUBMIT
        </Button>
      </div>
    </Modal>
  );
}

export default AddWalletModal;
