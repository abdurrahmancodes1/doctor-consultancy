import express from "express";
import updatePatient from "../controllers/patient.controller.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
import requireRole from "../middleware/requireRole.js";

const router = express.Router();

router.put(
  "/patient/onboarding",

  isAuthenticated,
  requireRole("patient"),
  updatePatient
);

export default router;
