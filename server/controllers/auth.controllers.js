import Doctor from "../models/doctor.js";
import Patient from "../models/patient.js";
import bcryptjs from "bcryptjs";
import { signToken } from "../utils/token.js";

const registerDoctor = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const isExist = await Doctor.findOne({ email });
    if (isExist) {
      return res.status(409).json({
        success: false,
        message: "Doctor already exists",
      });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const doctor = await Doctor.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = signToken({
      id: doctor._id,
      role: "doctor",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true, // prod me true
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      success: true,
      message: "Doctor registered successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const doctor = await Doctor.findOne({ email });
    if (!doctor) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcryptjs.compare(password, doctor.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = signToken({
      id: doctor._id,
      role: "doctor",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true, // prod me true
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Doctor logged in successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
const registerPatient = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const isExist = await Patient.findOne({ email });
    if (isExist) {
      return res.status(409).json({
        success: false,
        message: "Patient already exists",
      });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const patient = await Patient.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = signToken({
      id: patient._id,
      role: "patient",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true, // prod me true
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      success: true,
      message: "Patient registered successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `${error.message}`,
    });
  }
};

const loginPatient = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const patient = await Patient.findOne({ email });
    if (!patient) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcryptjs.compare(password, patient.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = signToken({
      id: patient._id,
      role: "patient",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true, // prod me true
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Patient logged in successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `${error.message}`,
    });
  }
};

const me = async (req, res) => {
  try {
    let user;
    if (req.user.role === "doctor") {
      user = await Doctor.findById(req.user.id).select("-password");
      return res.status(200).json({
        success: true,
        user,
        role: "doctor",
      });
    } else {
      user = await Patient.findById(req.user.id).select("-password");
    }
    return res.status(200).json({
      success: true,
      user,
      role: "patient",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user",
    });
  }
};
export { registerDoctor, loginDoctor, registerPatient, loginPatient, me };
