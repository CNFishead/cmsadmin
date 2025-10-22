'use client';
import React, { useState } from 'react';
import Modal from './Modal.component';
import { ConfirmModalOptions } from './Modal.types';
import styles from './Modal.module.scss';
import { MdWarning, MdError, MdInfo, MdCheckCircle } from 'react-icons/md';

interface ConfirmModalProps extends ConfirmModalOptions {
  isOpen: boolean;
  onClose: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  title,
  content,
  okText = 'OK',
  cancelText = 'Cancel',
  okType = 'primary',
  onOk,
  onCancel,
  width = 416,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleOk = async () => {
    if (onOk) {
      setIsLoading(true);
      try {
        await onOk();
        onClose();
      } catch (error) {
        console.error('Error in confirm modal:', error);
      } finally {
        setIsLoading(false);
      }
    } else {
      onClose();
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    onClose();
  };

  // Determine icon based on okType
  const getIcon = () => {
    switch (okType) {
      case 'danger':
        return <MdWarning className={`${styles.confirmIcon} ${styles.danger}`} />;
      case 'primary':
        return <MdInfo className={`${styles.confirmIcon} ${styles.info}`} />;
      default:
        return <MdInfo className={`${styles.confirmIcon} ${styles.info}`} />;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      width={width}
      centered
      closable={!isLoading}
      maskClosable={!isLoading}
      className={styles.confirmModal}
      footer={
        <>
          <button
            className={styles.button}
            onClick={handleCancel}
            disabled={isLoading}
            type="button"
          >
            {cancelText}
          </button>
          <button
            className={`${styles.button} ${styles[okType]}`}
            onClick={handleOk}
            disabled={isLoading}
            type="button"
          >
            {isLoading ? 'Loading...' : okText}
          </button>
        </>
      }
    >
      <div className={styles.confirmContent}>
        {getIcon()}
        <div className={styles.confirmText}>
          {title && <div className={styles.confirmTitle}>{title}</div>}
          {content && <div className={styles.confirmDescription}>{content}</div>}
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
