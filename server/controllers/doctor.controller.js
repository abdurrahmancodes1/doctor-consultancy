import Doctor from "../models/doctor.js";
import Appointment from "../models/appointments.js";
const updateDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(
      req.user.id,
      {
        $set: {
          ...req.body,
          isVerified: true,
        },
      },
      { new: true }
    ).select("-password -googleId");
    if (!doctor) {
      return res.status(401).json({
        success: false,
        message: "Doctor not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Doctor profile updated successfully",
      data: doctor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update doctor profile",
    });
  }
};

const listDoctors = async (req, res) => {
  try {
    const {
      search,
      specialization,
      city,
      category,
      minFees,
      maxFees,
      sortBy = "createdAt",
      sortOrder = "desc",
      page = 1,
      limit = 20,
    } = req.query;
    const filter = { isVerified: true };
    if (specialization) {
      filter.specialization = { $regex: `^${specialization}$`, $options: "i" };
    }
    if (city) {
      filter["hospitalInfo.city"] = { $regex: city, $options: "i" };
    }
    if (category) {
      filter.category = category;
    }
    if (minFees || maxFees) {
      filter.fees = {};
      if (minFees) filter.fees.$gte = Number(minFees);
      if (maxFees) filter.fees.$lte = Number(maxFees);
    }
    if (search) {
      filter.$or = [
        {
          name: { $regex: search, $options: "i" },
        },
        { specialization: { $regex: search, $options: "i" } },
        {
          "hospitalInfo.name": { $regex: search, $options: "i" },
        },
      ];
    }
    const sort = { [sortBy]: sortOrder === "asc" ? 1 : -1 };
    const skip = (Number(page) - 1) * Number(limit);
    const [items, total] = await Promise.all([
      Doctor.find(filter)
        .select("-password -googleId")
        .sort(sort)
        .skip(skip)
        .limit(limit),
      Doctor.countDocuments(filter),
    ]);
    res.status(200).json({
      success: true,
      message: "Doctor fetched successfully",
      items,
      meta: {
        page: Number(page),
        limit: Number(limit),
        total,
      },
    });
  } catch (error) {
    console.error("Doctor fetch failed:", error);
    res.status(500).json({
      success: false,
      message: "Doctor fetch failed",
    });
  }
};

const doctorById = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const doctor = await Doctor.findById(doctorId)
      .select("-password -googleId")
      .lean();
    if (!doctor) {
      return res.status(401).json({
        success: false,
        message: "fecthing doctor by id failed",
      });
    }
    return res.status(200).json({
      success: true,
      doctor,
      message: "doctor by id fetched",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `falied to fetch doctor by doctorById`,
    });
  }
};

const doctorDashboard = async (req, res) => {
  try {
    const doctorId = req.user.id;

    const now = new Date();
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      0,
      0,
      0,
      0
    );
    const endOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59,
      999
    );

    const doctor = await Doctor.findById(doctorId).select(
      "-password -googleId"
    );
    if (!doctor) {
      return res.status(401).json({
        success: false,
        message: "Doctor not found",
      });
    }

    // Today appointments
    const todayAppointments = await Appointment.find({
      doctorId,
      slotStartIso: { $gte: startOfDay, $lte: endOfDay },
      status: { $ne: "Cancelled" },
    })
      .populate("patientId", "name profileImage age email phone")
      .populate("doctorId", "name fees profileImage specialization")
      .sort({ slotStartIso: 1 });

    // Upcoming appointments (limit 5)
    const upcomingAppointments = await Appointment.find({
      doctorId,
      slotStartIso: { $gt: endOfDay },
      status: { $ne: "Cancelled" },
    })
      .populate("patientId", "name profileImage age email phone")
      .populate("doctorId", "name fees profileImage specialization")
      .sort({ slotStartIso: 1 })
      .limit(5);

    // Unique patients count
    const uniquePatientIds = await Appointment.distinct("patientId", {
      doctorId,
    });
    const totalPatients = uniquePatientIds.length;

    // Completed appointments
    const completedAppointmentCount = await Appointment.countDocuments({
      doctorId,
      status: "Completed",
    });

    // Revenue calc
    const completedAppointments = await Appointment.find({
      doctorId,
      status: "Completed",
    });

    const totalRevenue = completedAppointments.reduce(
      (sum, apt) => sum + (apt.fees || doctor.fees || 0),
      0
    );

    const dashboardData = {
      user: {
        name: doctor.name,
        fees: doctor.fees,
        profileImage: doctor.profileImage,
        specialization: doctor.specialization,
        hospitalInfo: doctor.hospitalInfo,
      },
      stats: {
        totalPatients,
        todayAppointments: todayAppointments.length,
        totalRevenue,
        completedAppointments: completedAppointmentCount,
        averageRating: 4.8, // placeholder
      },
      todayAppointments,
      upcomingAppointments,
      performance: {
        patientSatisfaction: 4.8,
        completionRate: 98,
        responseTime: "< 2min",
      },
    };

    return res.status(200).json({
      success: true,
      message: "Dashboard data fetched",
      dashboardData,
    });
  } catch (error) {
    console.error("Dashboard error", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard",
    });
  }
};

export { updateDoctor, listDoctors, doctorDashboard, doctorById };
