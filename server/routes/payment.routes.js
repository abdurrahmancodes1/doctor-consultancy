import express from "express";
// import {  } from "../middleware/auth.js"; // if you restrict to logged in users
import {
  createOrder,
  verifyPayment,
} from "../controllers/payment.controller.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
const router = express.Router();

// Create Payment Order (Razorpay order)
router.post("/payment/create-order", isAuthenticated, createOrder);

// Verify Payment after success
router.post("/payment/verify", isAuthenticated, verifyPayment);

export default router;
