import { navigation } from '@/data/navigation';
import PageLayout from '@/layout/page/Page.layout'; 
import MemberDetails from '@/views/members/views/member_details/MemberDetails.view';

export default function Home() {
  return (
    <PageLayout pages={[navigation().ministries.links.members]} largeSideBar>
      <MemberDetails />
    </PageLayout>
  );
}
