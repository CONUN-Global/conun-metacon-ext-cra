import { useState } from "react";
import { toast } from "react-toastify";

import Button from "src/components/Button";
import Input from "src/components/Form/Input";
import Modal from "src/components/Modal";

import useExtensionLogin from "src/hooks/chrome/useExtensionLogin";

import { saveChromeFile } from "src/helpers/saveFile";

// import useStore from "../../../store/store";

import styles from "./AddWalletModal.module.scss";

interface Props {
  isOpen: boolean;
  closeHandler: () => void;
}

function AddWalletModal({ isOpen, closeHandler }: Props) {
  const [newWalletKey, setNewWalletKey] = useState("");
  const { loginPackage } = useExtensionLogin();

  const handleSubmitWalletKey = () => {
    toast.success("You added the new wallet, " + newWalletKey)!;

    const walletAddress = loginPackage?.package.webAppIdentity.walletAddress;
    const identityBlob = [
      btoa(JSON.stringify(loginPackage?.package.webAppIdentity).toString()),
    ];
    saveChromeFile(walletAddress!, identityBlob);
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
