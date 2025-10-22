import { ReactNode } from 'react';

export interface ModalProps {
  /**
   * Whether the modal is visible
   */
  isOpen: boolean;

  /**
   * Callback when modal should close
   */
  onClose: () => void;

  /**
   * Modal title
   */
  title?: string | ReactNode;

  /**
   * Modal content
   */
  children?: ReactNode;

  /**
   * Footer content (buttons, actions)
   */
  footer?: ReactNode;

  /**
   * Whether to show the close button (X)
   */
  closable?: boolean;

  /**
   * Whether clicking the overlay closes the modal
   */
  maskClosable?: boolean;

  /**
   * Width of the modal
   */
  width?: string | number;

  /**
   * Custom className for the modal
   */
  className?: string;

  /**
   * Whether to center the modal vertically
   */
  centered?: boolean;

  /**
   * Z-index of the modal
   */
  zIndex?: number;
}

export interface ConfirmModalOptions {
  /**
   * Confirmation modal title
   */
  title: string | ReactNode;

  /**
   * Confirmation modal content
   */
  content: string | ReactNode;

  /**
   * OK button text
   */
  okText?: string;

  /**
   * Cancel button text
   */
  cancelText?: string;

  /**
   * OK button type
   */
  okType?: 'primary' | 'danger' | 'default';

  /**
   * Callback when OK is clicked
   */
  onOk?: () => void | Promise<void>;

  /**
   * Callback when Cancel is clicked
   */
  onCancel?: () => void;

  /**
   * Width of the modal
   */
  width?: string | number;
}
