import { Navigate } from "react-router-dom";
import { useGetMeQuery } from "@/feature/api/authApi";

const AuthGaurd = ({ children }) => {
  const { data, isLoading, isError } = useGetMeQuery();
  if (isLoading) return null;
  console.log("AuthGuard is hitted");

  if (isError || !data) {
    return <Navigate to="/login/patient" replace />;
  }
  return children;
};
export default AuthGaurd;
