import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";
import { authApi } from "../feature/api/authApi";
import { patientApi } from "@/feature/api/patientApi";
import { doctorApi } from "@/feature/api/doctorApi";
import { appointmentApi } from "@/feature/api/appointmentApi";
import { paymentApi } from "@/feature/api/paymentApi";

export const appStore = configureStore({
  reducer: rootReducer,
  middleware: (getDefault) =>
    getDefault().concat(
      authApi.middleware,
      patientApi.middleware,
      doctorApi.middleware,
      appointmentApi.middleware,
      paymentApi.middleware
    ),
});
