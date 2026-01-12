import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const paymentApi = createApi({
  reducerPath: "paymentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_REACT_APP_API_URL,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (body) => ({
        url: "/payment/create-order",
        method: "POST",
        body,
      }),
    }),
    verifyPayemnt: builder.mutation({
      query: (body) => ({
        url: "/payment/verify",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useCreateOrderMutation, useVerifyPayemntMutation } = paymentApi;
