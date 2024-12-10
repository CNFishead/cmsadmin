import React from "react";
import styles from "./SupportDesk.module.scss";

const SupportDesk = () => {
  return (
    <div className={styles.container}>
      <div className={styles.leftContainer}>{/* A list of all open support tickets assigned to the user */}</div>
      <div className={styles.rightContainer}>
        <div className={styles.groups}>{/* A list of all groups the user is a part of */}</div>
      </div>
    </div>
  );
};

export default SupportDesk;
