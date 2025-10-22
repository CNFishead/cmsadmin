import React from 'react';
import Info from './subviews/info/Info.view';
import PlanInformation from './subviews/planInformation/PlanInformation.view';
import Receipts from './subviews/receipts/Receipts.view';
import User from '@/types/UserType';
import Ministries from './subviews/ministries/Ministries.component';

interface TabsConfig {
  key: string;
  label: string;
  children: React.ReactNode;
}

export const getUserDetailsTabs = (
  userData: User,
  onDataUpdate: (updatedData: Partial<User>) => void
): TabsConfig[] => {
  return [
    {
      key: 'ministries',
      label: 'Ministries',
      children: <Ministries />,
    },
    {
      key: 'plan',
      label: 'Plan Information',
      children: <PlanInformation userData={userData} onDataUpdate={onDataUpdate} />,
    },
    {
      key: 'receipts',
      label: 'Receipts',
      children: <Receipts userData={userData} onDataUpdate={onDataUpdate} />,
    },
  ];
};
