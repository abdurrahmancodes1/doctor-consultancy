import { useGetMeQuery } from "@/feature/api/authApi";
import { Navigate } from "react-router-dom";

const DashboardAuthGuard = ({ children, allowedRole }) => {
  const { data, isLoading, isError } = useGetMeQuery();

  if (isLoading) return null;

  // not logged in
  if (isError || !data) {
    return <Navigate to="/login/doctor" replace />;
  }

  const { role, user } = data;

  // onboarding not completed
  if (!user?.isVerified) {
    return <Navigate to={`/onboarding/${role}`} replace />;
  }

  // role mismatch
  if (allowedRole && role !== allowedRole) {
    return <Navigate to={`/dashboard/${role}`} replace />;
  }

  return children;
};

export default DashboardAuthGuard;
