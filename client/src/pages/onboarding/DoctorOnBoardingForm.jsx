import { useGetMeQuery } from "@/feature/api/authApi";
import { useUpdateDoctorOnboardingMutation } from "@/feature/api/doctorApi";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../../components/ui/card";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
// import {} from "@radix-ui/react-select";
import {
  healthcareCategories,
  healthcareCategoriesList,
  specializations,
} from "../../../utils/constant";
import { Input } from "../../components/ui/input";
import { Checkbox } from "../../components/ui/checkbox";
import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";
// import { specializations } from "utils/constant";

const DoctorOnBoardingForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    specialization: "",
    category: [],
    qualification: "",
    experience: "",
    fees: "",
    value: "",
    hospitalInfo: {
      name: "",
      address: "",
      city: "",
    },
    availabilityTimeRange: {
      startDate: "",
      endDate: "",
      excludedWeekdays: [],
    },
    dailyTimeRange: [
      {
        start: "09:00",
        end: "17:00",
      },
      {
        start: "14:00",
        end: "17:00",
      },
    ],
    slotDurationMinutes: 30,
  });
  const navigate = useNavigate();
  const [updateDoctorOnBoarding, { isLoading, isError }] =
    useUpdateDoctorOnboardingMutation();
  const { data } = useGetMeQuery();
  const handleCategoryToggle = (category) => {
    setFormData((prev) => ({
      ...prev,
      category: prev.category.includes(category)
        ? prev.category.filter((c) => c !== category)
        : [...prev.category, category],
    }));
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async () => {
    try {
      const payload = {
        ...formData,
        experience: Number(formData.experience),
        fees: Number(formData.fees),
      };

      await updateDoctorOnBoarding(payload).unwrap();

      // await updateDoctorOnBoarding(formData).unwrap();
      navigate("/dashboard/doctor");
    } catch (error) {
      console.error("Profile updat failed", error);
    }
  };
  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };
  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  const handleHospitalInfoChnage = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      hospitalInfo: {
        ...prev.hospitalInfo,
        [field]: value,
      },
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-2xl font-bold text-blue-900">MediCare+</div>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1>Welcome {data?.user?.name} to Medicare+</h1>
            <p>Complete your profile</p>
          </div>
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                      currentStep >= step
                        ? "bg-blue-600 border-blue-600 text-white"
                        : "border-gray-300 text-gray-400"
                    }`}
                  >
                    {step}
                  </div>

                  {step < 3 && (
                    <div
                      className={`w-20 h-1 ${
                        currentStep > step ? "bg-blue-600" : "bg-gray-300"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
          <Card className="shadow-lg">
            <CardContent className="p-8">
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold mb-4">
                    Professional Information
                  </h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="specialization">
                        Medical Specialization
                      </Label>
                      <Select
                        value={formData.specialization}
                        onValueChange={(value) =>
                          setFormData((prev) => ({
                            ...prev,
                            specialization: value,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Specailization"></SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {specializations.map((spec) => (
                            <SelectItem key={spec} value={spec}>
                              {spec}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="experience">Years of Experience </Label>
                      <Input
                        id="experience"
                        name="experience"
                        type="number"
                        value={formData.experience}
                        placeholder="e.g., 5"
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label>Health Categories</Label>
                    <p className="text-sm text-gray-600">
                      Select the healthcare areas you provide servies for
                      (Select at least one)
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {healthcareCategoriesList.map((category) => (
                        <div
                          className="flex items-center space-x-2 "
                          key={category}
                        >
                          <Checkbox
                            id={category}
                            checked={formData.category.includes(category)}
                            onCheckedChange={() =>
                              handleCategoryToggle(category)
                            }
                          />
                          <label
                            htmlFor={category}
                            className="text-sm font-medium cursor-pointer hover:text-blue-600"
                          >
                            {category}
                          </label>
                        </div>
                      ))}
                    </div>
                    {formData.category.length === 0 && (
                      <p className="text-red-500 text-xs">
                        Please select at least one category
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="qualification">Qualification </Label>
                    <Input
                      id="qualification"
                      name="qualification"
                      type="text"
                      value={formData.qualification}
                      placeholder="e.g., MBBS, MD Cardiology"
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="about">About You </Label>
                    <Input
                      id="about"
                      name="about"
                      type="text"
                      value={formData.about}
                      placeholder="Tell patient about your expertise and approach to healthcare..."
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fees">Consultations Fee (₹) </Label>
                    <Input
                      id="fees"
                      name="fees"
                      type="number"
                      value={formData.fees}
                      placeholder="e.g., 500"
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6 ">
                  <h2 className="text-xl font-semibold mb-4">
                    Hospital/Clinic Information
                  </h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="hospitalName">Hospital/Clinic Name</Label>
                      <Input
                        id="hospitalName"
                        type="text"
                        value={formData.hospitalInfo.name}
                        placeholder="e.g., Apollo Hospital"
                        onChange={(e) =>
                          handleHospitalInfoChnage("name", e.target.value)
                        }
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="address">Address</Label>
                      <Textarea
                        id="address"
                        type="text"
                        value={formData.hospitalInfo.address}
                        placeholder="Full address of your practice"
                        onChange={(e) =>
                          handleHospitalInfoChnage("address", e.target.value)
                        }
                        rows={3}
                        required
                      />
                    </div>
                    <div className="space-y-2 ">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        type="text"
                        value={formData.hospitalInfo.city}
                        placeholder="e.g., Mumbai"
                        onChange={(e) =>
                          handleHospitalInfoChnage("city", e.target.value)
                        }
                        required
                      />
                    </div>
                  </div>
                </div>
              )}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold mb-4">
                    Availability Settings
                  </h2>
                  <div className=" grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="startDate">Available From</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={formData.availabilityTimeRange.startDate}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            availabilityTimeRange: {
                              ...prev.availabilityTimeRange,
                              startDate: e.target.value,
                            },
                          }))
                        }
                        required
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="endDate">Available Until</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={formData.availabilityTimeRange.endDate}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            availabilityTimeRange: {
                              ...prev.availabilityTimeRange,
                              endDate: e.target.value,
                            },
                          }))
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Appoinment Slot Duration</Label>
                    <Select
                      value={formData.slotDurationMinutes?.toString() || "30"}
                      onValueChange={(value) => {
                        setFormData((prev) => ({
                          ...prev,
                          slotDurationMinutes: parseInt(value),
                        }));
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select slot duration"></SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="20">20 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="45">45 minutes</SelectItem>
                        <SelectItem value="60">60 minutes</SelectItem>
                        <SelectItem value="90">90 minutes</SelectItem>
                        <SelectItem value="120">120 minutes</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-gray-600">
                      Duration for each patient consultation slot
                    </p>
                  </div>
                  <div className="space-y-3">
                    <Label>Working Days</Label>
                    <p>Select the days are NOT available </p>
                    <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
                      {[
                        {
                          day: "Sunday",
                          value: 0,
                        },
                        {
                          day: "Monday",
                          value: 1,
                        },
                        {
                          day: "Tuesday",
                          value: 2,
                        },
                        {
                          day: "Wednesday",
                          value: 3,
                        },
                        {
                          day: "Thursday",
                          value: 4,
                        },
                        {
                          day: "Friday",
                          value: 5,
                        },
                        {
                          day: "Saturday",
                          value: 6,
                        },
                      ].map(({ day, value }) => (
                        <div
                          key={value}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`day-${value}`}
                            checked={formData.availabilityTimeRange.excludedWeekdays.includes(
                              value,
                            )}
                            onCheckedChange={(checked) => {
                              setFormData((prev) => ({
                                ...prev,
                                availabilityTimeRange: {
                                  ...prev.availabilityTimeRange,
                                  excludedWeekdays: checked
                                    ? [
                                        ...prev.availabilityTimeRange
                                          .excludedWeekdays,
                                        value,
                                      ]
                                    : prev.availabilityTimeRange.excludedWeekdays.filter(
                                        (d) => d !== value,
                                      ),
                                },
                              }));
                            }}
                          />
                          <label
                            htmlFor={`day-${value}`}
                            className="text-sm font-medium cursor-pointer"
                          >
                            {day.slice(0, 3)}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4 ">
                    <Label>Daily Working Hours</Label>
                    <p className="text-sm text-gray-600">
                      Set Your working hour for each day
                    </p>
                    {formData.dailyTimeRange.map((range, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-4 border rounded-lg "
                      >
                        <div className="flex-1 ">
                          <Label>Sesstion {index + 1}-Start time</Label>
                          <Input
                            required
                            type="time"
                            value={range.start}
                            onChange={(e) => {
                              const newRange = [...formData.dailyTimeRange];
                              newRange[index].start = e.target.value;
                              setFormData((prev) => ({
                                ...prev,
                                dailyTimeRange: newRange,
                              }));
                            }}
                          />
                        </div>
                        <div className="flex-1">
                          <Label>Sesstion {index + 1}-End time</Label>
                          <Input
                            type="time"
                            value={range.end}
                            onChange={(e) => {
                              const newRange = [...formData.dailyTimeRange];
                              newRange[index].end = e.target.value;
                              setFormData((prev) => ({
                                ...prev,
                                dailyTimeRange: newRange,
                              }));
                            }}
                            required
                          />
                        </div>
                        {formData.dailyTimeRange.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const newRange = formData.dailyTimeRange.filter(
                                (_, i) => i !== index,
                              );
                              setFormData((prev) => ({
                                ...prev,
                                dailyTimeRange: newRange,
                              }));
                            }}
                            className="text-red-600 hover:text-red-700"
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          dailyTimeRange: [
                            ...prev.dailyTimeRange,
                            {
                              start: "18:00",
                              end: "20:00",
                            },
                          ],
                        }));
                      }}
                      className="w-full"
                    >
                      + Add Another time session
                    </Button>
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-8">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                >
                  Previous
                </Button>

                {currentStep < 3 ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    disabled={
                      currentStep === 1 && formData.category.length === 0
                    }
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {isLoading ? "Completing Setup..." : "Complete Profile"}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default DoctorOnBoardingForm;
