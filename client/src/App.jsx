import React from "react";
import { Button } from "./components/ui/button";
import { createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";
import { RouterProvider } from "react-router";
import AuthLayout from "./pages/AuthLayout";
import DoctorLogin from "./pages/auth/DoctorLogin";
import DoctorRegister from "./pages/auth/DoctorRegister";
import PatientLogin from "./pages/auth/PatientLogin";
import PatientRegister from "./pages/auth/PatientRegister";
// import DoctorOnBoarding from "./pages/onboarding/DoctorOnBoarding";
import OnBoardingGuard from "./pages/onboarding/OnBoardingGuard";
// import OnBoardingLayout from "./pages/layouts/OnBoardingLayout";
import PublicAuthGuard from "./components/PublicAuthGuard";
import AuthGaurd from "./components/AuthGuard";
// import PatientOnBoarding from "./pages/onboarding/PatientOnBoarding";
import PatientOnBoardingForm from "./components/PatientOnBoardingForm";
import Test from "./Test";
import DoctorOnBoardingForm from "./components/DoctorOnBoardingForm";
import HomeGuard from "./components/HomeGuard";
import DoctorDashboard from "./pages/dashboard/DoctorDashboard";
import DashboardAuthGuard from "./components/DashboardAuthGuard";
import PatientDashboard from "./pages/dashboard/PatientDashboard";
import RoleGuard from "./components/RoleGuard";
import { useGetMeQuery } from "./feature/api/authApi";
import DoctorList from "./pages/DoctorList";
import PatientBooking from "./pages/PatientBooking";
import DoctorAppointment from "./components/doctor/DoctorAppointment";
import Call from "./components/Call";
import AppointmentCall from "./pages/AppointmentCall";
import ProfilePage from "./pages/DoctorProfile";
// import { useLoadUserQuery } from "./feature/api/authApi";

const App = () => {
  // useLoadUserQuery(); // 🔑
  // const appRouter = createBrowserRouter([
  //   {
  //     path: "/",
  //     element: <HomePage />,
  //   },
  //   {
  //     element: (
  //       <PublicAuthGuard>
  //         <AuthLayout />
  //       </PublicAuthGuard>
  //     ),
  //     children: [
  //       {
  //         path: "/login/doctor",
  //         element: <DoctorLogin />,
  //       },
  //       {
  //         path: "/register/doctor",
  //         element: <DoctorRegister />,
  //       },
  //       {
  //         path: "/login/patient",
  //         element: <PatientLogin />,
  //       },
  //       {
  //         path: "/register/patient",
  //         element: <PatientRegister />,
  //       },
  //     ],
  //   },
  //   //   // {
  //   //   //   // path:""
  //   //   //   element: (
  //   //   //     <AuthGaurd>
  //   //   //       <OnBoardingLayout />
  //   //   //     </AuthGaurd>
  //   //   //   ),
  //   //   //   children: [
  //   //   //     {
  //   //   //       path: "/onboarding/:role",
  //   //   //       element: (
  //   //   //         <OnBoardingGuard>
  //   //   //           <DoctorOnBoarding />
  //   //   //         </OnBoardingGuard>
  //   //   //       ),
  //   //   //     },
  //   //   //     {
  //   //   //       path: "patient",
  //   //   //       element: (
  //   //   //         <OnBoardingGuard>
  //   //   //           <PatientOnBoardingForm />
  //   //   //         </OnBoardingGuard>
  //   //   //       ),
  //   //   //     },
  //   //   //   ],
  //   //   // },
  //   {
  //     element: (
  //       <AuthGaurd>
  //         <OnBoardingLayout />
  //       </AuthGaurd>
  //     ),
  //     children: [
  //       {
  //         path: "/onboarding/:role",
  //         element: <OnBoardingGuard />,
  //         children: [
  //           {
  //             path: "doctor",
  //             element: <DoctorOnBoarding />,
  //           },
  //           {
  //             path: "patient",
  //             element: <PatientOnBoardingForm />,
  //           },
  //         ],
  //       },
  //     ],
  //   },

  //   // {
  //   //   //
  //   //   // },
  // ]);
  const { isLoading } = useGetMeQuery();
  if (isLoading) return null;
  const appRouter = createBrowserRouter([
    /* ================= HOME ================= */
    {
      path: "/",
      element: (
        <HomeGuard>
          <HomePage />
        </HomeGuard>
      ),
    },

    /* ================= AUTH ================= */
    {
      element: (
        <PublicAuthGuard>
          <AuthLayout />
        </PublicAuthGuard>
      ),
      children: [
        { path: "login/doctor", element: <DoctorLogin /> },
        { path: "register/doctor", element: <DoctorRegister /> },
        { path: "login/patient", element: <PatientLogin /> },
        { path: "register/patient", element: <PatientRegister /> },
      ],
    },

    /* ================= ONBOARDING (DIRECT) ================= */

    {
      path: "/onboarding/doctor",
      element: (
        <OnBoardingGuard role="doctor">
          <DoctorOnBoardingForm />
        </OnBoardingGuard>
      ),
    },

    {
      path: "/onboarding/patient",
      element: (
        <OnBoardingGuard role="patient">
          <PatientOnBoardingForm />
        </OnBoardingGuard>
      ),
    },
    {
      path: "/dashboard/doctor",
      element: (
        <DashboardAuthGuard allowedRole="doctor">
          <DoctorDashboard />
        </DashboardAuthGuard>
      ),
    },
    {
      path: "/dashboard/patient",
      element: (
        <DashboardAuthGuard allowedrole="patient">
          <PatientDashboard />
        </DashboardAuthGuard>
      ),
    },
    {
      path: "/doctor-list",
      element: <DoctorList />,
    },
    {
      path: "/patient/booking/:id",
      element: <PatientBooking />,
    },
    {
      path: "/doctor/appointments",
      element: (
        <DashboardAuthGuard allowedRole="doctor">
          <DoctorAppointment />
        </DashboardAuthGuard>
      ),
    },
    {
      path: "/call/:appointmentId",
      element: <AppointmentCall />,
    },
    {
      path: "/profile",
      element: <ProfilePage />,
    },
  ]);

  return (
    <div>
      <RouterProvider router={appRouter} />
    </div>
  );
};

export default App;
