import React from "react";
import styles from "./SupportDeskAdmin.module.scss";
import { Tabs } from "antd";
import AnimatedDiv from "@/components/animatedDiv/AnimatedDiv.UI";
import { AnimatePresence } from "framer-motion"; 
import SupportGroups from "./views/support_groups/SupportGroups.component";

interface Tab {
  key: string;
  title: string;
  content: React.ReactNode;
}

const SupportDeskAdmin = () => {
  const tabs = [
    {
      key: "0",
      title: "Support Groups",
      content: <SupportGroups />,
    },
    {
      key: "1",
      title: "Agents",
      content: <></>,
    },
  ] as Tab[];

  return (
    <div className={styles.container}>
       <Tabs defaultActiveKey="0" type="card">
        {tabs.map((tab) => (
          <Tabs.TabPane tab={tab.title} key={tab.key}>
            <AnimatePresence mode="wait">
              <AnimatedDiv
                transitionType="fade"
                duration={0.5}
                key={`switchableView-${tab.key}`}
                type="whileInView"
                className={styles.tabsContainer}
              >
                {tab.content}
              </AnimatedDiv>
            </AnimatePresence>
          </Tabs.TabPane>
        ))}
      </Tabs>
    </div>
  );
};

export default SupportDeskAdmin;
