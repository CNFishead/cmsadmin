'use client';
import React from 'react';
import styles from './Ministry.module.scss';
import { useUser } from '@/state/auth';
import { useParams } from 'next/navigation';
import useApiHook from '@/state/useApi';
import SearchWrapper from '@/layout/searchWrapper/SearchWrapper.layout';
import Loader from '@/components/loader/Loader.component';
import { Button, Modal, Table } from 'antd';
import Link from 'next/link';
import checkRoles from '@/utils/checkRoles';
import { BsTrash2Fill } from 'react-icons/bs';
import { MdOpenInNew } from 'react-icons/md';

const Ministry = () => {
  const { data: loggedInUser } = useUser();
  const [modal, contextHolder] = Modal.useModal();
  const { id } = useParams();
  const {
    data: data,
    isLoading: loading,
    isFetching,
  } = useApiHook({
    url: `/ministry/${id}/subministries`,
    key: 'ministryList',
    enabled: !!id,
    method: 'GET',
    filter: `user;${id}`,
  }) as any;

  const { mutate: removeItem } = useApiHook({
    key: 'ministryList',
    method: 'DELETE',
  }) as any;

  const handleDelete = (id: string) => {};

  return (
    <SearchWrapper
      buttons={[]}
      filters={[]}
      sort={[]}
      placeholder="Search Receipts by ID, Amount, etc."
      total={data?.pagination?.totalCount}
      queryKey="ministryList"
      isFetching={isFetching}
    >
      {loading || isFetching ? (
        <Loader />
      ) : (
        <Table
          columns={[
            {
              title: 'ID',
              dataIndex: '_id',
              key: '_id',
            },
            {
              title: 'Name',
              dataIndex: 'name',
              key: 'name',
            },
            {
              title: '# of Members',
              dataIndex: 'members',
              key: 'members',
              render: (text, record: any) => {
                return record?.members?.length;
              },
            },
            {
              title: 'Actions',
              key: 'actions',
              render: (text, record: any) => {
                return (
                  <div className="d-flex justify-content-around" style={{ display: 'flex', gap: '1rem' }}>
                    {/* render a next/link as a button */}
                    <Link href={`/ministries/${record?._id}`}>
                      <Button className={styles.button}><MdOpenInNew /></Button>
                    </Link>

                    <Button
                      onClick={() => {
                        modal.confirm({
                          title: 'This action cannot be undone. ',
                          content:
                            'Are you sure you want to delete this item? This action cannot be undone. and will remove a ministry from this user. This should only be done at the request of the user.',
                          onOk: () => {
                            removeItem({ url: `/ministry/${id}/subministries/${id}` });
                          },
                          okButtonProps: {
                            danger: true,
                          },
                          okText: 'Yes, Delete',
                        });
                      }}
                      disabled={checkRoles(loggedInUser?.role, [
                        'admin',
                        'superAdmin',
                        'accountant',
                      ])}
                      className={styles.dangerButton}
                    >
                      <BsTrash2Fill />
                    </Button>
                  </div>
                );
              },
            },
          ]}
          dataSource={data?.payload}
          rowKey="_id"
          pagination={false}
        />
      )}
      {contextHolder}{' '}
      {/* This is the modal, this should always be below where you want to access the modal */}
    </SearchWrapper>
  );
};

export default Ministry;
