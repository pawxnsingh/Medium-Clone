import Dashboardcontent from "./Content";
import Sidepanel from "./Sidepanel";
const Dashboard = () => {
  return (
    <div className="flex justify-evenly mt-[1rem]">
      <Dashboardcontent />
      <Sidepanel />
    </div>
  );
};
export default Dashboard;