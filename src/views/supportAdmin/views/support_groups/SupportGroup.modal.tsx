import React from "react";
import styles from "@/styles/Form.module.scss";
import { Button, Form, Input, Modal, Select } from "antd";
import useApiHook from "@/state/useApi";

interface SupportGroupProps {
  form: any;
  isOpen: boolean;
  setIsOpen?: any;
  isUpdate?: boolean;
}

const SupportGroup = ({ form, isOpen, isUpdate, setIsOpen }: SupportGroupProps) => {
  const { data, isError, error, isLoading } = useApiHook({
    url: "/admin/user",
    method: "GET",
    key: "agents",
    filter: `role;{"$eq":"agent"}`,
  }) as any;

  return (
    <Modal
      open={isOpen}
      title={isUpdate ? `Update group` : `Create new Group`}
      footer={null}
      onCancel={() => setIsOpen(false)}
    >
      <Form
        form={form}
        onFinish={(values) => {
          console.log(values);
        }}
        className={styles.form}
        layout="vertical"
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[
            {
              required: true,
              message: "Please enter a name",
            },
          ]}
        >
          <Input type="text" />
        </Form.Item>
        {/* multi-select container holding all users who have "agent" as a role */}
        <Form.Item
          label="Agents"
          name="agents"
          rules={[
            {
              required: true,
              message: "Please select agents",
            },
          ]}
        >
          <Select
            mode="multiple"
            placeholder="Select Agents"
            options={data?.payload?.map((agent: any) => ({
              label: `${agent.fullName}`,
              value: agent._id,
            }))}
          />
        </Form.Item>
        <Button htmlType="submit" type="primary">
          Submit
        </Button>
      </Form>
    </Modal>
  );
};

export default SupportGroup;
