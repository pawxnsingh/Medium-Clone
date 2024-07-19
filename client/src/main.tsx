import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { RecoilRoot } from "recoil";
import "./index.css";

import App from "./App.tsx";
import SigninCard from "./components/SigninCard.tsx";
import SignupCard from "./components/SignupCard.tsx";
import About from "./components/About.tsx";
import Membership from "./components/Membership.tsx";
import Newstory from "./components/Newstory.tsx";
import Profilepage from "./components/Profilepage.tsx";
import ArticleDisplay from "./components/ArticleDisplay.tsx";

const appRouter = createBrowserRouter([
  // this is landing page route/ or we can say that unauthenticated routes
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/signin",
        element: <SigninCard />,
      },
      {
        path: "/signup",
        element: <SignupCard />,
      },
      {
        // pricing section, pitching the user about premium part of the application
        path: "/membership",
        element: <Membership />,
      },
      // protected routes
      //
      //
      //
      {
        // here i need to put the dante2 library for beautified article with images
        path: "/new-story",
        element: <Newstory />,
      },
      {
        // this is the user profile page
        path: "/:username",
        element: <Profilepage />,
      },
      {
        path: "/:userId/:articleId",
        element: <ArticleDisplay />,
      },
      {
        path: "/explore-topic",
        element: <div>this is explore topic route</div>,
      },
      {
        path: "/tag/:tagname",
        element: <div>this is the tag explore page</div>,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RecoilRoot>
      <RouterProvider router={appRouter} />
    </RecoilRoot>
  </React.StrictMode>
);
