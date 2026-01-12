import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import authRoutes from "./routes/auth.routes.js";
import connectDB from "./config/db.js";
import patientRoutes from "./routes/patient.routes.js";
import doctorRoutes from "./routes/doctor.routes.js";
import appointmentRoutes from "./routes/appointment.route.js";
import paymentRoutes from "./routes/payment.routes.js";

const app = express();
const PORT = process.env.PORT || 8000;
console.log("port", process.env.PORT);
console.log("KEY:", process.env.RAZORPAY_KEY_ID);
console.log("SECRET:", process.env.RAZORPAY_KEY_SECRET);
// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS,
    credentials: true,
  })
);

// routes
app.use("/api/auth", authRoutes);
app.use("/api/auth", patientRoutes);
app.use("/api/auth", doctorRoutes);
app.use("/api/auth", appointmentRoutes);
app.use("/api/auth", paymentRoutes);

// start server AFTER DB connection
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server");
    process.exit(1);
  }
};

startServer();
