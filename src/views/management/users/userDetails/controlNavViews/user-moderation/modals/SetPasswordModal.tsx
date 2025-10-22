import React, { useState, useEffect } from 'react';
import { Form, Input, Button } from 'antd';
import Modal from '@/components/modal/Modal.component';
import useApiHook from '@/hooks/useApi';
import { useInterfaceStore } from '@/state/interface';

interface SetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  onSuccess?: () => void;
}

const SetPasswordModal: React.FC<SetPasswordModalProps> = ({
  isOpen,
  onClose,
  userId,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addAlert } = useInterfaceStore((state) => state);
  const { mutate: setCustomPassword } = useApiHook({
    method: 'POST',
    key: 'user.setPassword',
  }) as any;

  useEffect(() => {
    if (!isOpen) {
      form.resetFields();
      setIsSubmitting(false);
    }
  }, [isOpen, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setIsSubmitting(true);
      setCustomPassword(
        {
          url: `/user/${userId}/reset-password`,
          formData: { password: values.password },
        },
        {
          onSuccess: () => {
            addAlert({
              type: 'success',
              message: 'Password has been set successfully',
            });
            form.resetFields();
            setIsSubmitting(false);
            onClose();
            onSuccess?.();
          },
          onError: (error: any) => {
            addAlert({
              type: 'error',
              message: error?.message || 'Failed to set password',
            });
            setIsSubmitting(false);
          },
        }
      );
    } catch (error) {
      console.error('Form validation failed:', error);
    }
  };

  const footer = (
    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
      <Button onClick={onClose} disabled={isSubmitting}>
        Cancel
      </Button>
      <Button type="primary" onClick={handleSubmit} loading={isSubmitting} disabled={isSubmitting}>
        Set Password
      </Button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Set Custom Password"
      footer={footer}
      width={500}
      maskClosable={!isSubmitting}
    >
      <Form form={form} layout="vertical" style={{ marginTop: '16px' }}>
        <Form.Item
          name="password"
          label="New Password"
          rules={[
            { required: true, message: 'Please enter a password' },
            { min: 8, message: 'Password must be at least 8 characters' },
            {
              pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
              message: 'Password must contain uppercase, lowercase, number, and special character',
            },
          ]}
        >
          <Input.Password placeholder="Enter new password" />
        </Form.Item>
        <Form.Item
          name="confirmPassword"
          label="Confirm Password"
          dependencies={['password']}
          rules={[
            { required: true, message: 'Please confirm the password' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Passwords do not match'));
              },
            }),
          ]}
        >
          <Input.Password placeholder="Confirm new password" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SetPasswordModal;
