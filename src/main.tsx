import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  useLocation,
} from "react-router-dom";
import App from "./App.tsx";
import Register from "./pages/auth/signup.tsx";
import { ConvexProvider, ConvexReactClient } from "convex/react";

import Login from "./pages/auth/login.tsx";
import SiteTable from "./components/table/SiteTable.tsx";
import Sidebar from "./components/nav/Navbar.tsx";
import PersonnelTable from "./components/table/PersonnelTable.tsx";
import RegisterOrganization from "./pages/auth/register.tsx";
import { AuthProvider } from "./context/authContext.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import UserTable from "./components/table/UsersTable.tsx";
import VisitorsTable from "./components/table/VisitorsTable.tsx";

const convex = new ConvexReactClient("https://little-rabbit-67.convex.cloud");

const Layout = () => {
  const location = useLocation();
  const hideSidebar =
    location.pathname === "/login" ||
    location.pathname === "/sign-up" ||
    location.pathname === "/register-org";

  return (
    <div className="main-layout">
      {!hideSidebar && <Sidebar />}
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
};

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <ProtectedRoute element={<App />} />,
      },
      {
        path: "/sites",
        element: <ProtectedRoute element={<SiteTable />} />,
      },
      {
        path: "/personnel",
        element: <ProtectedRoute element={<PersonnelTable />} />,
      },
      {
        path: "/sites/visitors-log/:siteId",
        element: <ProtectedRoute element={<VisitorsTable />} />,
      },
      {
        path: "/users",
        element: <ProtectedRoute element={<UserTable />} />,
      },
      {
        path: "/sign-up",
        element: <Register />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register-org",
        element: <RegisterOrganization />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <ConvexProvider client={convex}>
        <RouterProvider router={router} />
      </ConvexProvider>
    </AuthProvider>
  </StrictMode>
);
