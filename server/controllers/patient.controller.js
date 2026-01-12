import express from "express";
import Patient from "../models/patient.js";
// import isAuthenticated from "../middleware/isAuthenticated.js";
import computeAgeFromDob from "../utils/date.js";
const updatePatient = async (req, res) => {
  try {
    // const updated = { ...req.body };

    // if (updated.dob) {
    //   updated.age = computeAgeFromDob(updated.dob);
    // }

    // delete updated.password;
    // updated.isVerified = true;

    // const patient = await Patient.findByIdAndUpdate(req.user.id, updated, {
    //   new: true,
    // }).select("-password -googleId");
    const patient = await Patient.findByIdAndUpdate(
      req.user.id,
      {
        $set: {
          ...req.body,
          isVerified: true,
          ...(req.body.dob && { age: computeAgeFromDob(req.body.dob) }),
        },
      },
      { new: true }
    ).select("-password -googleId");

    if (!patient) {
      return res.status(401).json({
        success: false,
        message: "Patient not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Patient Profile updated successfully",
      data: patient,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export default updatePatient;
