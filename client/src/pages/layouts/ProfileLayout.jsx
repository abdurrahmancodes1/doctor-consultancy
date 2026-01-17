import React from "react";
import ProfileDoctor from "../profile/ProfileDoctor";
import ProfilePatient from "../profile/ProfilePatient";
import Loader from "@/components/common/Loader";
import { useGetMeQuery } from "@/feature/api/authApi";

const ProfileLayout = () => {
  const { data, isLoading, refetch } = useGetMeQuery();
  if (isLoading) return <Loader />;
  if (!data) return null;
  if (data.role === "doctor")
    return <ProfileDoctor me={data} refetchMe={refetch} />;
  return <ProfilePatient me={data} refetchMe={refetch} />;
};

export default ProfileLayout;
