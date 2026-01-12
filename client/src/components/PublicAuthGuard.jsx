import { useGetMeQuery } from "@/feature/api/authApi";
import React from "react";
import { Navigate } from "react-router-dom";

const PublicAuthGuard = ({ children }) => {
  const { data, isLoading } = useGetMeQuery();
  if (isLoading) return null;
  if (data) {
    const role = data.role;
    console.log("PublicAuthGuard is hitted");
    if (!data.user?.isVerified) {
      return <Navigate to={`/onboarding/${role}`} replace />;
    }
    return <Navigate to={`/dashboard/${role}`} replace />;
  }
  return children;
};

export default PublicAuthGuard;
