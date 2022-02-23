import { useState } from "react";
import { useHistory, Link } from "react-router-dom";

import { AnimatePresence, motion } from "framer-motion";

import Button from "../Button";
import OutsideClickWrapper from "../OutsideClickHandler";

import { ReactComponent as MenuIcon } from "../../assets/icons/menu-icon.svg";
import { ReactComponent as DiscordIcon } from "../../assets/icons/discord-icon.svg";
import { ReactComponent as SecurityIcon } from "../../assets/icons/security-icon.svg";
import { ReactComponent as SignoutIcon } from "../../assets/icons/signout-icon.svg";
import styles from "./Sidebar.module.scss";
import { extensionSignOut } from "src/helpers/chrome/extensionSignOut";
import SecurityModal from "./SecurityModal";
import AddWalletModal from "./AddWalletModal";
import { routes } from "src/const";
import useBrowserTab from "src/hooks/chrome/useBrowserTab";

function Sidebar() {
  const variants = {
    open: { x: 300, opacity: 1 },
    closed: { x: 0, opacity: 1 },
  };
  const [isOpen, setIsOpen] = useState(false);
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
  const [isAddWalletModalOpen, setAddWalletModalOpen] = useState(false);

  const history = useHistory();
  const { isRunningInBrowserTab, openIndexInTab } = useBrowserTab();

  const handleSecurityModal = () => {
    setIsSecurityModalOpen(true);
  };

  const handleAddWalletModal = () => {
    setAddWalletModalOpen(true);
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
                <Button
                  className={styles.Button}
                  noStyle
                  onClick={handleSecurityModal}
                >
                  <div className={styles.ButtonItem}>
                    <SecurityIcon className={styles.Icon} />
                    Security
                  </div>
                </Button>
                <Button
                  className={styles.Button}
                  noStyle
                  onClick={handleAddWalletModal}
                >
                  <div className={styles.ButtonItem}>
                    <SecurityIcon className={styles.Icon} />
                    Add Wallet
                  </div>
                </Button>
                <div className={styles.Button}>
                  <Link
                    to="https://discord.gg/VvXvQfa3Za"
                    target="_blank"
                    rel="noreferrer"
                    className={styles.ButtonItem}
                  >
                    <DiscordIcon className={styles.Icon} />
                    Connect to discord
                  </Link>
                </div>
                {!isRunningInBrowserTab && (
                  <Button
                    noStyle
                    className={styles.Button}
                    onClick={openIndexInTab}
                  >
                    <div className={styles.ButtonItem}>
                      <SignoutIcon className={styles.Icon} />
                      Open In Tab
                    </div>
                  </Button>
                )}
                <Button
                  noStyle
                  className={styles.Button}
                  onClick={() => {
                    extensionSignOut();
                    history.push(routes.logout);
                    window.close();
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
      <SecurityModal
        isOpen={isSecurityModalOpen}
        closeHandler={() => setIsSecurityModalOpen(false)}
      />
      <AddWalletModal
        isOpen={isAddWalletModalOpen}
        closeHandler={() => setAddWalletModalOpen(false)}
      />
    </OutsideClickWrapper>
  );
}

export default Sidebar;
