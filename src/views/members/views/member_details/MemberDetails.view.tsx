import React from 'react';
import styles from './MemberDetails.module.scss';
import { Tabs, TabsProps } from 'antd';
import UserDetails from './tabs/UserDetails.component';
import PaymentDetails from './tabs/paymentDetails/PaymentDetails.view';

const MemberDetails = () => {
  const tabs = [
    {
      key: '0',
      label: 'User Information',
      children: <UserDetails />,
    },
    {
      key: '1',
      label: 'Payment Information',
      children: <PaymentDetails />,
    },
  ] as TabsProps['items'];

  return (
    <div className={styles.container}>
      <Tabs className={styles.tabs} items={tabs} animated={{ inkBar: true, tabPane: true }} />
    </div>
  );
};

export default MemberDetails;
