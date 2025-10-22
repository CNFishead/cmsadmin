import React, { useState } from 'react';
import { Button, Input } from 'antd';
import Modal from '@/components/modal/Modal.component';
import useApiHook from '@/hooks/useApi';
import { useInterfaceStore } from '@/state/interface';
import { useRouter } from 'next/navigation';

interface DeleteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userName?: string;
  hasActiveSubscription?: boolean;
  hasMinistries?: boolean;
}

const DeleteUserModal: React.FC<DeleteUserModalProps> = ({
  isOpen,
  onClose,
  userId,
  userName,
  hasActiveSubscription = false,
  hasMinistries = false,
}) => {
  const [confirmText, setConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const { addAlert } = useInterfaceStore((state) => state);
  const router = useRouter();

  const { mutate: deleteUser } = useApiHook({
    method: 'DELETE',
    key: 'user.delete',
  }) as any;

  const handleDelete = () => {
    if (confirmText !== 'DELETE') {
      addAlert({
        type: 'error',
        message: 'Please type DELETE to confirm',
      });
      return;
    }
    setIsDeleting(true);
    deleteUser(
      {
        url: `/user/${userId}`,
        formData: {},
      },
      {
        onSuccess: () => {
          addAlert({
            type: 'success',
            message: 'User has been deleted successfully',
          });
          setIsDeleting(false);
          onClose();
          // Navigate back to users list after deletion
          router.push('/management/users');
        },
        onError: (error: any) => {
          addAlert({
            type: 'error',
            message: error?.message || 'Failed to delete user',
          });
          setIsDeleting(false);
        },
      }
    );
  };

  const handleClose = () => {
    if (!isDeleting) {
      setConfirmText('');
      onClose();
    }
  };

  const isDeleteDisabled = confirmText !== 'DELETE' || isDeleting;

  const footer = (
    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
      <Button onClick={handleClose} disabled={isDeleting}>
        Cancel
      </Button>
      <Button
        type="primary"
        danger
        onClick={handleDelete}
        loading={isDeleting}
        disabled={isDeleteDisabled}
      >
        Delete User
      </Button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Delete User Account"
      footer={footer}
      width={600}
      maskClosable={!isDeleting}
    >
      <div style={{ padding: '16px 0' }}>
        <p style={{ fontSize: '16px', fontWeight: 500, marginBottom: '16px' }}>
          ⚠️ This action cannot be undone
        </p>

        {userName && (
          <p style={{ marginBottom: '16px' }}>
            You are about to permanently delete the account for: <strong>{userName}</strong>
          </p>
        )}

        {(hasActiveSubscription || hasMinistries) && (
          <div
            style={{
              background: '#fff3cd',
              border: '1px solid #ffc107',
              borderRadius: '4px',
              padding: '12px',
              marginBottom: '16px',
            }}
          >
            <strong>⚠️ Warning:</strong>
            <ul style={{ marginTop: '8px', marginBottom: 0, paddingLeft: '20px' }}>
              {hasActiveSubscription && (
                <li>This user has an active subscription that will be cancelled</li>
              )}
              {hasMinistries && <li>This user has associated ministries that will be affected</li>}
            </ul>
          </div>
        )}

        <p style={{ marginBottom: '8px' }}>This will permanently delete:</p>
        <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
          <li>User account and profile information</li>
          <li>All associated authentication data</li>
          <li>User preferences and settings</li>
          <li>Activity history and logs</li>
        </ul>

        <div style={{ marginTop: '24px' }}>
          <label
            htmlFor="delete-confirm"
            style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}
          >
            Type <strong>DELETE</strong> to confirm:
          </label>
          <Input
            id="delete-confirm"
            placeholder="Type DELETE to confirm"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            disabled={isDeleting}
            onPressEnter={handleDelete}
          />
        </div>
      </div>
    </Modal>
  );
};

export default DeleteUserModal;
