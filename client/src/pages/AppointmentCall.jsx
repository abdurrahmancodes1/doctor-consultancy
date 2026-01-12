import Call from "@/components/Call";
import {
  useGetSingleAppointmentByIdQuery,
  useJoinAppointmentMutation,
} from "@/feature/api/appointmentApi";
import { useGetMeQuery } from "@/feature/api/authApi";
import React, { useCallback, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const AppointmentCall = () => {
  const params = useParams();
  const navigate = useNavigate();
  const appointmentId = params.appointmentId;
  const { data: appointmentData, isLoading } = useGetSingleAppointmentByIdQuery(
    appointmentId,
    { skip: !appointmentId }
  );
  const appointment = appointmentData?.appointment;
  // const { role, user } = useGetMeQuery();
  const { data: meData, isLoading: meLoading } = useGetMeQuery();
  const currentUser = {
    id: meData.user._id,
    name: meData.user.name,
    role: meData.role,
  };
  console.log(meData.role);
  const [joinAppointment] = useJoinAppointmentMutation();
  const [isNavigating, setIsNavigating] = useState(false);
  const handleCallEnd = useCallback(async () => {
    if (isNavigating) return;
    try {
      setIsNavigating(true);
      if (meData.role === "doctor") {
        navigate(`/doctor/dashboard?completedCall=${appointmentId}`, {
          replace: true,
        });
      } else {
        navigate("/patient/dashboard", { replace: true });
      }
    } catch (error) {
      console.error(error);
      navigate("/");
    } finally {
      setIsNavigating(false);
    }
  }, [meData.role, navigate, appointmentId, isNavigating]);
  if (isLoading || !appointment || !meData.role) {
    return (
      <div className="h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading call room...</p>
        </div>
      </div>
    );
  }
  // const currentUser = {
  //   id: user.id,
  //   name: user.name,
  //   role: role,
  // };
  console.log(currentUser);
  return (
    <Call
      appointmentId={appointmentId}
      appointment={appointment}
      currentUser={currentUser}
      onCallEnd={handleCallEnd}
      joinConsultation={joinAppointment}
    />
  );
};

export default AppointmentCall;
