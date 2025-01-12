import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  useLocation,
} from "react-router-dom";
import Register from "./pages/auth/signup.tsx";

import Login from "./pages/auth/login.tsx";
import SiteTable from "./components/table/SiteTable.tsx";
import Sidebar from "./components/nav/Navbar.tsx";
import PersonnelTable from "./components/table/PersonnelTable.tsx";
import RegisterOrganization from "./pages/organization/register.tsx";
import { AuthProvider } from "./context/authContext.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import UserTable from "./components/table/UsersTable.tsx";
import VisitorsTable from "./components/table/VisitorsTable.tsx";
import Profile from "./pages/profile.tsx";
import ConfigTable from "./components/table/ConfigTable.tsx";
import ResidentTable from "./components/table/ResidentTable.tsx";
import Dashboard from "./components/dashboard/Dashboard.tsx";

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
      // {
      //   path: "/",
      //   element: <ProtectedRoute element={<Dashboard />} />,
      // },
      {
        path: "/",
        element: <ProtectedRoute element={<Dashboard />} />,
      },
      {
        path: "/forms",
        element: <ProtectedRoute element={<ConfigTable />} />,
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
        path: "/residents",
        element: <ProtectedRoute element={<ResidentTable />} />,
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
        path: "/profile",
        element: <Profile />,
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
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
