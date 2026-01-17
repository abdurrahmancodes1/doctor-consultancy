import React from "react";
// import { Button } from "./components/ui/button";
import { createBrowserRouter } from "react-router-dom";
// import HomePage from "./pages/HomePage";
import { RouterProvider } from "react-router";
// import AuthLayout from "./pages/AuthLayout";
// import DoctorLogin from "./pages/auth/DoctorLogin";
// import DoctorRegister from "./pages/auth/DoctorRegister";
// import PatientLogin from "./pages/auth/PatientLogin";
// import PatientRegister from "./pages/auth/PatientRegister";
// import DoctorOnBoarding from "./pages/onboarding/DoctorOnBoarding";
// import OnBoardingGuard from "./guards/OnBoardingGuard";
// import OnBoardingLayout from "./pages/layouts/OnBoardingLayout";
// import PublicAuthGuard from "./guards/PublicAuthGuard";
import AuthGaurd from "./guards/AuthGuard";
import { useGetMeQuery } from "./feature/api/authApi";
import HomeGuard from "./guards/HomeGuard";
import HomePage from "./pages/HomePage";
import PublicAuthGuard from "./guards/PublicAuthGuard";
import AuthLayout from "./pages/layouts/AuthLayout";
// import AuthLayout from "./pages/layouts/AuthLayout";
import DoctorLogin from "./pages/auth/DoctorLogin";
import DoctorRegister from "./pages/auth/DoctorRegister";
import PatientLogin from "./pages/auth/PatientLogin";
import PatientRegister from "./pages/auth/PatientRegister";
import OnBoardingGuard from "./guards/OnBoardingGuard";
import DoctorOnBoardingForm from "./pages/onboarding/DoctorOnBoardingForm";
import PatientOnBoardingForm from "./pages/onboarding/PatientOnBoardingForm";
import DoctorDashboard from "./pages/dashboard/doctor/DoctorDashboard";
import DashboardAuthGuard from "./guards/DashboardAuthGuard";
import PatientDashboard from "./pages/dashboard/patient/PatientDashboard";
import DoctorList from "./pages/DoctorList";
import PatientBooking from "./pages/dashboard/patient/PatientBooking";
import DoctorAppointment from "./components/doctor/DoctorAppointment";
import AppointmentCall from "./pages/appointment/AppointmentCall";
import ProfileLayout from "./pages/layouts/ProfileLayout";
import Loader from "./components/common/Loader";
// // import PatientOnBoarding from "./pages/onboarding/PatientOnBoarding";
// import PatientOnBoardingForm from "./pages/onboarding/PatientOnBoardingForm";
// import DoctorOnBoardingForm from "./pages/onboarding/DoctorOnBoardingForm";
// import HomeGuard from "./guards/HomeGuard";
// import DoctorDashboard from "./pages/dashboard/doctor/DoctorDashboard";
// import DashboardAuthGuard from "./guards/DashboardAuthGuard";
// import PatientDashboard from "./pages/dashboard/patient/PatientDashboard";
// import RoleGuard from "./guards/RoleGuard";
// import { useGetMeQuery } from "./feature/api/authApi";
// import DoctorList from "./pages/DoctorList";
// import PatientBooking from "./pages/dashboard/patient/PatientBooking";
// import DoctorAppointment from "./components/doctor/DoctorAppointment";
// import Call from "./components/Call";
// import AppointmentCall from "./pages/appointment/AppointmentCall";
// import ProfilePage from "./pages/DoctorProfile";
// import ProfileLayout from "./pages/layouts/ProfileLayout";
// // import { useLoadUserQuery } from "./feature/api/authApi";

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
  if (isLoading) return <Loader />;
  const appRouter = createBrowserRouter([
    /* ================= HOME ================= */
    {
      path: "/",
      element: (
        <HomeGuard notAllowed="doctor">
          <HomePage />
        </HomeGuard>
      ),
    },

    /* ================= AUTH ================= */
    {
      element: <AuthLayout />,
      children: [
        {
          path: "login/doctor",
          element: (
            <PublicAuthGuard>
              <DoctorLogin />
            </PublicAuthGuard>
          ),
        },
        {
          path: "register/doctor",
          element: (
            <PublicAuthGuard>
              <DoctorRegister />
            </PublicAuthGuard>
          ),
        },
        {
          path: "login/patient",
          element: (
            <PublicAuthGuard>
              <PatientLogin />
            </PublicAuthGuard>
          ),
        },
        {
          path: "register/patient",
          element: (
            <PublicAuthGuard>
              <PatientRegister />
            </PublicAuthGuard>
          ),
        },
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
        <DashboardAuthGuard allowedRole="patient">
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
      element: (
        <DashboardAuthGuard allowedRole="patient">
          <PatientBooking />
        </DashboardAuthGuard>
      ),
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
      path: "/profile/doctor",
      element: (
        <DashboardAuthGuard allowedRole="doctor">
          <ProfileLayout />
        </DashboardAuthGuard>
      ),
    },
    {
      path: "/profile/patient",
      element: (
        <DashboardAuthGuard allowedRole="patient">
          <ProfileLayout />
        </DashboardAuthGuard>
      ),
    },
  ]);

  return (
    <div>
      <RouterProvider router={appRouter} />
    </div>
  );
};

export default App;
