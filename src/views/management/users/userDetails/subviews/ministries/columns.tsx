import MinistryType from '@/types/Ministry';
import { Button, Tag, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { FaEdit, FaEye } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';

export const ministriesColumns = (
  onView: (ministryId: string) => void,
  onEdit: (ministryId: string) => void,
  onDelete: (ministryId: string) => void
): ColumnsType<MinistryType> => [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (text: string, record: MinistryType) => (
      <Tooltip title={record.description || 'No description'}>
        <strong>{text}</strong>
      </Tooltip>
    ),
  },
  {
    title: 'Leader',
    dataIndex: 'leader',
    key: 'leader',
    render: (leader: any) => {
      if (!leader) return <Tag color="default">No Leader</Tag>;
      return (
        <span>
          {leader.firstName} {leader.lastName}
        </span>
      );
    },
  },
  {
    title: 'Type',
    dataIndex: 'ministryType',
    key: 'ministryType',
    render: (type: string) => {
      if (!type) return '-';
      return <Tag color="blue">{type}</Tag>;
    },
  },
  {
    title: 'Location',
    key: 'location',
    render: (text: string, record: MinistryType) => {
      const parts = [record.city, record.state].filter(Boolean);
      return parts.length > 0 ? parts.join(', ') : '-';
    },
  },
  {
    title: 'Members',
    dataIndex: 'members',
    key: 'members',
    render: (members: string[]) => {
      const count = members?.length || 0;
      return <Tag color={count > 0 ? 'green' : 'default'}>{count}</Tag>;
    },
  },
  {
    title: 'Actions',
    key: 'actions',
    fixed: 'right',
    width: 150,
    render: (text: string, record: MinistryType) => (
      <div style={{ display: 'flex', gap: '8px' }}>
        <Tooltip title="View Ministry">
          <Button type="text" icon={<FaEye />} onClick={() => onView(record._id)} size="small" />
        </Tooltip>
        <Tooltip title="Edit Ministry">
          <Button type="text" icon={<FaEdit />} onClick={() => onEdit(record._id)} size="small" />
        </Tooltip>
        <Tooltip title="Delete Ministry">
          <Button
            type="text"
            danger
            icon={<MdDelete />}
            onClick={() => onDelete(record._id)}
            size="small"
          />
        </Tooltip>
      </div>
    ),
  },
];
