import React from "react";

import Button from "@/components/Button";

import { ServiceCardObj } from "@/types/index";

import styles from "./ServiceCard.module.scss";

function ServiceCard({ card }: { card: ServiceCardObj }) {
  return (
    <div className={styles.ServiceCard}>
      <div className={styles.Title}>{card.name}</div>
      <div className={styles.Content}>
        <div className={styles.IconBox}>{card.icon}</div>
        <div className={styles.CaptionBox}>
          <div className={styles.Subtitle}>Buy CON with {card.name}</div>
          <div className={styles.Caption}>{card.caption}</div>
        </div>
      </div>
      <Button variant="outlined" className={styles.Button}>
        Currently Unavailable
      </Button>
    </div>
  );
}

export default ServiceCard;
