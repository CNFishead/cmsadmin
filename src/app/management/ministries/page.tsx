import PageLayout from '@/layout/page/Page.layout';
import { navigation } from '@/data/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ShepherdCMS — Ministries',
  description: 'Manage ministries in the application',
};

export default function Page() {
  return <PageLayout pages={[navigation().management.links.ministries]}><></></PageLayout>;
}
