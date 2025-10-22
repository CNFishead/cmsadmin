'use client';
import React, { useState, useEffect } from 'react';
import { Switch, Button, Tag, Space, Tooltip, Avatar, Divider, Form } from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  LockOutlined,
  UnlockOutlined,
  MailOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  UserDeleteOutlined,
  UserOutlined,
  ReloadOutlined,
  PhoneOutlined,
  CalendarOutlined,
  IdcardOutlined,
} from '@ant-design/icons';
import User from '@/types/UserType';
import useApiHook from '@/hooks/useApi';
import styles from './UserModeration.module.scss';
import { useInterfaceStore } from '@/state/interface';
import { timeDifference } from '@/utils/timeDifference';
import { useQueryClient } from '@tanstack/react-query';
import { IAdminType } from '@/types/IAdminType';
import { hasRequiredRole } from '@/utils/roleUtils';
import { SetPasswordModal, ResetPasswordModal, DeleteUserModal } from './modals';
import { useSelectedProfile } from '@/hooks/useSelectedProfile';

interface UserModerationProps {
  userData: User;
  onDataUpdate: (updatedData: Partial<User>) => void;
}

const UserModeration: React.FC<UserModerationProps> = ({ userData, onDataUpdate }) => {
  const [form] = Form.useForm();
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [resetPasswordModalVisible, setResetPasswordModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const { addAlert } = useInterfaceStore((state) => state);
  const queryClient = useQueryClient();
  const { selectedProfile } = useSelectedProfile();

  // Update form values when userData changes
  useEffect(() => {
    form.setFieldsValue({
      isActive: userData.isActive,
      isEmailVerified: userData.isEmailVerified,
    });
  }, [userData, form]);

  // Update user mutation
  const { mutate: updateUser, isLoading: isUpdating } = useApiHook({
    method: 'PUT',
    key: 'user.update',
  }) as any;

  // Send verification email mutation
  const { mutate: sendVerificationEmail, isLoading: isSendingEmail } = useApiHook({
    method: 'POST',
    key: 'user.sendVerification',
  }) as any;

  const handleToggle = (field: keyof User, value: boolean) => {
    updateUser(
      {
        url: `/user/${userData._id}`,
        formData: { [field]: value },
      },
      {
        onSuccess: (data: any) => {
          addAlert({
            type: 'success',
            message: `User ${field} updated successfully`,
          });
          // Invalidate the user query to refetch fresh data
          queryClient.invalidateQueries({ queryKey: ['user', userData._id] });
          // Update parent component's local state
          onDataUpdate({ [field]: value });
        },
        onError: () => {
          addAlert({
            type: 'error',
            message: `Failed to update user ${field}`,
          });
          // Revert form value on error
          form.setFieldsValue({ [field]: !value });
        },
      }
    );
  };

  const handleSendVerificationEmail = () => {
    sendVerificationEmail(
      {
        url: `/user/${userData._id}/send-verification`,
        formData: {},
      },
      {
        onSuccess: () => {
          addAlert({
            type: 'success',
            message: 'Verification email sent successfully!',
          });
        },
        onError: () => {
          addAlert({
            type: 'error',
            message: 'Failed to send verification email',
          });
        },
      }
    );
  };

  const handleModalSuccess = () => {
    // Invalidate user query to refetch data
    queryClient.invalidateQueries({ queryKey: ['user', userData._id] });
  };

  const getProfileRefColor = (refType: string) => {
    switch (refType.toLowerCase()) {
      case 'admin':
        return '#f50';
      case 'athlete':
        return '#52c41a';
      case 'team':
        return '#1890ff';
      case 'coach':
        return '#722ed1';
      case 'manager':
        return '#fa8c16';
      default:
        return '#8c8c8c';
    }
  };

  const activeProfileRefs = userData?.profileRefs
    ? Object.entries(userData.profileRefs).filter(
        ([key, value]) => value !== null && value !== undefined
      )
    : [];

  return (
    <div className={styles.container}>
      {/* User Identity Section */}
      <div className={styles.userIdentity}>
        <div className={styles.userAvatar}>
          <Avatar
            icon={<UserOutlined />}
            size={64}
            style={{ backgroundColor: '#1890ff' }}
            src={userData.profileImageUrl}
          />
        </div>
        <div className={styles.userInfo}>
          <h3 className={styles.userName}>{userData.fullName}</h3>
          <div className={styles.userEmail}>
            <MailOutlined /> {userData.email}
          </div>
          {userData.phoneNumber && (
            <div className={styles.userPhone}>
              <PhoneOutlined /> {userData.phoneNumber}
            </div>
          )}
          <div className={styles.badges}>
            {activeProfileRefs.map(([refType, refId]) => (
              <Tag key={refType} color={getProfileRefColor(refType)}>
                {refType.toUpperCase()}
              </Tag>
            ))}
          </div>
        </div>
      </div>

      <Divider />

      {/* Account Status Toggles */}
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Account Status</h4>

        <Form form={form} layout="vertical">
          <div className={styles.toggleItem}>
            <div className={styles.toggleLabel}>
              {form.getFieldValue('isActive') ? (
                <CheckCircleOutlined style={{ color: '#52c41a' }} />
              ) : (
                <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
              )}
              <span>Account Active</span>
            </div>
            <Form.Item name="isActive" valuePropName="checked" noStyle>
              <Switch
                onChange={(checked) => handleToggle('isActive', checked)}
                loading={isUpdating}
                checkedChildren={<UnlockOutlined />}
                unCheckedChildren={<LockOutlined />}
              />
            </Form.Item>
          </div>

          <div className={styles.toggleItem}>
            <div className={styles.toggleLabel}>
              {form.getFieldValue('isEmailVerified') ? (
                <MailOutlined style={{ color: '#52c41a' }} />
              ) : (
                <MailOutlined style={{ color: '#faad14' }} />
              )}
              <span>Email Verified</span>
            </div>
            <Form.Item name="isEmailVerified" valuePropName="checked" noStyle>
              <Switch
                onChange={(checked) => handleToggle('isEmailVerified', checked)}
                loading={isUpdating}
                checkedChildren={<CheckCircleOutlined />}
                unCheckedChildren={<CloseCircleOutlined />}
              />
            </Form.Item>
          </div>
        </Form>
      </div>

      <Divider />

      {/* Account Information */}
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Account Information</h4>
        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>
              <IdcardOutlined /> User ID
            </span>
            <span className={styles.infoValue}>{userData._id}</span>
          </div>

          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>
              <CalendarOutlined /> Joined
            </span>
            <span className={styles.infoValue}>
              {timeDifference(new Date(), new Date(userData.createdAt))}
            </span>
          </div>

          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>
              <CalendarOutlined /> Last Login
            </span>
            <span className={styles.infoValue}>
              {userData.lastSignedIn
                ? timeDifference(new Date(), new Date(userData.lastSignedIn))
                : 'Never'}
            </span>
          </div>

          {userData.customerId && (
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Customer ID</span>
              <span className={styles.infoValue}>{userData.customerId}</span>
            </div>
          )}

          {userData.permissions && userData.permissions.length > 0 && (
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Permissions</span>
              <div className={styles.permissionTags}>
                {userData.permissions.map((permission) => (
                  <Tag key={permission} color="blue">
                    {permission}
                  </Tag>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <Divider />

      {/* Authentication Management */}
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Authentication</h4>
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          {!userData.isEmailVerified && (
            <Tooltip title="Resend verification email to user">
              <Button
                icon={<MailOutlined />}
                onClick={handleSendVerificationEmail}
                loading={isSendingEmail}
                block
                size="small"
              >
                Send Verification Email
              </Button>
            </Tooltip>
          )}

          <Tooltip title="Generate a secure password and email it to the user">
            <Button
              icon={<ReloadOutlined />}
              onClick={() => setResetPasswordModalVisible(true)}
              block
              size="small"
            >
              Reset Password (Auto)
            </Button>
          </Tooltip>

          <Tooltip title="Set a custom password for the user">
            <Button
              icon={<LockOutlined />}
              onClick={() => setPasswordModalVisible(true)}
              block
              size="small"
            >
              Set Custom Password
            </Button>
          </Tooltip>
        </Space>
      </div>

      <Divider />

      {/* Danger Zone */}
      {hasRequiredRole(selectedProfile?.permissions, ['users.delete']) && (
        <div className={styles.section}>
          <h4 className={styles.sectionTitle} style={{ color: '#ff4d4f' }}>
            Danger Zone
          </h4>
          <Button
            type="primary"
            danger
            icon={<UserDeleteOutlined />}
            onClick={() => setDeleteModalVisible(true)}
            block
            size="small"
            disabled={selectedProfile?._id === userData._id}
          >
            Delete User Account
          </Button>
        </div>
      )}

      {/* Modals */}
      <SetPasswordModal
        isOpen={passwordModalVisible}
        onClose={() => setPasswordModalVisible(false)}
        userId={userData._id}
        onSuccess={handleModalSuccess}
      />

      <ResetPasswordModal
        isOpen={resetPasswordModalVisible}
        onClose={() => setResetPasswordModalVisible(false)}
        userId={userData._id}
        userEmail={userData?.email}
        onSuccess={handleModalSuccess}
      />

      <DeleteUserModal
        isOpen={deleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
        userId={userData._id}
        userName={userData?.fullName}
        hasActiveSubscription={false}
        hasMinistries={false}
      />
    </div>
  );
};

export default UserModeration;
