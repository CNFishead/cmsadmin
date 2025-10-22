import PageLayout from '@/layout/page/Page.layout';
import Dashboard from '@/views/dashboard/Dashboard.view';
import { navigation } from '@/data/navigation';
import type { Metadata } from 'next';
import DynamicTitleUpdater from '@/layout/dynamicTitleUpdater/DynamicTitleUpdater.layout';

export const metadata: Metadata = {
  title: 'Shepherds CMS | Dashboard',
};

export default function Home() {
  return (
    <>
      <DynamicTitleUpdater baseTitle="Shepherds CMS | Dashboard" />
      <Dashboard />
    </>
  );
}
