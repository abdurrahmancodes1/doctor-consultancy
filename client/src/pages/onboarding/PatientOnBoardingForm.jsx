import { useGetMeQuery } from "@/feature/api/authApi";
import { useUpdatePatientOnboardingMutation } from "@/feature/api/patientApi";
import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Card, CardContent } from "../../components/ui/card";
import { Phone, User } from "lucide-react";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Button } from "../../components/ui/button";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { Textarea } from "../../components/ui/textarea";
// import { SelectTrigger } from "@radix-ui/react-select";

const PatientOnBoardingForm = () => {
  const [currentStep, setCurrentStep] = useState(3);
  const [formData, setFormData] = useState({
    phone: "",
    dob: "",
    gender: "",
    bloodGroup: "",
    emergencyContact: {
      name: "",
      phone: "",
      relationship: "",
    },
    medicalHistory: {
      allergies: "",
      currentMedications: "",
      chronicConditions: "",
    },
  });
  const navigate = useNavigate();
  const [updatePatientOnboarding, { isLoading, isError }] =
    useUpdatePatientOnboardingMutation();
  const { data } = useGetMeQuery();
  // console.log(useGetMeQuery());
  // console.log(first);
  // console.log(data);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleEmergencyContactChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      emergencyContact: { ...prev.emergencyContact, [field]: value },
    }));
  };
  const handleMedicalHistoryChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      medicalHistory: { ...prev.medicalHistory, [field]: value },
    }));
  };
  const handleSubmit = async () => {
    try {
      await updatePatientOnboarding(formData).unwrap();
      navigate("/");
    } catch (error) {
      console.error("profile update falied", error);
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
  if (isLoading) return <div>Loading</div>;
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
            <p>Complete your profile to start booking appoinment</p>
          </div>
          {/* Progress steps  */}
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
          <Card className="shadow-lg ">
            <CardContent className="p-8">
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="flex items-center space-x-2 mb-2">
                    <User className="w-5 h-5 text-blue-600" />
                    <h2 className="text-xl font-semibold">Basic Information</h2>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6 ">
                    <div className="flex  flex-col items-start gap-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        placeholder="+91 91919191"
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="flex  flex-col items-start gap-2">
                      <Label htmlFor="dob">Date Of Birth</Label>
                      <Input
                        id="dob"
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="flex  flex-col items-start gap-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Select
                        value={formData.gender}
                        onValueChange={(value) =>
                          handleSelectChange("gender", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Gender"></SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex  flex-col items-start gap-2">
                      <Label htmlFor="bloodGroup">Blood Group</Label>
                      <Select
                        value={formData.bloodGroup}
                        onValueChange={(value) =>
                          handleSelectChange("bloodGroup", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Blood Group"></SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A+">A+</SelectItem>
                          <SelectItem value="A-">A-</SelectItem>
                          <SelectItem value="B+">B+</SelectItem>
                          <SelectItem value="B-">B-</SelectItem>
                          <SelectItem value="AB+">AB+</SelectItem>
                          <SelectItem value="AB-">AB-</SelectItem>
                          <SelectItem value="O+">O+</SelectItem>
                          <SelectItem value="O-">O-</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="flex items-center space-x-2 mb-6">
                    <Phone className="w-5 h-5 text-blue-600" />
                    <h2 className="text-xl font-semibold">Emergency Contact</h2>
                  </div>
                  <Alert>
                    <AlertDescription>
                      This information is used to contact someone on your behalf
                      in case of emergency during consultations.
                    </AlertDescription>
                  </Alert>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="emergencyName">Contact Name</Label>
                      <Input
                        id="emergencyName"
                        value={formData.emergencyContact.name}
                        onChange={(e) =>
                          handleEmergencyContactChange("name", e.target.value)
                        }
                        placeholder="Full Name"
                        required
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="emergencyName">Contact Phone</Label>
                      <Input
                        id="emergencyName"
                        value={formData.emergencyContact.phone}
                        onChange={(e) =>
                          handleEmergencyContactChange("phone", e.target.value)
                        }
                        placeholder="+91 91919191"
                        required
                      />
                    </div>
                    <div className="flex  flex-col items-start gap-2">
                      <Label htmlFor="relationship">Relationship</Label>
                      <Select
                        value={formData.emergencyContact.relationship}
                        onValueChange={(value) =>
                          handleEmergencyContactChange("relationship", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a Relationship"></SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="spouse">Spouse</SelectItem>
                          <SelectItem value="parent">Parent</SelectItem>
                          <SelectItem value="child">Child</SelectItem>
                          <SelectItem value="sibling">Sibling</SelectItem>
                          <SelectItem value="friend">Friend</SelectItem>
                          <SelectItem value="relative">Relative</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="flex items-center space-x-2 mb-6">
                    <Phone className="w-5 h-5 text-blue-600" />
                    <h2 className="text-xl font-semibold">
                      {" "}
                      Medical Information
                    </h2>
                  </div>
                  <Alert>
                    <AlertDescription>
                      This information helps doctors provide a better care. All
                      information is kept confidential and secure.
                    </AlertDescription>
                  </Alert>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="allergies">Known Allergies</Label>
                      <Textarea
                        id="allergies"
                        value={formData.medicalHistory.allergies}
                        onChange={(e) =>
                          handleMedicalHistoryChange(
                            "allergies",
                            e.target.value,
                          )
                        }
                        placeholder="e.g., Penicillin, Peanuts, Dust (or write 'None' if not known allergies)"
                        row={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currentMedications">
                        Current Medications{" "}
                      </Label>
                      <Textarea
                        id="currentMedications"
                        value={formData.medicalHistory.currentMedications}
                        onChange={(e) =>
                          handleMedicalHistoryChange(
                            "currentMedications",
                            e.target.value,
                          )
                        }
                        placeholder="List any medications you're currently taking (or write 'None' if not taking any medications)"
                        row={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="chronicConditions">
                        Chronic Conditions
                      </Label>
                      <Textarea
                        id="chronicConditions"
                        value={formData.medicalHistory.chronicConditions}
                        onChange={(e) =>
                          handleMedicalHistoryChange(
                            "chronicConditions",
                            e.target.value,
                          )
                        }
                        placeholder="e.g., Diabetes, Hypertension, Asthma (or write 'None' if no  chronical conditions)"
                        row={3}
                      />
                    </div>
                  </div>
                </div>
              )}
              <div className="flex justify-between p-8">
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
                      (currentStep === 1 &&
                        (!formData.phone ||
                          !formData.dob ||
                          !formData.gender)) ||
                      (currentStep === 2 &&
                        (!formData.emergencyContact.name ||
                          !formData.emergencyContact.phone ||
                          !formData.emergencyContact.relationship)) ||
                      (currentStep === 3 &&
                        (!formData.medicalHistory.allergies ||
                          !formData.medicalHistory.chronicConditions ||
                          !formData.medicalHistory.currentMedications))
                    }
                  >
                    Next
                  </Button>
                ) : (
                  <Button
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
export default PatientOnBoardingForm;
