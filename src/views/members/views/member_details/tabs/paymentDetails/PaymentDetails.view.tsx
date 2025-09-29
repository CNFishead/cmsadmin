'use client';
import React from 'react';
import Loader from '../../../../../../components/loader/Loader.component';
import { BsTrash2Fill } from 'react-icons/bs';
import checkRole from '@/utils/checkRoles';
import SearchWrapper from '@/layout/searchWrapper/SearchWrapper.layout';
import { Button, Table } from 'antd';
import moment from 'moment';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useUser } from '@/state/auth';
import useApiHook from '@/hooks/useApi';

const PaymentDetails = () => {
  const { data: loggedInUser } = useUser();
  const { id } = useParams();
  const {
    data: receiptsData,
    isLoading: loading,
    error,
    isError,
    isFetching,
  } = useApiHook({
    url: `/admin/receipts?userId=${id}`,
    key: 'receiptList',
    enabled: !!id,
    method: 'GET',
  }) as any;
  return (
    <SearchWrapper
      buttons={[]}
      filters={[
        { label: 'All', key: '' },
        { label: 'Failed', key: 'type;error' },
        { label: 'Pending', key: 'type;pending' },
        { label: 'Refund', key: 'type;refund' },
        { label: 'Sale', key: 'type;sale' },
        { label: 'Void', key: 'type;void' },
      ]}
      sort={[
        {
          label: 'Clear',
          key: '',
        },
        {
          label: 'Date (Newest)',
          key: 'billedAt;-1',
        },
        {
          label: 'Date (Oldest)',
          key: 'billedAt;1',
        },
        {
          label: 'Amount (Highest)',
          key: 'amount;-1',
        },
        {
          label: 'Amount (Lowest)',
          key: 'amount;1',
        },
      ]}
      placeholder="Search Receipts by ID, Amount, etc."
      total={receiptsData?.totalCount}
      queryKey="receiptList"
      isFetching={isFetching}
    >
      {loading || isFetching ? (
        <Loader />
      ) : (
        <Table
          columns={[
            {
              title: 'Transaction ID',
              dataIndex: 'transactionId',
              key: 'transactionId',
            },
            {
              title: 'Type',
              dataIndex: 'type',
              key: 'type',
              render: (type) => {
                return (
                  <span
                    className={`badge ${
                      type === 'sale'
                        ? 'bg-success'
                        : type === 'refund'
                        ? 'bg-info'
                        : type === 'error'
                        ? 'bg-danger'
                        : type === 'void'
                        ? 'bg-secondary'
                        : 'bg-warning'
                    } p-2 w-100`}
                  >
                    {type}
                  </span>
                );
              },
            },
            {
              title: 'User',
              // dataIndex is nested inside the billing object
              dataIndex: ['billing', 'name'],
              key: 'billingName',
            },
            {
              title: 'Memo',
              dataIndex: 'memo',
              key: 'memo',
            },
            {
              title: 'Transaction Date',
              // dataIndex is a date object we want to format to a string
              // with format('MM/DD/YYYY')
              dataIndex: 'billedAt',
              key: 'billedAt',
              render: (date) => {
                return moment(date).format('MM/DD/YYYY');
              },
            },
            {
              title: 'Account Owner',
              dataIndex: ['accountOwner', 'businessName'],
              key: 'accountOwnerBusinessName',
            },
            {
              title: 'Amount',
              dataIndex: 'amount',
              key: 'amount',
              render: (amount) => {
                return `$${amount.toFixed(2)}`;
              },
            },
            {
              title: 'Actions',
              key: 'actions',
              render: (text, record: any) => {
                return (
                  <div className="d-flex justify-content-around">
                    {/* render a next/link as a button */}
                    <Link href={`/admin/receipts/${record?._id}`}>
                      <Button>View</Button>
                    </Link>

                    <Button
                      onClick={
                        () => {}
                        // dispatch(deleteReceipt(record._id, false))
                      }
                      // disabled={checkRole(loggedInUser?.role, [
                      //   'admin',
                      //   'superAdmin',
                      //   'accountant',
                      // ])}
                    >
                      <BsTrash2Fill /> Delete
                    </Button>
                  </div>
                );
              },
            },
          ]}
          dataSource={receiptsData?.payload}
          rowKey="_id"
          pagination={false}
        />
      )}
    </SearchWrapper>
  );
};

export default PaymentDetails;
