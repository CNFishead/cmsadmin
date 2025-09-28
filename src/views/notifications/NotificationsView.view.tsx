'use client';
import Container from '@/layout/container/Container.layout';
import styles from './NotificationsView.module.scss';
import { Button, Empty } from 'antd';
import NotificationItem from '@/components/notificationItem/NotificationItem.component';
import NotificationType from '@/types/NotificationType';
import useApiHook from '@/hooks/useApi';

const NotificationsView = () => {
  const { data } = useApiHook({
    url: `/notification`,
    key: 'notifications',
    method: 'GET',
  }) as any;

  const { mutate: updateNotification } = useApiHook({
    queriesToInvalidate: ['notifications'],
    method: 'PUT',
    key: 'update-notification',
  }) as any;
  return (
    <Container
      title={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              flex: '1',
            }}
          >
            Notifications
          </span>
          <Button type="primary" onClick={() => updateNotification({ url: '' })}>
            Mark all Read
          </Button>
        </div>
      }
    >
      <div className={styles.notifications}>
        {data?.notifications?.length > 0 ? (
          data?.notifications.map((notification: NotificationType) => {
            return <NotificationItem notification={notification} key={notification.entityId} />;
          })
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="You have no notifications" />
        )}
      </div>
    </Container>
  );
};

export default NotificationsView;
