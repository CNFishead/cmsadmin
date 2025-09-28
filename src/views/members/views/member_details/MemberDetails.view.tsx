import React from 'react';
import styles from './MemberDetails.module.scss';
import { Tabs, TabsProps } from 'antd';
import TabsData from './tabs/Tabs.data';

const MemberDetails = () => {
  const tabs = TabsData as TabsProps['items'];
  return (
    <div className={styles.container}>
      <Tabs className={styles.tabs} items={tabs} animated={{ inkBar: true, tabPane: true }} />
    </div>
  );
};

export default MemberDetails;
