import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const patientApi = createApi({
  reducerPath: "patientApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.process.env.VITE_REACT_APP_API_URL,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    updatePatientOnboarding: builder.mutation({
      query: (data) => ({
        url: "/patient/onboarding",
        method: "PUT",
        body: data,
      }),
    }),
  }),
});

export const { useUpdatePatientOnboardingMutation } = patientApi;
