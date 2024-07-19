import Headerdashboard from "../dashboard/Headerdashboard";
import Dashboardcontent from "./Content";
import Sidepanel from "./Sidepanel";

const Dashboard = () => {
  return (
    <div className="">
      <Headerdashboard />
      <div className="flex justify-evenly mt-[1rem]">
        <Dashboardcontent />
        <Sidepanel />
      </div>
    </div>
  );
};

export default Dashboard;
