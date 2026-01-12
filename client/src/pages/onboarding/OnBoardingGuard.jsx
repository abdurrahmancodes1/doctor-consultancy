import { Navigate } from "react-router-dom";
import { useGetMeQuery } from "@/feature/api/authApi";

const OnBoardingGuard = ({ children, role }) => {
  const { data, isLoading, isError } = useGetMeQuery();

  if (isLoading) return null;

  if (isError) {
    return <Navigate to="/login/patient" replace />;
  }

  if (data.role !== role) {
    return <Navigate to={`/onboarding/${data.role}`} replace />;
  }

  if (data.user?.isVerified) {
    return <Navigate to={`/${data.role}/dashboard`} replace />;
  }

  return children;
};

export default OnBoardingGuard;
