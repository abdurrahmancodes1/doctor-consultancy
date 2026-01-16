import express from "express";

import {
  registerDoctor,
  loginDoctor,
  registerPatient,
  loginPatient,
  me,
  logout,
} from "../controllers/auth.controllers.js";
import isAuthenticated from "../middleware/isAuthenticated.js";

const router = express.Router();

// doctor auth
router.post("/doctor/register", registerDoctor);
router.post("/doctor/login", loginDoctor);

// patient auth
router.post("/patient/register", registerPatient);
router.post("/patient/login", loginPatient);
router.post("/logout", logout);

router.get("/me", isAuthenticated, me);
export default router;
