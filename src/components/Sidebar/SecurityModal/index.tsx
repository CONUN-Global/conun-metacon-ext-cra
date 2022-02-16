import { useState } from "react";
import { toast } from "react-toastify";

import Button from "src/components/Button";
import Input from "src/components/Form/Input";
import Modal from "src/components/Modal";

import useVerifyPW from "src/hooks/useVerifyPW";

import useStore from "../../../store/store";

import styles from "./SecurityModal.module.scss";

interface Props {
  isOpen: boolean;
  closeHandler: () => void;
}

function SecurityModal({ isOpen, closeHandler }: Props) {
  const logger = useStore((store) => store.loggerInstance);
  const needPassword = useStore((store) => store.needPassword);
  const setNeedPassword = useStore((store) => store.setNeedPassword);

  const [password, setPassword] = useState("");
  const [isChecked, setChecked] = useState(needPassword);

  const { verify } = useVerifyPW();

  const onSecurityConfirmation = async (checked: boolean) => {
    try {
      const verifySuccess: any = await verify(password);
      if (verifySuccess) {
        setNeedPassword(checked);
        setPassword("");
        closeHandler();
      }
    } catch (error: any) {
      logger?.sendLog({
        logTarget: "SetNeedPassword",
        tags: ["test"],
        level: "ERROR",
        message: error,
      });
      toast.error(error?.response?.data?.payload ?? "Sorry an error happened");
      setPassword("");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeHandler}
      className={styles.SecurityModal}
      title="Security Settings"
    >
      <div className={styles.CheckboxContainer}>
        <input
          id="checkbox"
          type="checkbox"
          checked={isChecked}
          onChange={() => setChecked(!isChecked)}
          className={styles.Checkbox}
        ></input>
        <label htmlFor="checkbox">
          Ask for password before every transaction
        </label>
      </div>
      <div className={styles.TextboxContainer}>
        <Input
          label="PASSWORD"
          type="password"
          onChange={(e) => setPassword(e?.target?.value)}
          value={password}
        ></Input>
      </div>
      <div className={styles.ButtonContainer}>
        <Button size="smaller" variant="secondary" onClick={closeHandler}>
          CANCEL
        </Button>
        <Button
          size="smaller"
          disabled={!password}
          onClick={() => onSecurityConfirmation(isChecked)}
        >
          SUBMIT
        </Button>
      </div>
    </Modal>
  );
}

export default SecurityModal;
