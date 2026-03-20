import { createBrowserRouter } from "react-router";
import HomePage from "./components/home-page";
import AdminPage from "./components/admin-page";
import SupportPage from "./components/support-page";
import CoAlarmsPage from "./components/co-alarms-page";
import SpuDetailPage from "./components/spu-detail-page";

export const router = createBrowserRouter([
  { path: "/", Component: HomePage },
  { path: "/co-alarms", Component: CoAlarmsPage },
  { path: "/support", Component: SupportPage },
  { path: "/support/product/:spuId", Component: SpuDetailPage },
  { path: "/admin", Component: AdminPage },
  { path: "*", Component: HomePage },
]);