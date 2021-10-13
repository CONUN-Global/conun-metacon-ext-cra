import { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { toast } from "react-toastify";

import useStore from "@/store/store";

import { AnimatePresence, motion } from "framer-motion";

import Button from "../Button";
import Modal from "@/components/Modal";
import Input from "@/components/Form/Input";
import OutsideClickWrapper from "../OutsideClickHandler";

import useLogin from "@/hooks/useLogin";

import {ReactComponent as MenuIcon} from "@/assets/icons/menu-icon.svg";
import {ReactComponent as DiscordIcon} from "@/assets/icons/discord-icon.svg";
import {ReactComponent as SecurityIcon} from "@/assets/icons/security-icon.svg";
import {ReactComponent as SignoutIcon} from "@/assets/icons/signout-icon.svg";
import styles from "./Sidebar.module.scss";

function Sidebar() {
  const variants = {
    open: { x: 300, opacity: 1 },
    closed: { x: 0, opacity: 1 },
  };
  const [isOpen, setIsOpen] = useState(false);
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
  const setNeedPassword = useStore((store) => store.setNeedPassword);
  const [password, setPassword] = useState("");
  const [isChecked, setChecked] = useState(false);

  const history = useHistory();

  const { login } = useLogin();

  const handleModal = () => {
    setIsSecurityModalOpen(true);
  };
  const onSecurityConfirmation = async () => {
    try {
      const loginData:any = await login(password);
      if (loginData?.success) {
        setNeedPassword(true);
        setIsSecurityModalOpen(false);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.payload ?? "Sorry an error happened");
    }
  };

  return (
    <OutsideClickWrapper onClickOutside={() => setIsOpen(false)}>
      <div className={styles.Sidebar}>
        <Button
          noStyle
          onClick={() => {
            setIsOpen((prev) => !prev);
          }}
        >
          <MenuIcon className={styles.MenuIcon} />
        </Button>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              animate="closed"
              exit={{ x: 300, opacity: 1 }}
              initial="open"
              variants={variants}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className={styles.MenuSlide}
            >
              <div className={styles.MenuButtons}>
                <p className={styles.MenuTitle}>Menu</p>
                <Button className={styles.Button} noStyle onClick={handleModal}>
                  <div className={styles.ButtonItem}>
                    <SecurityIcon className={styles.Icon} />
                    Security
                  </div>
                </Button>
                <div className={styles.Button}>
                  <Link to="https://discord.gg/VvXvQfa3Za" target="_blank" rel="noreferrer" className={styles.ButtonItem}>
                      <DiscordIcon className={styles.Icon} />
                      Connect to discord
                  </Link>
                </div>
                <Button
                  noStyle
                  className={styles.Button}
                  onClick={() => {
                    localStorage.clear();
                    history.push("/");
                    // This was router.reload for next
                    // Let's try this.
                  }}
                >
                  <div className={styles.ButtonItem}>
                    <SignoutIcon className={styles.Icon} />
                    Sign Out
                  </div>
                </Button>
              </div>
              <div className={styles.Version}>version 0.1-beta</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Modal
        isOpen={isSecurityModalOpen}
        onClose={() => setIsSecurityModalOpen(false)}
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
          <Button
            size="smaller"
            variant="secondary"
            onClick={() => {
              setNeedPassword(false);
              setIsSecurityModalOpen(false);
            }}
          >
            NO
          </Button>
          <Button
            size="smaller"
            disabled={!isChecked || !password}
            onClick={onSecurityConfirmation}
          >
            YES
          </Button>
        </div>
      </Modal>
    </OutsideClickWrapper>
  );
}

export default Sidebar;
