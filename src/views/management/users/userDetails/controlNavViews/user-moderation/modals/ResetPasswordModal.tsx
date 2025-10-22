import React, { useState } from 'react';
import { Button } from 'antd';
import Modal from '@/components/modal/Modal.component';
import useApiHook from '@/hooks/useApi';
import { useInterfaceStore } from '@/state/interface';

interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userEmail?: string;
  onSuccess?: () => void;
}

const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({
  isOpen,
  onClose,
  userId,
  userEmail,
  onSuccess,
}) => {
  const [isResetting, setIsResetting] = useState(false);
  const { addAlert } = useInterfaceStore((state) => state);

  const { mutate: resetPassword } = useApiHook({
    method: 'POST',
    key: 'user.resetPassword',
  }) as any;

  const handleReset = () => {
    setIsResetting(true);
    resetPassword(
      {
        url: `/user/${userId}/reset-password`,
        formData: { sendNotification: true, generateSecure: true },
      },
      {
        onSuccess: () => {
          addAlert({
            type: 'success',
            message: 'Password reset email has been sent',
          });
          setIsResetting(false);
          onClose();
          onSuccess?.();
        },
        onError: (error: any) => {
          addAlert({
            type: 'error',
            message: error?.message || 'Failed to reset password',
          });
          setIsResetting(false);
        },
      }
    );
  };

  const footer = (
    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
      <Button onClick={onClose} disabled={isResetting}>
        Cancel
      </Button>
      <Button
        type="primary"
        danger
        onClick={handleReset}
        loading={isResetting}
        disabled={isResetting}
      >
        Reset Password
      </Button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Reset Password"
      footer={footer}
      width={500}
      maskClosable={!isResetting}
    >
      <div style={{ padding: '16px 0' }}>
        <p>
          Are you sure you want to reset the password for this user?
          {userEmail && (
            <>
              <br />
              <br />A password reset email will be sent to: <strong>{userEmail}</strong>
            </>
          )}
        </p>
        <p style={{ marginTop: '16px', color: '#666' }}>
          The user will receive an email with instructions to set a new password.
        </p>
      </div>
    </Modal>
  );
};

export default ResetPasswordModal;
