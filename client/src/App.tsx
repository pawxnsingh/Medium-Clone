// this is the "/" client side route
import { Outlet, useLocation } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { isAuthenticatedSelector } from "./recoil/selector/isAutenticated";
import Dashboard from "./components/dashboard/Dashboard";
import Landing from "./components/Landing";

// every thing will be handled here
const App = () => {
  // this user value is transitory, which mean it change with each rerender
  const user = useRecoilValue(isAuthenticatedSelector);
  console.log("user status -> ", user);

  const location = useLocation();
  // Define the paths where you want the Outlet to render
  const outletPaths = ["/signin", "/signup"];
  // Check if the current path is one of the paths for Outlet
  const isOutletPath = outletPaths.includes(location.pathname);
  // return <>{isOutletPath ? <Outlet /> : user ? <Dashboard /> : <Landing />}</>;

  return <Dashboard />;
};

export default App;
