import { lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { RecoilRoot } from "recoil";
import "./index.css";

import App from "./App.tsx";
import SigninCard from "./components/SigninCard.tsx";
import SignupCard from "./components/SignupCard.tsx";
const Newstory = lazy(() => import("./components/createArticle/Newstory.tsx"));
import Profilepage from "./components/Profilepage.tsx";
import ArticleDisplay from "./components/dashboard/ArticleDisplay.tsx";
import { Toaster } from "./components/ui/toast/toaster.tsx";

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/signin",
        element: <SigninCard />,
      },
      {
        path: "/signup",
        element: <SignupCard />,
      },
      {
        path: "/new-story",
        element: (
          <Suspense fallback={""}>
            <Newstory />
          </Suspense>
        ),
      },
      {
        path: "/:username",
        element: <Profilepage />,
      },
      {
        path: "/:username/:articleId",
        element: <ArticleDisplay />,
      },
      {
        path: "/tag/:tagname",
        element: <div>this is the tag explore page</div>,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
  <RecoilRoot>
    <RouterProvider router={appRouter} />
    <Toaster />
  </RecoilRoot>
  // </React.StrictMode>
);
