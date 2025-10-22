'use client';
import { useState, useCallback } from 'react';
import { ConfirmModalOptions } from './Modal.types';

interface UseConfirmModalReturn {
  /**
   * Show the confirmation modal
   */
  confirm: (options: ConfirmModalOptions) => void;

  /**
   * Confirmation modal props to pass to ConfirmModal component
   */
  confirmProps: ConfirmModalOptions & { isOpen: boolean; onClose: () => void };
}

/**
 * Hook to manage confirmation modal state
 *
 * @example
 * ```tsx
 * const { confirm, confirmProps } = useConfirmModal();
 *
 * const handleDelete = () => {
 *   confirm({
 *     title: 'Delete Item',
 *     content: 'Are you sure?',
 *     okType: 'danger',
 *     onOk: async () => {
 *       await deleteItem();
 *     }
 *   });
 * };
 *
 * return (
 *   <>
 *     <button onClick={handleDelete}>Delete</button>
 *     <ConfirmModal {...confirmProps} />
 *   </>
 * );
 * ```
 */
export const useConfirmModal = (): UseConfirmModalReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmModalOptions>({
    title: '',
    content: '',
  });

  const confirm = useCallback((confirmOptions: ConfirmModalOptions) => {
    setOptions(confirmOptions);
    setIsOpen(true);
  }, []);

  const onClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  return {
    confirm,
    confirmProps: {
      ...options,
      isOpen,
      onClose,
    },
  };
};
