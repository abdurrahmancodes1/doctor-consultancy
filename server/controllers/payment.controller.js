import Appointment from "./../models/appointments.js";
import Razorpay from "razorpay";
import crypto from "crypto";

// lazy init (important for dotenv + ESM)
const getRazorpayInstance = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error("Razorpay keys not configured in environment");
  }

  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

const createOrder = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    const appointment = await Appointment.findById(appointmentId)
      .populate("doctorId", "name specialization")
      .populate("patientId", "name email phone");

    if (!appointment) {
      return res.status(401).json({
        success: false,
        message: "Appointment not found",
      });
    }

    if (appointment.patientId._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    if (appointment.paymentStatus === "Paid") {
      return res.status(402).json({
        success: false,
        message: "Payment already completed",
      });
    }

    const razorPay = getRazorpayInstance();

    const order = await razorPay.orders.create({
      amount: appointment.totalAmount * 100, // convert to paise
      currency: "INR",
      receipt: `appointment_${appointmentId}`,
      notes: {
        appointmentId,
        doctorName: appointment.doctorId.name,
        patientName: appointment.patientId.name,
        consultationType: appointment.consultationType,
        date: appointment.date,
        slotStart: appointment.slotStartIso,
        slotEnd: appointment.slotEndIso,
      },
    });
    return res.status(200).json({
      success: true,
      data: {
        orderId: order.id,
        amount: order.amount, // paise
        currency: order.currency,
        key: process.env.RAZORPAY_KEY_ID,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "creating order razor pay failed",
    });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const {
      appointmentId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const appointment = await Appointment.findById(appointmentId)
      .populate("doctorId", "name specialization")
      .populate("patientId", "name email phone");

    if (!appointment) {
      return res.status(401).json({
        success: false,
        message: "Appointment not found",
      });
    }

    if (appointment.patientId._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    // Update DB
    appointment.paymentStatus = "Paid";
    appointment.paymentMethod = "RazorPay";
    appointment.razorpayPaymentId = razorpay_payment_id;
    appointment.razorpayOrderId = razorpay_order_id;
    appointment.razorpaySignature = razorpay_signature;
    appointment.paymentDate = new Date();

    await appointment.save();

    await appointment.populate(
      "doctorId",
      "name specialization fees hospitalInfo profileImage"
    );

    await appointment.populate("patientId", "name email phone profileImage");

    return res.json({
      success: true,
      appointment,
      message: "Payment verified successfully",
    });
  } catch (error) {
    console.error("Verify payment");

    return res.status(500).json({
      success: false,
      message: "Payment verification failed",
    });
  }
};

export { createOrder, verifyPayment };
