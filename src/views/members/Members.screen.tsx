'use client';
import SearchWrapper from '@/layout/searchWrapper/SearchWrapper.layout';
import styles from './Members.module.scss';
import React from 'react';
import { AiOutlinePlus, AiOutlineUser } from 'react-icons/ai';
import UserType from '@/types/UserType';
import { Avatar, Button, Skeleton, Table } from 'antd';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUser } from '@/state/auth';
import useApiHook from '@/hooks/useApi';

const Members = () => {
  const router = useRouter();

  const { data: loggedInData } = useUser();
  const { data: membersListData, isLoading: loading } = useApiHook({
    url: `/admin/user`,
    key: 'members',
    method: 'GET',
  }) as any;

  const { mutate: deleteMember } = useApiHook({
    queriesToInvalidate: ['members'],
    method: 'DELETE',
    key: 'delete-member',
  }) as any;
  return (
    <div className={styles.container}>
      <SearchWrapper
        buttons={[
          {
            toolTip: 'Add Member',
            icon: (
              <div className={styles.iconContainer}>
                <AiOutlinePlus /> <AiOutlineUser className={styles.icon} />
              </div>
            ),
            // set onClick to return nothing
            onClick: () => {
              router.push('/members/new');
            },
            type: 'primary',
          },
        ]}
        filters={[
          {
            label: 'All',
            key: '',
          },
          {
            label: 'Staff Only',
            key: `role;{"$eq":"staff"}`,
          },
        ]}
        sort={[
          {
            label: 'None',
            key: '',
          },
          {
            label: 'Name (A-Z)',
            key: 'firstName;1',
          },
        ]}
        placeholder="Search Members"
        queryKey="members"
        total={membersListData?.metadata?.totalCount}
        isFetching={loading}
      >
        <div className={styles.contentContainer}>
          <Table
            className={styles.table}
            dataSource={membersListData?.payload}
            loading={loading}
            size="small"
            rowKey={(record: UserType) => record._id}
            columns={[
              {
                title: 'Member',
                dataIndex: 'profileImageUrl',
                key: 'profileImageUrl',
                render: (text: string, record: UserType) => {
                  return (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                      <Avatar src={text} size={64} /> <span>{record.fullName}</span>
                    </div>
                  );
                },
              },
              {
                title: 'Email',
                dataIndex: 'email',
                key: 'email',
              },
              {
                title: 'Phone',
                dataIndex: 'phoneNumber',
                key: 'phone',
                render: (text: string) => {
                  // format the phone number
                  if (!text) return null;
                  // if the string has an 11th character, it is a country code
                  if (text.length === 11) {
                    return text.replace(/(\d{1})(\d{3})(\d{3})(\d{4})/, '+$1 ($2) $3-$4');
                  }
                  // otherwise, it is a US number
                  return text.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
                },
              },
              {
                title: 'Role',
                dataIndex: 'role',
                key: 'role',
                // role is an array of roles, so we need to join them
                render: (text: string[]) => text.join(', '),
              },
              {
                title: 'Actions',
                dataIndex: 'actions',
                key: 'actions',
                render: (text: string, record: UserType) => {
                  return (
                    <div className={styles.actions}>
                      <Link href={`/members/${record._id}`}>
                        <Button>
                          <FaEdit />
                        </Button>
                      </Link>
                      <Button onClick={() => deleteMember({ url: `/member/${record._id}` })}>
                        <FaTrash />
                      </Button>
                    </div>
                  );
                },
              },
            ]}
            pagination={false}
          />
        </div>
      </SearchWrapper>
    </div>
  );
};

export default Members;
