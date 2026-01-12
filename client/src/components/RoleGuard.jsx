import { useGetMeQuery } from "@/feature/api/authApi";
import React from "react";
import { Navigate } from "react-router-dom";

const RoleGuard = ({ allowedRole, children }) => {
  const { data, isLoading, isError } = useGetMeQuery();

  if (isLoading) {
    console.log("RoleGuard loading...", data);
    return <div>Loading...</div>;
  }
  if (isError || !data) {
    return <Navigate to="/login/patient" replace />;
  }
  const { role, user } = data;
  if (!user?.isVerified) return <Navigate to={`/onboarding/${role}`} replace />;
  console.log("role guard is hit");

  if (allowedRole && role !== allowedRole)
    return <Navigate to={`/dashboard/${role}`} replace />;

  return children;
};

export default RoleGuard;
