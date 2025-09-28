"use client";
import React, { useState } from "react";
import styles from "./PlansFeatures.module.scss";
import { Tabs, Spin, Alert } from "antd";
import { SettingOutlined, DollarOutlined, CodeOutlined } from "@ant-design/icons";
import { hasRequiredRole, ROLES } from "@/utils/roleUtils";
import PlansManagement from "./subviews/plansManagement/PlansManagement.view";
import FeaturesManagement from "./subviews/featuresManagement/FeaturesManagement.view";
import { useQueryClient } from "@tanstack/react-query";
import { useSelectedProfile } from "@/hooks/useSelectedProfile";

const PlansFeatures: React.FC = () => {
  const queryClient = useQueryClient();
  const { selectedProfile: profile } = useSelectedProfile();
  const [activeTab, setActiveTab] = useState("plans");

  // Check if user has developer role for features tab
  const canAccessFeatures = hasRequiredRole(profile?.permissions, ['api.create']);

  const tabItems = [
    {
      key: "plans",
      label: (
        <span>
          <DollarOutlined /> Plans Management
        </span>
      ),
      children: <PlansManagement />,
    },
  ];

  // Only add features tab if user has developer role
  if (canAccessFeatures) {
    tabItems.push({
      key: "features",
      label: (
        <span>
          <CodeOutlined /> Features Management
        </span>
      ),
      children: <FeaturesManagement />,
    });
  }

  return (
    <div className={styles.container}>
      {/* Header Section */}
      <div className={styles.header}>
        <h1 className={styles.title}>
          <SettingOutlined />
          Plans & Features Administration
        </h1>
        <p className={styles.subtitle}>
          Manage subscription plans, pricing, and feature configurations for the platform
        </p>
      </div>

      {/* Tabs Section */}
      <div className={styles.tabsContainer}>
        <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} size="large" type="card" />
      </div>
    </div>
  );
};

export default PlansFeatures;
