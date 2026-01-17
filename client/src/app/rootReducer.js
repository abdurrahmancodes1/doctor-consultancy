import { combineReducers } from "@reduxjs/toolkit";
// import authReducer from "../feature/authSlice";
// import patientReducer from "./patientSlice";
import { authApi } from "../feature/api/authApi";
import { patientApi } from "@/feature/api/patientApi";
import { doctorApi } from "@/feature/api/doctorApi";
import { appointmentApi } from "@/feature/api/appointmentApi";
// import { courseApi } from "../feature/api/";

const rootReducer = combineReducers({
  [authApi.reducerPath]: authApi.reducer,
  [patientApi.reducerPath]: patientApi.reducer,
  [doctorApi.reducerPath]: doctorApi.reducer,
  [appointmentApi.reducerPath]: appointmentApi.reducer,
  [patientApi.reducerPath]: patientApi.reducer,
  // auth: authReducer,
  // patient: patientReducer,
});
export default rootReducer;
