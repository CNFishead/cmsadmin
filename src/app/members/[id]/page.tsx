import { navigation } from "@/data/navigation";
import PageLayout from "@/layout/page/Page.layout"; 
import CreateNewMember from "@/views/members/views/createNewMember/CreateNewMember.view";

export default function Home() {
  return (
    <PageLayout pages={[navigation().ministries.links.members]} largeSideBar>
      <CreateNewMember />
    </PageLayout>
  );
}
