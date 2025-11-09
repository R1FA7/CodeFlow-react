import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { AdminPage } from "./features/admin/pages/AdminPage";
import { LoginPage } from "./features/auth/pages/LoginPage";
import { RegisterPage } from "./features/auth/pages/RegisterPage";
import { SettingsPage } from "./features/auth/pages/SettingsPage";
import { DashboardLayout } from "./features/common/components/DashboardLayout";
import { ProtectedRoute } from "./features/common/components/ProtectedRoute";
import { PublicRoute } from "./features/common/components/PublicRoute";
import { Unauthorized } from "./features/common/components/Unauthorized";
import { LandingPage } from "./features/common/landingpage/pages/LandingPage";
import { ContestPage } from "./features/contest/pages/ContestPage";
import { ContestsPage } from "./features/contest/pages/ContestsPage";
import { HostContestPage } from "./features/hosting/pages/HostContestPage";
import { OverviewPage } from "./features/overview/pages/OverviewPage";
import { PlaygroundPage } from "./features/playground/pages/PlaygroundPage";
import { ProblemPage } from "./features/problemSet/pages/ProblemPage";
import { ProblemSetPage } from "./features/problemSet/pages/ProblemSetPage";
import { SubmissionsPage } from "./features/submission/SubmissionsPage";
const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/register",
    element: (
      <PublicRoute>
        <RegisterPage />
      </PublicRoute>
    ),
  },
  {
    path: "/login",
    element: (
      <PublicRoute>
        <LoginPage />,
      </PublicRoute>
    ),
  },
  {
    path: "/overview",
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <OverviewPage />
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/settings",
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <SettingsPage />
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/problemset",
    element: (
      <DashboardLayout>
        <ProblemSetPage />
      </DashboardLayout>
    ),
  },
  {
    path: "/problems/:problemId",
    element: (
      <DashboardLayout>
        <ProblemPage />
      </DashboardLayout>
    ),
  },
  {
    path: "/contests",
    element: (
      <DashboardLayout>
        <ContestsPage />
      </DashboardLayout>
    ),
  },
  {
    path: "/contests/:contestId",
    element: (
      <DashboardLayout>
        <ContestPage />
      </DashboardLayout>
    ),
  },
  {
    path: "/contests/:contestId/problems/:problemId",
    element: (
      <DashboardLayout>
        <ProblemPage />
      </DashboardLayout>
    ),
  },
  {
    path: "/submissions",
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <SubmissionsPage />
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/host-contest",
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <HostContestPage />
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <AdminPage />
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/playground",
    element: (
      <DashboardLayout>
        <PlaygroundPage />
      </DashboardLayout>
    ),
  },
  {
    path: "/playground/share/:shareId",
    element: (
      <DashboardLayout>
        <PlaygroundPage />
      </DashboardLayout>
    ),
  },
  {
    path: "/unauthorized",
    element: <Unauthorized />,
  },
]);
function App() {
  return (
    <div>
      <ToastContainer />
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
