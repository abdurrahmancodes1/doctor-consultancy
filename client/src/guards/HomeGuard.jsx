import { Navigate } from "react-router-dom";
import { useGetMeQuery } from "@/feature/api/authApi";

const HomeGuard = ({ children, notAllowed }) => {
  const { data, isLoading } = useGetMeQuery();

  if (isLoading) return null;

  const role = data?.role;
  const user = data?.user;

  // If logged in & role matches → redirect
  if (role === notAllowed) {
    console.log("AuthGuard is hitted");

    // return <Navigate to="/dashboard/doctor" replace />;
    return <Navigate to={`/dashboard/${role}`} replace />;
  }

  return children;
};

export default HomeGuard;
