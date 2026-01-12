import React, { useState } from "react";
// import { specializations } from "utils/constant";

const DoctorOnBoardingForm = () => {
  const [formData, setFormData] = useState({
    specialization: "",
    categories: "",
    qualifications: "",
    experience: "",
    fees: "",
    about: "",
    hospitalInfo: {
      name: "",
      address: "",
      city: "",
    },
    availabilityRange: {
      startDate: "",
      endDate: "",
      excludeWeekdays: [],
    },
    dailyTimeRange: [
      { start: "9:00", end: "12:00" },
      { start: "14:00", end: "17:00" },
    ],
    slotDurationMinutes: 30,
  });
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  return <div>DoctorOnBoardingForm</div>;
};

export default DoctorOnBoardingForm;
