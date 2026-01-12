// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// export const appointmentApi = createApi({
//   reducerPath: "appointmentApi",
//   baseQuery: fetchBaseQuery({
//     baseUrl: "http://localhost:4000/api/auth",
//     credentials: "include",
//   }),
//   tagTypes: ["Appointment"],
//   endpoints: (builder) => ({
//     getDoctorAppointments: builder.query({
//       query: () => "/doctor",
//       providesTags: ["Appointment"],
//     }),
//     getPatientAppointments: builder.query({
//       query: () => "/patient",
//       providesTags: ["Appointment"],
//     }),
//     getBookedDoctorSlotsByDate: builder.query({
//       query: ({ doctorId, date }) => `/doctor/${doctorId}/slots/${date}`,
//     }),
//     bookAppointment: builder.mutation({
//       query: (data) => ({
//         url: "/book",
//         method: "POST",
//         body: data,
//       }),
//       invalidatesTags: ["Appointment"],
//     }),
//     getSingleAppointmentById: builder.query({
//       query: (id) => `/appointment/${id}`,
//     }),
//     joinAppointment: builder.mutation({
//       query: (id) => ({
//         url: `/appointment/${id}/join`,
//         method: "POST",
//       }),
//       invalidatesTags: ["Appointment"],
//     }),
//     endAppointment: builder.mutation({
//       query: ({ id, prescription, notes }) => ({
//         url: `/appointment/${id}/end`,
//         method: "POST",
//         body: { prescription, notes },
//       }),
//       invalidatesTags: ["Appointment"],
//     }),
//     updateAppointmentByDoctor: builder.mutation({
//       query: ({ id, status }) => ({
//         url: `/appointment/${id}`,
//         method: "PATCH",
//         body: { status },
//       }),

//       invalidatesTags: ["Appointment"],
//     }),
//   }),
// });

// export const {
//   useGetDoctorAppointmentsQuery,
//   useGetPatientAppointmentsQuery,
//   useGetBookedDoctorSlotsByDateQuery,
//   useBookAppointmentMutation,
//   useGetSingleAppointmientByIdQuery,
//   useJoinAppointmentMutation,
//   useEndAppointmentMutation,
//   useUpdateAppointmentByDoctorMutation,
// } = appointmentApi;
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const appointmentApi = createApi({
  reducerPath: "appointmentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.process.env.VITE_REACT_APP_API_URL,
    credentials: "include",
  }),
  tagTypes: ["Appointment", "AppointmentSingle", "BookedSlots"],
  endpoints: (builder) => ({
    getAppointments: builder.query({
      query: ({ role, tab, filters }) => {
        const endpoint = role === "doctor" ? "/doctor" : "/patient";

        const params = new URLSearchParams();

        if (tab === "upcoming") {
          params.append("status", "Scheduled");
          params.append("status", "In Progress");
        } else if (tab === "past") {
          params.append("status", "Completed");
          params.append("status", "Cancelled");
        }

        Object.entries(filters || {}).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            value.forEach((v) => params.append(key, v));
          } else if (value !== undefined && value !== null && value !== "") {
            params.append(key, value);
          }
        });

        return `${endpoint}?${params.toString()}`;
      },
      providesTags: ["Appointment"],
    }),

    getBookedSlots: builder.query({
      query: ({ doctorId, date }) => `/doctor/${doctorId}/slots/${date}`,
      providesTags: ["BookedSlots"],
    }),

    getSingleAppointmentById: builder.query({
      query: (id) => `/appointment/${id}`,
      providesTags: (id) => [{ type: "AppointmentSingle", id }],
    }),

    bookAppointment: builder.mutation({
      query: (data) => ({
        url: "/book",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Appointment", "BookedSlots"],
    }),

    joinAppointment: builder.mutation({
      query: (id) => ({
        url: `/appointment/${id}/join`,
        method: "POST",
      }),
      invalidatesTags: ["Appointment", "AppointmentSingle"],
    }),

    endAppointment: builder.mutation({
      query: ({ id, prescription, notes }) => ({
        url: `/appointment/${id}/end`,
        method: "POST",
        body: { prescription, notes },
      }),
      invalidatesTags: ["Appointment", "AppointmentSingle"],
    }),

    updateAppointmentByDoctor: builder.mutation({
      query: ({ id, status }) => ({
        url: `/appointment/${id}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Appointment", "AppointmentSingle"],
    }),
  }),
});

export const {
  useGetAppointmentsQuery,
  useGetBookedSlotsQuery,
  useGetSingleAppointmentByIdQuery,
  useBookAppointmentMutation,
  useJoinAppointmentMutation,
  useEndAppointmentMutation,
  useUpdateAppointmentByDoctorMutation,
} = appointmentApi;
