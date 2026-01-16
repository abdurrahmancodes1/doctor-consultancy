import Appointment from "../models/appointments.js";

export const getdoctorAppointment = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {
      doctorId: req.user.id,
    };
    if (status !== undefined) {
      let statusArray;
      if (Array.isArray(status)) {
        statusArray = status;
      } else if (typeof status === "string") {
        statusArray = [status];
      } else {
        return res.status(400).json({
          success: false,
          message: "Status must be a string or an array fof strings",
        });
      }
      const invalid = statusArray.some((s) => typeof s !== "string");
      if (invalid) {
        return res.status(400).json({
          success: false,
          message: "Each status must be a string",
        });
      }
      filter.status = { $in: statusArray };
    }
    const appointments = await Appointment.find(filter)
      .populate("patientId", "name email phone dob age profileImage")
      .populate(
        "doctorId",
        "name fees phone specialization profileImage hospitalInfo"
      )
      .sort({ slotStartIso: 1, slotEndIso: 1 });
    console.log(filter);
    return res.status(200).json({
      success: true,
      message: "Appointment fetched successfully",
      appointments,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Appointment fetched failed",
      // appointments,
    });
  }
};

export const getpatientAppointment = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {
      patientId: req.user.id,
    };
    if (status !== undefined) {
      let statusArray;
      if (Array.isArray(status)) {
        statusArray = status;
      } else if (typeof status === "string") {
        statusArray = [status];
      } else {
        return res.status(400).json({
          success: false,
          message: "Status must be a string or an array of strings",
        });
      }
      const invalid = statusArray.some((s) => typeof s !== "string");
      if (invalid) {
        return res.status(400).json({
          success: false,
          message: "Each status must be a string",
        });
      }
      filter.status = { $in: statusArray };
    }
    const appointments = await Appointment.find(filter)
      .populate(
        "doctorId",
        "name fees phone specialization profileImage hospitalInfo"
      )
      .populate("patientId", "name email phone dob age profileImage")

      .sort({ slotStartIso: 1, slotEndIso: 1 });
    console.log(filter);
    return res.status(200).json({
      success: true,
      message: "Appointment fetched successfully",
      appointments,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Appointment fetched failed",
      // appointments,
    });
  }
};

export const getBookedDoctorSlotDate = async (req, res) => {
  try {
    const { doctorId, date } = req.params;
    const startDay = new Date(date);
    startDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    const bookedAppointment = await Appointment.find({
      doctorId,
      slotStartIso: { $gte: startDay, $lte: endOfDay },
      status: { $ne: "Cancelled" },
    }).select("slotStartIso");
    const bookSlot = bookedAppointment.map((apt) => apt.slotStartIso);
    return res.status(200).json({
      success: true,
      message: "",
      bookSlot,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get booked slot date",
    });
  }
};

export const bookAppointment = async (req, res) => {
  try {
    const {
      doctorId,
      slotStartIso,
      slotEndIso,
      date,
      consultationType,
      symptoms,
      consultationFees,
      platformFees,
      totalAmount,
    } = req.body;

    if (!doctorId || !doctorId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Validate doctorId is required",
      });
    }
    if (!slotStartIso || isNaN(Date.parse(slotStartIso))) {
      return res.status(400).json({
        success: false,
        message: "Valid slotStartIso is required",
      });
    }
    if (!slotEndIso || isNaN(Date.parse(slotEndIso))) {
      return res.status(400).json({
        success: false,
        message: "Valid slotEndIso is required",
      });
    }
    if (!["Video Consultation", "Voice Call"].includes(consultationType)) {
      return res.status(400).json({
        success: false,
        message: "Valid consulation type is required",
      });
    }
    if (!symptoms || typeof symptoms !== "string") {
      return res.status(400).json({
        success: false,
        message: "Symptoms description is required",
      });
    }
    if (!consultationFees || !platformFees || !totalAmount) {
      return res.status(400).json({
        success: false,
        message: "Fee fields are required",
      });
    }

    const conflictingAppointment = await Appointment.findOne({
      doctorId,
      status: { $in: ["Scheduled", "In Progress"] },
      slotStartIso: { $lt: new Date(slotEndIso) },
      slotEndIso: { $gt: new Date(slotStartIso) },
    });
    if (conflictingAppointment) {
      return res.status(409).json({
        success: false,
        message: "This time slot is already booked",
      });
    }
    const zegoRoomId = `room_${Date.now()}_${Math.random()
      .toString(36)
      .substring(2, 9)}`;

    const appointment = new Appointment({
      doctorId,
      patientId: req.user.id,
      date: new Date(date),
      slotStartIso: new Date(slotStartIso),
      slotEndIso: new Date(slotEndIso),
      consultationType,
      symptoms,
      zegoRoomId,
      status: "Scheduled",
      consultationFees,
      platformFees,
      totalAmount,
      paymentStatus: "Pending",
      payoutStatus: "Pending",
    });
    await appointment.save();
    await appointment.populate(
      "doctorId",
      "name fees phone specialization hospitalInfo profileImage"
    );
    await appointment.populate("patientId", "name email");
    return res.status(200).json({
      success: true,
      message: "Appoinment Created Successfully",
      appointment,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "booking appointment failed",
    });
  }
};
export const getSingleAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate("patientId", "name email phone dob age profileImage")
      .populate(
        "doctorId",
        "name fees phone specialization hospitalInfo profileImage"
      );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    const { role, id } = req.user;

    // Doctor access check
    if (role === "doctor" && appointment.doctorId._id.toString() !== id) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    // Patient access check
    if (role === "patient" && appointment.patientId._id.toString() !== id) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Appointment fetched successfully",
      appointment,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch appointment",
    });
  }
};

export const join = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate("patientId", "name")
      .populate("doctorId", "name");

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    const { role, id } = req.user;

    // Ownership check
    if (
      (role === "doctor" && appointment.doctorId._id.toString() !== id) ||
      (role === "patient" && appointment.patientId._id.toString() !== id)
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    // Status validation
    if (appointment.status !== "Scheduled") {
      return res.status(400).json({
        success: false,
        message: "Appointment cannot be joined",
      });
    }

    appointment.status = "In Progress";
    appointment.updatedAt = new Date();
    await appointment.save();

    return res.status(200).json({
      success: true,
      message: "Joined successfully",
      roomId: appointment.zegoRoomId,
      appointment,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to join appointment",
    });
  }
};

export const end = async (req, res) => {
  try {
    const { prescription, notes } = req.body;
    const { role, id } = req.user;

    if (role !== "doctor") {
      return res.status(403).json({
        success: false,
        message: "Only doctor can end appointment",
      });
    }

    const appointment = await Appointment.findById(req.params.id).populate(
      "patientId doctorId"
    );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    if (appointment.doctorId._id.toString() !== id) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    appointment.status = "Completed";
    appointment.prescription = prescription;
    appointment.notes = notes;
    appointment.updatedAt = new Date();

    await appointment.save();

    return res.status(200).json({
      success: true,
      message: "Appointment completed successfully",
      appointment,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to end appointment",
    });
  }
};

export const updateAppointmentByDoctor = async (req, res) => {
  try {
    const { status } = req.body;
    const { id, role } = req.user;

    if (role !== "doctor") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const appointment = await Appointment.findById(req.params.id).populate(
      "patientId doctorId"
    );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    if (appointment.doctorId._id.toString() !== id) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    appointment.status = status;
    appointment.updatedAt = new Date();
    await appointment.save();

    return res.status(200).json({
      success: true,
      message: "Appointment updated successfully",
      appointment,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update appointment",
    });
  }
};
