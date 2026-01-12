import { Navigate } from "react-router-dom";
import { useGetMeQuery } from "@/feature/api/authApi";

const HomeGuard = ({ children }) => {
  const { data, isLoading } = useGetMeQuery();

  if (isLoading) return null;

  // Logged in & verified → redirect to dashboard
  if (data?.user?.isVerified && data.role === "dcotor") {
    return <Navigate to={`/dashboard/patient`} replace />;
  }

  return children;
};

export default HomeGuard;
