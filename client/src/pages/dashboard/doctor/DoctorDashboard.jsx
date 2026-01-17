import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import Header from "../../landing/Header";
import PrescriptionModal from "../../../components/doctor/PrescriptionModel";

import { useGetMeQuery } from "@/feature/api/authApi";
import {
  useEndAppointmentMutation,
  useGetSingleAppointmentByIdQuery,
} from "@/feature/api/appointmentApi";
import { useGetDoctorDashboardQuery } from "@/feature/api/doctorApi";

import {
  Activity,
  Calendar as CalendarIcon,
  Clock,
  DollarSign,
  TrendingUp,
  Users,
  Video,
  Star,
  Plus,
} from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../components/ui/avatar";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "../../../components/ui/card";

import { getStatusColor } from "../../../../utils/constant";
import Loader from "@/components/common/Loader";

const DoctorDashboard = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const completedCallId = searchParams.get("completedCall");

  const { data: rawDashboard, isLoading } = useGetDoctorDashboardQuery();

  const { data: currentAppointment, refetch } =
    useGetSingleAppointmentByIdQuery(completedCallId, {
      skip: !completedCallId,
    });

  const [endAppointment, { isLoading: modalLoading }] =
    useEndAppointmentMutation();

  const [showPrescriptionModal, setShowPrescriptionModal] =
    useState(!!completedCallId);
  const [completingAppointmentId, setCompletingAppointmentId] = useState(
    completedCallId || null,
  );

  useEffect(() => {
    if (completedCallId) {
      setShowPrescriptionModal(true);
      setCompletingAppointmentId(completedCallId);
      refetch();
    }
  }, [completedCallId, refetch]);

  const handleSavePrescription = async (prescription, notes) => {
    if (!completingAppointmentId) return;

    try {
      await endAppointment({
        id: completingAppointmentId,
        prescription,
        notes,
      }).unwrap();

      setShowPrescriptionModal(false);
      setCompletingAppointmentId(null);

      const noQuery = location.pathname;
      window.history.replaceState({}, "", noQuery);
    } catch (err) {
      console.error("Failed to complete consultation:", err);
    }
  };

  const handleCloseModal = () => {
    setShowPrescriptionModal(false);
    setCompletingAppointmentId(null);
    const noQuery = location.pathname;
    window.history.replaceState({}, "", noQuery);
  };

  const formatDate = (iso) => {
    return new Date(iso).toLocaleString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      month: "short",
      day: "numeric",
    });
  };

  const canJoinCall = (appointment) => {
    const now = new Date();
    const start = new Date(appointment.slotStartIso);
    const diffMin = (start - now) / (1000 * 60);

    return (
      diffMin <= 15 &&
      diffMin >= -120 &&
      (appointment.status === "Scheduled" ||
        appointment.status === "In Progress")
    );
  };

  if (isLoading || !rawDashboard) {
    return (
      <>
        <Header showDashboardNav={true} />
        <div>
          <Loader />
        </div>
      </>
    );
  }

  const dd = rawDashboard.dashboardData || {};
  const stats = dd.stats || {};
  const performance = dd.performance || {};
  const todayAppointments = dd.todayAppointments || [];
  const upcomingAppointments = dd.upcomingAppointments || [];
  const user = dd.user || {};

  // FANCY STATS CARDS
  const statsCards = [
    {
      title: "Total Patients",
      value: stats.totalPatients?.toString() || "0",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      change: "+12%",
      changeColor: "text-green-600",
    },
    {
      title: "Today's Appointments",
      value: stats.todayAppointments?.toString() || "0",
      icon: CalendarIcon,
      color: "text-green-600",
      bgColor: "bg-green-50",
      change: "+8%",
      changeColor: "text-green-600",
    },
    {
      title: "Total Revenue",
      value: `₹${stats.totalRevenue?.toLocaleString() || "0"}`,
      icon: DollarSign,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      change: "+25%",
      changeColor: "text-green-600",
    },
    {
      title: "Completed",
      value: stats.completedAppointments?.toString() || "0",
      icon: Activity,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      change: "+18%",
      changeColor: "text-green-600",
    },
  ];

  return (
    <>
      <Header showDashboardNav={true} />

      <div className="min-h-screen pt-16 p-6">
        {/* USER HEADER */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16 ring-4 ring-blue-100">
              <AvatarImage src={user?.profileImage} />
              <AvatarFallback>
                {user?.name?.charAt(0)?.toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div>
              <h1 className="text-2xl font-bold">Good evening, {user?.name}</h1>
              <p className="text-gray-600">{user?.specialization}</p>
            </div>
          </div>

          <Link to="/doctor/profile">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Update Availability
            </Button>
          </Link>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                    <div className="flex items-center mt-2">
                      <TrendingUp className="w-3 h-3 text-green-600 mr-1" />
                      <span
                        className={`text-sm font-medium ${stat.changeColor}`}
                      >
                        {stat.change} from last year
                      </span>
                    </div>
                  </div>
                  <div
                    className={`w-14 h-14 ${stat.bgColor} rounded-xl flex items-center justify-center`}
                  >
                    <stat.icon className={`w-7 h-7 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* PERFORMANCE */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <MetricRow
              label="Patient Satisfaction"
              value={
                <>
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1 inline" />
                  {performance.patientSatisfaction || 0} / 5
                </>
              }
            />
            <MetricRow
              label="Completion Rate"
              value={
                <span className="text-green-600">
                  {performance.completionRate || 0}%
                </span>
              }
            />
            <MetricRow
              label="Response Time"
              value={
                <span className="text-blue-600">
                  {performance.responseTime || "-"}
                </span>
              }
            />
          </CardContent>
        </Card>

        {/* SCHEDULE */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-blue-500" />
                Today's Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {todayAppointments.length > 0 ? (
                todayAppointments.map((a) => (
                  <div
                    key={a._id}
                    className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex-1">
                      <div className="font-semibold">{a.patientId.name}</div>
                      <div className="text-sm text-gray-500">
                        {formatDate(a.slotStartIso)}
                      </div>
                      <Badge className={getStatusColor(a.status)}>
                        {a.status}
                      </Badge>
                    </div>

                    {canJoinCall(a) && (
                      <Link to={`/call/${a._id}`}>
                        <Button size="sm" className="bg-green-600">
                          <Video className="w-4 h-4 mr-2" />
                          Start
                        </Button>
                      </Link>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-12">No appointments today</div>
              )}
            </CardContent>
          </Card>

          {/* UPCOMING */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-500" />
                Upcoming
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingAppointments.length > 0 ? (
                upcomingAppointments.map((a) => (
                  <div
                    key={a._id}
                    className="flex items-center gap-3 border p-3 rounded-lg"
                  >
                    <Avatar className="w-10 h-10">
                      <AvatarFallback>
                        {a.patientId.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-medium">{a.patientId.name}</div>
                      <div className="text-sm text-gray-500">
                        {formatDate(a.slotStartIso)}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div>No upcoming appointments</div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <PrescriptionModal
        isOpen={showPrescriptionModal}
        onClose={handleCloseModal}
        onSave={handleSavePrescription}
        patientName={currentAppointment?.patientId?.name}
        loading={modalLoading}
      />
    </>
  );
};

const MetricRow = ({ label, value }) => (
  <div className="flex items-center justify-between">
    <span className="text-sm text-gray-600">{label}</span>
    <span className="font-medium">{value}</span>
  </div>
);

export default DoctorDashboard;
