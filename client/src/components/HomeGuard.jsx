import { Navigate } from "react-router-dom";
import { useGetMeQuery } from "@/feature/api/authApi";

const HomeGuard = ({ children, allowedRole }) => {
  const { data, isLoading } = useGetMeQuery();

  if (isLoading) return null;

  const role = data?.role;
  const user = data?.user;

  // If logged in & role matches → redirect
  if (role === allowedRole) {
    return <Navigate to="/dashboard/patient" replace />;
  }

  return children;
};

export default HomeGuard;
