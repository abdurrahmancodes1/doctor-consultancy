// import DoctorProfile from "@/components/doctor/DoctorProfile";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Check, Key } from "lucide-react";
import React, { use, useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import {
  useBookAppointmentMutation,
  // useGetBookedDoctorSlotsByDateQuery,
  // useGetDoctorAppointmentsQuery,
  useGetBookedSlotsQuery,
} from "@/feature/api/appointmentApi";

// import motion from "framer-motion";
import { motion } from "framer-motion";

import { useGetDoctorByIdQuery } from "@/feature/api/doctorApi";
import {
  toLocalYMD,
  minutesToTime,
  convertTo24Hour,
} from "../../../../utils/helper";
import { AnimatePresence } from "framer-motion";
// import CalendarStep from "@/components/bookingsteps/CalendarStep";
// import ConsultantStep from "@/components/bookingsteps/ConsultantStep";
import Payment from "@/components/bookingsteps/Payment";
import CalendarStep from "@/components/bookingsteps/CalendarStep";
import ConsultantStep from "@/components/bookingsteps/ConsultantStep";
import DoctorProfile from "@/components/bookingsteps/DoctorProfile";
// import { useNavigate } from "react-router-dom";
// import ConsultantStep from "@/components/bookingsteps/ConsultantStep";
const PatientBooking = () => {
  const params = useParams();
  const doctorId = params.id;
  console.log("Booking mount", doctorId);

  // console.log(params);
  // const navigate = useNavigate();
  // const { data, isLoading } = useGetDoctorAppointmentsQuery();
  const { data: doctorData, isLoading } = useGetDoctorByIdQuery(doctorId, {
    skip: !doctorId,
  });
  // console.log(doctorData);
  // const [data: getBookedDoctorSolt] = useGetBookedDoctorSlotsByDateQuery();
  // if (!isLoading) console.log(data);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [consultationType, setConsultationType] =
    useState("Video Consultation");
  const navigate = useNavigate();
  // const today = new Date().toISOString().split("T")[0];
  // const [selectedDate, setSelectedDate] = useState(today);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [bookAppointment, { isLoading: appointmentLoading }] =
    useBookAppointmentMutation();
  const [symptoms, setSymptoms] = useState();
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const [availableDates, setAvailableDates] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [createdAppointmentId, setCreatedAppointmentId] = useState("");
  const [patientName, setPatientName] = useState("");
  const { data: bookedData } = useGetBookedSlotsQuery(
    { doctorId, date: selectedDate },
    { skip: !doctorId || !selectedDate },
  );
  // console.log(bookedData);
  const handlePaymentSuccess = () => {
    setTimeout(() => {
      navigate("/dashboard/patient");
    }, 800);
  };

  useEffect(() => {
    // console.log("useEffect triggered", doctorData);

    const range = doctorData?.doctor?.availabilityTimeRange;
    if (!range) return;

    const startDate = new Date(range.startDate);
    const endDate = new Date(range.endDate);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const iterationStart = new Date(
      Math.max(today.getTime(), startDate.getTime()),
    );
    const dates = [];
    for (
      let d = new Date(iterationStart);
      d <= endDate && dates.length < 90;
      d.setDate(d.getDate() + 1)
    ) {
      dates.push(toLocalYMD(d));
    }

    // console.log("final dates:", dates);
    setAvailableDates(dates);
  }, [doctorData]);
  const timeToMinutes = (timeStr) => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 60 + minutes;
  };

  useEffect(() => {
    if (selectedDate && doctorData?.doctor?.dailyTimeRange) {
      const slots = [];
      const slotDuration = doctorData?.doctor?.slotDurationMinutes || 30;
      doctorData?.doctor?.dailyTimeRange.forEach((timeRange) => {
        const startMinutes = timeToMinutes(timeRange.start);
        const endMinutes = timeToMinutes(timeRange.end);
        for (
          let minutes = startMinutes;
          minutes < endMinutes;
          minutes += slotDuration
        ) {
          // console.log(slots, "slots");
          slots.push(minutesToTime(minutes));
        }
        setAvailableSlots(slots);
      });
    }
  }, [selectedDate]);

  const getConsultationPrice = () => {
    const basePrice = doctorData?.doctor?.fees || 0;
    const typePrice = consultationType === "Voice Call" ? -100 : 0;
    return Math.max(0, basePrice + typePrice);
  };

  // Removed duplicate declaration of bookAppointment

  const handleBooking = async () => {
    if (!selectedDate || !selectedSlot || !symptoms.trim()) {
      alert("complete all required field");
      return;
    }

    setIsPaymentProcessing(true);

    try {
      const dateString = toLocalYMD(selectedDate);

      const slotStart = new Date(
        `${dateString}T${convertTo24Hour(selectedSlot)}`,
      );

      const slotEnd = new Date(
        slotStart.getTime() +
          (doctorData?.doctor?.slotDurationMinutes || 30) * 60000,
      );

      const consultationFees = getConsultationPrice();
      const platformFees = Math.round(consultationFees * 0.1);
      const totalAmount = consultationFees + platformFees;

      const appointment = await bookAppointment({
        doctorId,
        slotStartIso: slotStart.toISOString(),
        slotEndIso: slotEnd.toISOString(),
        consultationType,
        symptoms,
        date: dateString,
        consultationFees,
        platformFees,
        totalAmount,
      }).unwrap();
      console.log("CHECKPOINT-BOOK-1 resp:", appointment);

      const ap = appointment?.appointment; // <-- actual data

      if (ap && ap._id) {
        setCreatedAppointmentId(ap._id);
        setPatientName(ap.patientId?.name || "Patient");

        // critical: wait 1 tick before moving to step 3
        setTimeout(() => setCurrentStep(3), 0);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 3000));
        <Navigate to="/dashboard/patient" />;
      }

      // console.log("Booking success:", appointment);
    } catch (error) {
      console.error("Booking failed:", error);
    } finally {
      setIsPaymentProcessing(false);
    }
  };
  // const handlePaymentSuccess = (appointment) => {
  //   // <Navigate to="/patient/dashboard" />;
  //   <Navigate to="/dashboard/patient" />;
  // };

  // console.log(availableSlots, "kj;lkjl;jlj");
  // console.log(availableDates, "jlkjl");
  // console.log(bookedData);
  if (!doctorData?.doctor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading doctor information...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="border-b bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-5">
          <div className="flex items-center justify-between gap-4">
            {/* Left Section */}
            <div className="flex items-center gap-4">
              <Button
                onClick={() => navigate(-1)}
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to doctors
              </Button>

              <div className="h-8 w-px bg-gray-200" />

              <div>
                <h1 className="text-lg md:text-2xl font-bold text-gray-900 leading-tight">
                  Book Appointment
                </h1>
                <p className="text-xs md:text-sm text-gray-600">
                  Name of Doctor
                </p>
              </div>
            </div>

            {/* Stepper */}
            <div className="hidden md:flex items-center">
              {[1, 2, 3].map((step) => (
                <React.Fragment key={step}>
                  <div
                    className={`flex bg-violet-400 items-center gap-2 ${
                      currentStep >= step ? "text-blue-600" : "text-gray-400"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${
                        currentStep > step
                          ? "bg-blue-600 border-blue-600"
                          : currentStep === step
                            ? "border-blue-600 text-blue-600"
                            : "border-gray-300"
                      }`}
                    >
                      {currentStep > step ? (
                        <Check className="w-4 h-4 text-white" />
                      ) : (
                        <span className="text-sm font-semibold">{step}</span>
                      )}
                    </div>

                    <span className="text-sm font-medium whitespace-nowrap">
                      {step === 1
                        ? "Select Time"
                        : step === 2
                          ? "Details"
                          : "Payment"}
                    </span>
                  </div>

                  {step < 3 && <div className="mx-4 w-10 h-px bg-gray-300" />}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl  mx-auto px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <DoctorProfile doctor={doctorData?.doctor} />
          </div>
          <div className="lg:col-span-2">
            <Card className="shadow-lg border-0">
              <CardContent className="p-8">
                <AnimatePresence mode="wait">
                  {currentStep === 1 && (
                    <CalendarStep
                      selectedDate={(d) => d && setSelectedDate(new Date(d))}
                      selectedSlot={selectedSlot}
                      setSelectedDate={setSelectedDate}
                      setSelectedSlot={setSelectedSlot}
                      availableDates={availableDates}
                      availableSlots={availableSlots}
                      bookedSlots={
                        Array.isArray(bookedData?.bookSlot)
                          ? bookedData.bookSlot
                          : []
                      }
                      excludedWeekdays={
                        doctorData?.doctor?.excludedWeekdays || []
                      }
                      onContinue={() => setCurrentStep(2)}
                    />
                  )}
                  {currentStep === 2 && (
                    <ConsultantStep
                      consultationType={consultationType}
                      setConsultationType={setConsultationType}
                      symptoms={symptoms}
                      setSymptoms={setSymptoms}
                      doctorFees={doctorData?.doctor.fees}
                      onContinue={() => setCurrentStep(3)}
                    />
                  )}
                  {/* {console.log(
                    "CHECKPOINT-PB-1 appointmentId:",
                    createdAppointmentId
                  )} */}
                  {/* {console.log("CHECKPOINT-PB-2 patientName:", patientName)} */}
                  {/* {console.log("CHECKPOINT-PB-3 step:", currentStep)} */}

                  {currentStep === 3 && (
                    <Payment
                      onPaymentSuccess={handlePaymentSuccess}
                      selectedDate={selectedDate}
                      selectedSlot={selectedSlot}
                      consultationType={consultationType}
                      doctorName={doctorData?.doctor.name}
                      slotDuration={doctorData?.doctor.slotDurationMinutes}
                      consultationFee={getConsultationPrice()}
                      isProcessing={isPaymentProcessing}
                      onBack={() => setCurrentStep(2)}
                      onConfirm={handleBooking}
                      // onPaymentSuccess={handlePaymentSuccess}
                      loading={appointmentLoading}
                      appointmentId={createdAppointmentId || undefined}
                      patientName={patientName || undefined}
                    />
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientBooking;
