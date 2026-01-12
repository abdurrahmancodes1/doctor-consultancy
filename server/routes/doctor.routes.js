import express from "express";
import {
  updateDoctor,
  listDoctors,
  doctorById,
  doctorDashboard,
} from "../controllers/doctor.controller.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
import requireRole from "../middleware/requireRole.js";

const router = express.Router();

router.put(
  "/doctor/onboarding",
  isAuthenticated,
  requireRole("doctor"),

  updateDoctor
);
router.get("/doctor/list", listDoctors);
router.get("/doctor/dashboard", isAuthenticated, doctorDashboard);
router.get("/doctor/:doctorId", isAuthenticated, doctorById);
export default router;
