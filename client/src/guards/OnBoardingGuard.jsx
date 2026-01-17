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
    console.log("AuthGuard is hitted");

    return <Navigate to={`/dashboard/${data.role}`} replace />;
  }

  return children;
};

export default OnBoardingGuard;
