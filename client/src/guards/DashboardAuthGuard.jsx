import { useGetMeQuery } from "@/feature/api/authApi";
import { Navigate } from "react-router-dom";

const DashboardAuthGuard = ({ children, allowedRole }) => {
  const { data, isLoading, isError } = useGetMeQuery();

  // Wait until data arrives
  if (isLoading) return null;

  // If error → user not logged in
  if (isError) {
    return <Navigate to="/login/patient" replace />;
  }

  // Still no data but not error → do NOT redirect yet
  if (!data) {
    return null;
  }

  const { role, user } = data;

  // Not verified
  if (!user?.isVerified) {
    return <Navigate to={`/onboarding/${role}`} replace />;
  }

  // Role mismatch = redirect to their own dashboard
  if (allowedRole && role !== allowedRole) {
    return <Navigate to={`/dashboard/${role}`} replace />;
  }

  return children;
};

export default DashboardAuthGuard;
