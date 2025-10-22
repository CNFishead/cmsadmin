'use client';
import React, { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { ModalProps } from './Modal.types';
import styles from './Modal.module.scss';
import { MdClose } from 'react-icons/md';

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  closable = true,
  maskClosable = true,
  width = 520,
  className = '',
  centered = false,
  zIndex = 1000,
}) => {
  // Handle ESC key press
  const handleEscape = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    },
    [isOpen, onClose]
  );

  // Handle overlay click
  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (maskClosable && event.target === event.currentTarget) {
      onClose();
    }
  };

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleEscape);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, handleEscape]);

  if (!isOpen) return null;

  const modalContent = (
    <div
      className={`${styles.modalOverlay} ${centered ? styles.centered : ''}`}
      onClick={handleOverlayClick}
      style={{ zIndex }}
    >
      <div
        className={`${styles.modal} ${className}`}
        style={{ width: typeof width === 'number' ? `${width}px` : width }}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || closable) && (
          <div className={styles.modalHeader}>
            {title && <h2 className={styles.modalTitle}>{title}</h2>}
            {closable && (
              <button
                className={styles.closeButton}
                onClick={onClose}
                aria-label="Close modal"
                type="button"
              >
                <MdClose />
              </button>
            )}
          </div>
        )}

        <div className={styles.modalBody}>{children}</div>

        {footer && <div className={styles.modalFooter}>{footer}</div>}
      </div>
    </div>
  );

  // Render modal in a portal at the end of body
  return createPortal(modalContent, document.body);
};

export default Modal;
