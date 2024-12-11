'use client';
import React, { useState } from 'react';
import styles from './SupportDesk.module.scss';
import { useUser } from '@/state/auth';
import useApiHook from '@/state/useApi';
import GroupCard from './GroupCard.component';
import { Button, Table, Tag, Tooltip } from 'antd';
import { MdOpenInNew } from 'react-icons/md';

const Groups = () => {
  const { data: loggedInData } = useUser();
  const { data, error, isLoading, isError } = useApiHook({
    url: '/support',
    method: 'GET',
    key: 'support-groups',
    filter: `agents;{"$in":"${loggedInData?.user?._id}"}`,
    enabled: !!loggedInData?.user?._id,
  }) as any;

  const [view, setView] = useState<'overview' | 'details'>('overview');
  const [selectedGroup, setSelectedGroup] = useState<any | null>(null);

  const handleGroupClick = (group: any) => {
    setSelectedGroup(group);
    setView('details');
  };

  const handleBackClick = () => {
    setView('overview');
    setSelectedGroup(null);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading data</div>;
  }

  if (!data?.payload?.length) {
    return <div>No groups found</div>;
  }

  return (
    <div className={styles.container}>
      {view === 'overview' && (
        <div className={styles.groupCardContainer}>
          <div className={styles.groupCards}>
            {data.payload.map((group: any) => (
              <GroupCard key={group._id} group={group} onClick={() => handleGroupClick(group)} />
            ))}
          </div>
        </div>
      )}

      {view === 'details' && selectedGroup && (
        <div className={styles.detailsView}>
          <button onClick={handleBackClick} className={styles.backButton}>
            Back
          </button>
          <h2>{selectedGroup.name} - Tickets</h2>
          <TicketTable group={selectedGroup} />
        </div>
      )}
    </div>
  );
};

const TicketTable = ({ group }: { group: any }) => {
  const {
    data: ticketData,
    error,
    isLoading,
    isError,
  } = useApiHook({
    url: '/support/ticket',
    method: 'GET',
    key: `group-tickets-${group._id}`,
    filter: `groups;${group._id}|status;{"$ne":"solved"}`,
    enabled: !!group._id,
  }) as any;

  if (isLoading) {
    return <div>Loading tickets...</div>;
  }

  if (isError) {
    return <div>Error loading tickets for {group.name}</div>;
  }

  return (
    <Table
      className={styles.ticketTable}
      dataSource={ticketData?.payload}
      loading={isLoading}
      size="small"
      rowKey={(record: any) => record._id}
      columns={[
        {
          title: 'Subject',
          dataIndex: 'subject',
          key: 'subject',
        },
        {
          title: 'Group',
          dataIndex: 'groups',
          key: 'group',
          render: (text: string, record: any) => {
            // group is an array of objects, so we need to return the name of the group
            return record.groups?.map((group: any) => group.name).join(', ');
          },
        },
        {
          title: 'Status',
          dataIndex: 'status',
          key: 'status',
          render: (text: string, record: any) => {
            // use a switch statement to return the correct status, with a badge
            switch (record.status) {
              case 'open':
                return (
                  <Tooltip title="awaiting response from support">
                    <Tag color="red">Open</Tag>
                  </Tooltip>
                );
              case 'New':
                return (
                  <Tooltip title="has yet to be reviewed by support">
                    <Tag color="gold">New</Tag>
                  </Tooltip>
                );
              case 'solved':
              case 'closed':
                return (
                  <Tooltip title="This ticket has been resolved">
                    <Tag color="gray">Closed</Tag>
                  </Tooltip>
                );
              case 'pending':
                return (
                  <Tooltip title="awaiting response from user">
                    <Tag color="blue">Pending</Tag>
                  </Tooltip>
                );
              default:
                return (
                  <Tooltip title="awaiting response from support">
                    <Tag color="red">Open</Tag>
                  </Tooltip>
                );
            }
          },
        },
        {
          title: 'Priority',
          dataIndex: 'priority',
          key: 'priority',
        },
        {
          title: 'Actions',
          dataIndex: 'actions',
          key: 'actions',
          render: (text: string, record: any) => {
            return (
              <div>
                <Button
                  onClick={() => {
                    // router.push(`/account_details/support/${record._id}`);
                  }}
                  className={styles.actionButton}
                >
                  <MdOpenInNew />
                </Button>
              </div>
            );
          },
        },
      ]}
      pagination={false}
    />
  );
};

export default Groups;
