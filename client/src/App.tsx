import { Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

import SigninCard from "./components/SigninCard.tsx";
import SignupCard from "./components/SignupCard.tsx";

// import { userAtom } from "./recoil/atoms/userAtom";
// import { useRecoilValue } from "recoil";

import Dashboard from "./components/dashboard/Dashboard";
import Landing from "./components/Landing";
import ArticleDisplay from "./components/dashboard/ArticleDisplay";
import Profilepage from "./components/Profilepage.tsx";
import LandingPageHeader from "./components/Header.tsx";
import DashboardHeader from "./components/dashboard/Headerdashboard.tsx";
import ErrorPage from "./components/ErrorPage.tsx";
import Newstory from "./components/createArticle/Newstory.tsx";
// import { isAuth } from "./recoil/atoms/isAuth.ts";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // const user = useRecoilValue(isAuth);
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const ProtectedRoute = () => {
    if (!isLoggedIn) {
      return <Navigate to="/" replace />;
    }
    return <Outlet />;
  };

  const Layout = () => {
    return (
      <>
        {isLoggedIn ? (
          location.pathname === "/new-story" ? (
            ""
          ) : (
            <DashboardHeader />
          )
        ) : (
          <LandingPageHeader />
        )}
        <Outlet />
      </>
    );
  };

  return (
    <>
      <Routes>
        <Route path="new-story" element={<Newstory />} />
        <Route path="/" element={<Layout />}>
          <Route index element={isLoggedIn ? <Dashboard /> : <Landing />} />
          <Route element={<ProtectedRoute />}>
            <Route path=":username" element={<Profilepage />} />
            <Route path=":username/:articleId" element={<ArticleDisplay />} />
          </Route>
        </Route>

        <Route path="signin" element={<SigninCard />} />
        <Route path="signup" element={<SignupCard />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </>
  );
};
export default App;
