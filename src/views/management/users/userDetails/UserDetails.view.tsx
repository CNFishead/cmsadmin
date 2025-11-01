'use client';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import styles from './UserDetails.module.scss';
import { Spin, Tabs } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import User from '@/types/UserType';
import useApiHook from '@/hooks/useApi';
import { useParams } from 'next/navigation';
import { getUserDetailsTabs } from './tabs';
import { useSetControlNav } from '@/providers/ControlNavProvider';
import { ControlNavItem } from '@/layout/control/Control.layout';
import { FaUserShield } from 'react-icons/fa';
import UserModeration from './controlNavViews/user-moderation/UserModeration.control';

const UserDetails = () => {
  const { id } = useParams();
  const [userData, setUserData] = useState<User | null>(null);

  // Fetch user data if userId is provided
  const { data, isLoading, refetch } = useApiHook({
    url: `/user/${id}`,
    key: ['user', id as string],
    method: 'GET',
    enabled: !!id,
  }) as { data: { payload: User }; isLoading: boolean; refetch: () => void };

  // Update local state when data changes
  useEffect(() => {
    if (data?.payload) {
      setUserData(data.payload);
    }
  }, [data]);

  const handleDataUpdate = useCallback((updatedData: Partial<User>) => {
    setUserData((prevData) => {
      if (!prevData) return prevData;
      return { ...prevData, ...updatedData };
    });
  }, []);

  // Set up control navigation with user data - memoized to prevent infinite loops
  const controlNav = useMemo<ControlNavItem[] | null>(() => {
    if (!userData) return null;

    return [
      {
        title: 'User Moderation',
        icon: <FaUserShield />,
        children: <UserModeration userData={userData} onDataUpdate={handleDataUpdate} />,
      },
    ];
  }, [userData]);

  useSetControlNav(controlNav);

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <Spin size="large" />
          <div className={styles.loadingText}>Loading user details...</div>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <ExclamationCircleOutlined />
          <div>User not found</div>
        </div>
      </div>
    );
  }

  const tabItems = getUserDetailsTabs(userData, handleDataUpdate);

  return (
    <div className={styles.container}>
      {/* Tabs Section */}
      <div className={styles.tabsContainer}>
        <Tabs defaultActiveKey="info" items={tabItems} size="large" type="card" />
      </div>
    </div>
  );
};

export default UserDetails;
