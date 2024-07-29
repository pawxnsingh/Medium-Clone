import { Outlet, useLocation } from "react-router-dom";
import { useRecoilValue } from "recoil";
import Dashboard from "./components/dashboard/Dashboard";
import Landing from "./components/Landing";
import { userAtom } from "./recoil/atoms/userAtom";

const App = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Landing />;
  }
  // const user = useRecoilValue(userAtom);
  const user = true;
  const location = useLocation();
  const outletPaths = ["/signin", "/signup", "/new-story"];
  const isOutletPath = outletPaths.includes(location.pathname);
  return <>{isOutletPath ? <Outlet /> : user ? <Dashboard /> : <Landing />}</>;
};
export default App;
