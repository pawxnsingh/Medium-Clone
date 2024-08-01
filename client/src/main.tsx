import { Toaster } from "./components/ui/toast/toaster.tsx";
import { BrowserRouter } from "react-router-dom";
import ReactDOM from "react-dom/client";
import { RecoilRoot } from "recoil";
import App from "./App.tsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
    <RecoilRoot>
      <BrowserRouter>
        <App />
        <Toaster />
      </BrowserRouter>
    </RecoilRoot>
  // </React.StrictMode>
);
