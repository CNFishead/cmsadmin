import { navigation } from "@/data/navigation";
import PageLayout from "@/layout/page/Page.layout";
import Members from "@/views/members/Members.screen";

export default function Home() {
  return (
    <PageLayout pages={[navigation().ministries.links.members]}>
      <Members />
    </PageLayout>
  );
}
