import { WEBSITE_ADDRESS } from "src/const";

import MetaconDeer from "../../../assets/icons/metacon-deer.svg";
import {ReactComponent as ConunLogo} from "../../../assets/icons/conun-logo.svg";

import styles from "./Welcome.module.scss";
import Button from "src/components/Button";
import getTokenFromBg from "src/helpers/getTokenFromBg";

function Welcome() {

 
  return (
    <div className={styles.Welcome}>
      <div className={styles.ColumnTop}>
        <img src={MetaconDeer} className={styles.Deer} alt="" />
        <p className={styles.Title}>Your crypto wallet organizer</p>
      </div>
      <div className={styles.ColumnBottom}>

          
          <a href={WEBSITE_ADDRESS} target="_blank" rel="noreferrer" className={styles.Button}>
          Login / Sign Up
          </a>
          <Button size="large" variant="tertiary" onClick={getTokenFromBg}>
            Check Login State
          </Button>
        <ConunLogo className={styles.Logo} />
      </div>
    </div>
  );
}

export default Welcome;
