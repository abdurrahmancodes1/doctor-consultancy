import express from "express";
import requireRole from "../middleware/requireRole.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
import {
  bookAppointment,
  end,
  getBookedDoctorSlotDate,
  getdoctorAppointment,
  getpatientAppointment,
  getSingleAppointmentById,
  join,
  updateAppointmentByDoctor,
} from "../controllers/appointment.controller.js";

const router = express.Router();

// STATIC / COLLECTION ROUTES
router.post("/book", isAuthenticated, requireRole("patient"), bookAppointment);

router.get(
  "/doctor",
  isAuthenticated,
  requireRole("doctor"),
  getdoctorAppointment
);

router.get(
  "/doctor/:doctorId/slots/:date",
  isAuthenticated,
  getBookedDoctorSlotDate
);

router.get(
  "/patient",
  isAuthenticated,
  requireRole("patient"),
  getpatientAppointment
);

// DYNAMIC RESOURCE ROUTES (PREFIXED to avoid collision)
router.get("/appointment/:id", isAuthenticated, getSingleAppointmentById);

router.post("/appointment/:id/join", isAuthenticated, join);

router.post("/appointment/:id/end", isAuthenticated, end);

router.patch("/appointment/:id", isAuthenticated, updateAppointmentByDoctor);

export default router;
