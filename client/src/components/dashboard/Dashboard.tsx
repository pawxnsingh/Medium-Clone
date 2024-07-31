// import Headerdashboard from "./Headerdashboard";
import Dashboardcontent from "./Content";
import Sidepanel from "./Sidepanel";
// import { Outlet } from "react-router-dom";
// import { useLocation } from "react-router-dom";
// import { useParams } from "react-router-dom";

const Dashboard = () => {
  // const { username, articleId } = useParams();
  // const outletPaths = [`/${username}/${articleId}`, `/${username}`, `/error`];
  // const location = useLocation();
  // const isOutletPath = outletPaths.includes(location.pathname);
  return (
    // <div className="">
    //   <Headerdashboard />

    //   {isOutletPath ? (
    //     <Outlet />
    //   ) : (
    <div className="flex justify-evenly mt-[1rem]">
      <Dashboardcontent />
      <Sidepanel />
    </div>
    //   )}
    // </div>
  );
};

export default Dashboard;
