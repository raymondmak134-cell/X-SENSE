import { createBrowserRouter } from "react-router";
import HomePage from "./components/home-page";
import AdminPage from "./components/admin-page";
import SupportPage from "./components/support-page";
import CoAlarmsPage from "./components/co-alarms-page";
import SpuDetailPage from "./components/spu-detail-page";
import DownloadCenterPage from "./components/download-center-page";
import AccountPage from "./components/account-page";
import AuthPage from "./components/auth-page";
import BuildSystemPage from "./components/build-system-page";
import ScrollToTopLayout from "./components/scroll-to-top-layout";

export const router = createBrowserRouter([
  {
    Component: ScrollToTopLayout,
    children: [
      { path: "/", Component: HomePage },
      { path: "/co-alarms", Component: CoAlarmsPage },
      { path: "/support", Component: SupportPage },
      { path: "/support/product/:spuId", Component: SpuDetailPage },
      { path: "/support/download-center", Component: DownloadCenterPage },
      { path: "/build-system", Component: BuildSystemPage },
      { path: "/account", Component: AccountPage },
      { path: "/login", Component: AuthPage },
      { path: "/admin", Component: AdminPage },
      { path: "*", Component: HomePage },
    ],
  },
]);