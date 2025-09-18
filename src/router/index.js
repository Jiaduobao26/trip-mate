
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

// pages
import Home from "../pages/Home";
import ItineraryList from "../pages/ItineraryList";
import ItineraryDetail from "../pages/ItineraryDetail";
import PlanList from "../pages/PlanList";
import PlanDetail from "../pages/PlanDetail";
import Setup from "../pages/Setup";

function useAuth() {
  // TODO
  const token = 'xxxx';
  return { isAuthed: !!token };
}

function RequireAuth({ children }) {
  const { isAuthed } = useAuth();
  const location = useLocation();
  // Redirect to home if not logged in, preserving the original URL (for post-login redirect)
  if (!isAuthed) return <Navigate to="/" replace state={{ from: location }} />;
  return children;
}

/** Centralized routing configuration */
export default function AppRouter() {
  return (
    <Routes>
      <Route element={<MainLayout />}>

        <Route index element={<Home />} />

        <Route path="setup"
          element={
            <RequireAuth>
              <Setup />
            </RequireAuth>
          } />

        <Route
          path="plan"
          element={
            <RequireAuth>
              <PlanList />
            </RequireAuth>
          }
        />
        <Route
          path="plan/:id"
          element={
            <RequireAuth>
              <PlanDetail />
            </RequireAuth>
          }
        />

        <Route
          path="itinerary"
          element={
            <RequireAuth>
              <ItineraryList />
            </RequireAuth>
          }
        />

        <Route
          path="itinerary/:id"
          element={
            <RequireAuth>
              <ItineraryDetail />
            </RequireAuth>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
