import PageLayout from '@/layout/page/Page.layout';
import { navigation } from '@/data/navigation';
import { Metadata } from 'next';
import Users from '@/views/users/Users.view';

export const metadata: Metadata = {
  title: 'ShepherdCMS — Users',
  description: 'Manage users in the application',
};

export default function Page() {
  return <Users />;
}
