'use client';
import useApiQuery, { ApiResponse } from '@/hooks/useApiQuery';
import MinistryType from '@/types/Ministry';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';
import { Table, Empty } from 'antd';
import { ministriesColumns } from './columns';
import styles from './Ministries.module.scss';
import { ConfirmModal, useConfirmModal } from '@/components/modal';

const Ministries = () => {
  const router = useRouter();
  const { id } = useParams();
  const { confirm, confirmProps } = useConfirmModal();

  const { data, isLoading } = useApiQuery({
    url: `/ministry`,
    method: 'GET',
    key: ['ministries', `${id}`],
    filter: `user;${id}`,
    enabled: !!id,
  }) as unknown as ApiResponse<MinistryType[]>;

  const { mutate: deleteMinistry, isPending: isDeleting } = useApiQuery({
    method: 'DELETE',
    key: ['delete-ministry'],
    successMessage: 'Ministry deleted successfully',
    queriesToInvalidate: ['ministries'],
  }) as any;

  const handleView = (ministryId: string) => {
    router.push(`/admin/ministries/${ministryId}`);
  };

  const handleEdit = (ministryId: string) => {
    router.push(`/admin/ministries/${ministryId}/edit`);
  };

  const handleDelete = (ministryId: string) => {
    confirm({
      title: 'Delete Ministry',
      content: 'Are you sure you want to delete this ministry? This action cannot be undone.',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: () => {
        deleteMinistry({
          url: `/ministry/${ministryId}`,
        });
      },
    });
  };

  const ministries = Array.isArray(data?.payload) ? data.payload : [];

  return (
    <div className={styles.container}>
      <Table
        dataSource={ministries}
        columns={ministriesColumns(handleView, handleEdit, handleDelete)}
        loading={isLoading || isDeleting}
        rowKey="_id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
        }}
        locale={{
          emptyText: (
            <Empty description="No ministries found" image={Empty.PRESENTED_IMAGE_SIMPLE} />
          ),
        }}
      />
      <ConfirmModal {...confirmProps} />
    </div>
  );
};

export default Ministries;
