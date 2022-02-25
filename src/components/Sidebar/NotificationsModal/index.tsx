import { useState } from "react";
import { toast } from "react-toastify";

import Button from "src/components/Button";
import Modal from "src/components/Modal";
import useChromeNotification from "src/hooks/chrome/useChromeNotification";

import styles from "./NotificationsModal.module.scss";

interface Props {
  isOpen: boolean;
  closeHandler: () => void;
}

function NotificationsModal({ isOpen, closeHandler }: Props) {
  const { setNotificationOption, notificationsActive } =
    useChromeNotification();

  const [isChecked, setChecked] = useState(!!notificationsActive);

  const handleSubmit = () => {
    setNotificationOption(isChecked);
    toast.info(`Notifications are now turned ${isChecked ? "on" : "off"}`);
    closeHandler();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeHandler}
      className={styles.NotificationsModal}
      title="Notification Settings"
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
          Use Chrome push notifications for transaction updates?
        </label>
      </div>
      <div className={styles.TextboxContainer}></div>
      <div className={styles.ButtonContainer}>
        <Button size="smaller" variant="secondary" onClick={closeHandler}>
          CANCEL
        </Button>
        <Button size="smaller" onClick={handleSubmit}>
          SUBMIT
        </Button>
      </div>
    </Modal>
  );
}

export default NotificationsModal;
