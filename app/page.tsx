import TopHeader from "./components/TopHeader";
import Sidebar from "./components/Sidebar";
import WelcomeRow from "./components/WelcomeRow";
import WorksSection from "./components/WorksSection";

export default function Home() {
  return (
    <div className="grid h-screen grid-cols-[12.5vw_1fr] grid-rows-[auto_minmax(0,1fr)]">
      <div className="col-span-2">
        <TopHeader />
      </div>
      <Sidebar />
      <div className="no-scrollbar overflow-y-auto bg-page">
        <WelcomeRow />
        <WorksSection />
      </div>
    </div>
  );
}
