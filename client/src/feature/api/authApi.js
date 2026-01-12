import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_REACT_APP_API_URL,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    registerDoctor: builder.mutation({
      query: (data) => ({
        url: "doctor/register",
        method: "POST",
        body: data,
      }),
    }),

    loginDoctor: builder.mutation({
      query: (data) => ({
        url: "doctor/login",
        method: "POST",
        body: data,
      }),
    }),
    registerPatient: builder.mutation({
      query: (data) => ({
        url: "patient/register",
        method: "POST",
        body: data,
      }),
    }),
    loginPatient: builder.mutation({
      query: (data) => ({
        url: "patient/login",
        method: "POST",
        body: data,
      }),
    }),
    getMe: builder.query({
      query: () => "me",
    }),
  }),
});

export const {
  useRegisterDoctorMutation,
  useRegisterPatientMutation,
  useLoginDoctorMutation,
  useLoginPatientMutation,
  useGetMeQuery,
} = authApi;
