import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const doctorApi = createApi({
  reducerPath: "doctorApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_REACT_APP_API_URL,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    updateDoctorOnboarding: builder.mutation({
      query: (data) => ({
        url: "/doctor/onboarding",
        method: "PUT",
        body: data,
      }),
    }),
    listDoctors: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        Object.entries(params).forEach(([Key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            queryParams.append(Key, value.toString());
          }
        });
        return `doctor/list?${queryParams.toString()}`;
      },
    }),
    getDoctorById: builder.query({
      query: (doctorId) => `/doctor/${doctorId}`,
      providesTags: ["Doctor"],
    }),
    getDoctorDashboard: builder.query({
      query: () => `/doctor/dashboard`,
    }),
  }),
});

export const {
  useUpdateDoctorOnboardingMutation,
  useListDoctorsQuery,
  useGetDoctorByIdQuery,
  useGetDoctorDashboardQuery,
} = doctorApi;
