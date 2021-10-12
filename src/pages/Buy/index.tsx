import React from "react";
import Link from "next/link";
import { ServiceCardObj } from "@/types/index";

import ServiceCard from "./ServiceCard";

import BithumbIcon from "@/assets/icons/bithumb-logo.svg";
import UniswapIcon from "@/assets/icons/uniswap-logo.svg";

import styles from "./Buy.module.scss";

const SERVICES: ServiceCardObj[] = [
  {
    name: "UniSwap",
    caption: "You can use your debit card to buy CON using UNISWAP",
    icon: <UniswapIcon className={styles.Icon} />,
  },
  {
    name: "Bithumb",
    caption: "Exchange existing cryptocurrency to CON with Bithumb",
    icon: <BithumbIcon className={styles.Icon} />,
  },
];

function Buy() {
  return (
    <div className={styles.Buy}>
      <div className={styles.BuyHeader}>
        <div className={styles.Title}>BUY</div>
        <Link href="/">
          <a className={styles.Ecks}>X</a>
        </Link>
      </div>
      <div className={styles.BuyBanner}>
        Deposit funds into CON and CONX with these services
      </div>
      <div className={styles.ServiceDeck}>
        {SERVICES.map((s) => (
          <ServiceCard key={s.name} card={s} />
        ))}
      </div>
    </div>
  );
}

export default Buy;
