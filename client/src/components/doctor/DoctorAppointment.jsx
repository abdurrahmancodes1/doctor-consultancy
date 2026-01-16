import AppointmentCard from "@/components/AppointmentCard";
import EmptyState from "@/components/EmptyState";

import React, { useState } from "react";
import Header from "../../pages/landing/Header";
import { useGetMeQuery } from "@/feature/api/authApi";
import {
  useGetAppointmentsQuery,
  useUpdateAppointmentByDoctorMutation,
} from "@/feature/api/appointmentApi";

import { Calendar, Clock, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import DoctorAppointmentCard from "./DoctorAppointmentCard";

const DoctorAppointment = () => {
  const [activeTab, setActiveTab] = useState("upcoming");

  const { data: userMe, isLoading: meLoading } = useGetMeQuery();
  const role = userMe?.role;

  // Dual Queries
  const {
    data: upcomingData,
    isLoading: upcomingLoading,
    isFetching: upcomingFetching,
  } = useGetAppointmentsQuery({ role, tab: "upcoming" }, { skip: !role });

  const {
    data: pastData,
    isLoading: pastLoading,
    isFetching: pastFetching,
  } = useGetAppointmentsQuery({ role, tab: "past" }, { skip: !role });

  const now = new Date();

  // Raw lists from backend
  const rawUpcoming = upcomingData?.appointments ?? [];
  const rawPast = pastData?.appointments ?? [];

  // Hybrid Logic: Move expired "Scheduled" from upcoming → past
  // const expiredFromUpcoming = rawUpcoming.filter(
  //   (apt) => new Date(apt.slotEndIso ?? apt.slotStartIso) < now
  // );
  const expiredFromUpcoming = rawUpcoming
    .filter((apt) => new Date(apt.slotEndIso ?? apt.slotStartIso) < now)
    .map((apt) => ({
      ...apt,
      status: "Expired",
      expired: true,
    }));

  const validUpcoming = rawUpcoming.filter(
    (apt) => new Date(apt.slotEndIso ?? apt.slotStartIso) >= now
  );

  // Final hybrid buckets
  const upcoming = validUpcoming;
  const past = [...rawPast, ...expiredFromUpcoming];

  // UI list based on active tab
  const list = activeTab === "upcoming" ? upcoming : past;

  // Updated tab counts with hybrid logic
  const tabCounts = {
    upcoming: upcoming.length,
    past: past.length,
  };

  // Loading for active tab only
  const loading =
    activeTab === "upcoming"
      ? upcomingLoading || upcomingFetching
      : pastLoading || pastFetching;
  const [updateAppointmentByDoctor] = useUpdateAppointmentByDoctorMutation();
  const isToday = (dateString) =>
    new Date(dateString).toDateString() === new Date().toDateString();

  const canJoinCall = (appointment) => {
    const d = new Date(appointment.slotStartIso);
    const diff = (d.getTime() - now.getTime()) / (1000 * 60);
    return isToday(appointment.slotStartIso) && diff <= 15 && diff >= -120;
  };
  const canMarkCancelled = (appointment) => {
    const appointmentTime = new Date(appointment.slotStartIso);
    return appointment.status === "Scheduled" && now < appointmentTime;
  };

  const handleMarkCancelled = async (appointmentId) => {
    if (confirm("Are u sure to mark this appointment as cancelled")) {
      try {
        await updateAppointmentByDoctor({
          id: appointmentId,
          status: "Cancelled",
        });
        setActiveTab("past");
      } catch (error) {
        console.log("error");
      }
    }
  };
  const formatDate = (dateString) =>
    new Date(dateString).toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  if (meLoading) return <Loader2 className="animate-spin" />;

  return (
    <>
      <Header showDashboardNav />
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                My Appointments
              </h1>
              <p className="text-gray-600">
                Manage your healthcare appointments
              </p>
            </div>
            <Link to="/doctor-list">
              <Button>
                <Calendar className="w-4 h-4 mr-2" />
                Book
              </Button>
            </Link>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="upcoming">
                <Clock className="w-4 h-4 mr-2" />
                Upcoming ({tabCounts.upcoming})
              </TabsTrigger>
              <TabsTrigger value="past">
                <Calendar className="w-4 h-4 mr-2" />
                Past ({tabCounts.past})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming">
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : list.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {list.map((appointment) => (
                    <DoctorAppointmentCard
                      canMarkCancelled={canMarkCancelled}
                      handleMarkCancelled={handleMarkCancelled}
                      key={appointment._id}
                      appointment={appointment}
                      isToday={isToday}
                      canJoinCall={canJoinCall}
                      formatDate={formatDate}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState tab="upcoming" />
              )}
            </TabsContent>

            <TabsContent value="past">
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : list.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {list.map((appointment) => (
                    <DoctorAppointmentCard
                      key={appointment._id}
                      appointment={appointment}
                      isToday={isToday}
                      canJoinCall={canJoinCall}
                      formatDate={formatDate}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState tab="past" />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default DoctorAppointment;
