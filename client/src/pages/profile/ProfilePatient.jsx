"use client";

import React, { useState, useEffect } from "react";
import { useUpdatePatientOnboardingMutation } from "../../feature/api/patientApi";

import Header from "../../pages/landing/Header";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "../../components/ui/select";
import { Label } from "../../components/ui/label";

import { User, Phone, FileText } from "lucide-react";

const ProfilePatient = ({ me, refetchMe }) => {
  const [updatePatient, { isLoading: patientSaving }] =
    useUpdatePatientOnboardingMutation();

  const role = me?.role; // always patient
  const user = me?.user;

  const [isEditing, setIsEditing] = useState(false);
  const [activeSection, setActiveSection] = useState("about");

  const loading = patientSaving;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    bloodGroup: "",
    medicalHistory: {
      allergies: "",
      currentMedications: "",
      chronicConditions: "",
    },
    emergencyContact: {
      name: "",
      phone: "",
      relationship: "",
    },
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        dob: user.dob || "",
        gender: user.gender || "",
        bloodGroup: user.bloodGroup || "",
        medicalHistory: {
          allergies: user.medicalHistory?.allergies || "",
          currentMedications: user.medicalHistory?.currentMedications || "",
          chronicConditions: user.medicalHistory?.chronicConditions || "",
        },
        emergencyContact: {
          name: user.emergencyContact?.name || "",
          phone: user.emergencyContact?.phone || "",
          relationship: user.emergencyContact?.relationship || "",
        },
      });
    }
  }, [user]);

  const handleInputChange = (field, value) => {
    if (field.includes(".")) {
      const [p, c] = field.split(".");
      setFormData((prev) => ({
        ...prev,
        [p]: { ...prev[p], [c]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const formatDateForInput = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "";
    return d.toISOString().split("T")[0];
  };

  const sidebarItems = [
    { id: "about", label: "About", icon: User },
    { id: "contact", label: "Contact Information", icon: Phone },
    { id: "medical", label: "Medical History", icon: FileText },
    { id: "emergency", label: "Emergency Contact", icon: Phone },
  ];

  const renderAboutSection = () => (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <Label>Legal first name</Label>
        <Input
          value={formData.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          disabled={!isEditing}
          className="w-80"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label>Official date of birth</Label>
        <Input
          type="date"
          value={formatDateForInput(formData.dob)}
          onChange={(e) => handleInputChange("dob", e.target.value)}
          disabled={!isEditing}
          className="w-80"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label>Gender</Label>
        <RadioGroup
          value={formData.gender}
          onValueChange={(val) => handleInputChange("gender", val)}
          disabled={!isEditing}
          className="flex space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="male" id="male" />
            <Label htmlFor="male">Male</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="female" id="female" />
            <Label htmlFor="female">Female</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="other" id="other" />
            <Label htmlFor="other">Other</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="flex flex-col gap-2">
        <Label>Blood Group</Label>
        <Select
          value={formData.bloodGroup}
          onValueChange={(v) => handleInputChange("bloodGroup", v)}
          disabled={!isEditing}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select blood group" />
          </SelectTrigger>
          <SelectContent>
            {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((g) => (
              <SelectItem key={g} value={g}>
                {g}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const renderContactSection = () => (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <Label>Phone Number</Label>
        <Input
          value={formData.phone}
          onChange={(e) => handleInputChange("phone", e.target.value)}
          disabled={!isEditing}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label>Email</Label>
        <Input value={formData.email} disabled />
      </div>
    </div>
  );

  const renderMedicalSection = () => (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <Label>Allergies</Label>
        <Textarea
          value={formData.medicalHistory.allergies}
          onChange={(e) =>
            handleInputChange("medicalHistory.allergies", e.target.value)
          }
          disabled={!isEditing}
          rows={3}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label>Current Medications</Label>
        <Textarea
          value={formData.medicalHistory.currentMedications}
          onChange={(e) =>
            handleInputChange(
              "medicalHistory.currentMedications",
              e.target.value,
            )
          }
          disabled={!isEditing}
          rows={3}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label>Chronic Conditions</Label>
        <Textarea
          value={formData.medicalHistory.chronicConditions}
          onChange={(e) =>
            handleInputChange(
              "medicalHistory.chronicConditions",
              e.target.value,
            )
          }
          disabled={!isEditing}
          rows={3}
        />
      </div>
    </div>
  );

  const renderEmergencySection = () => (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <Label>Emergency Contact Name</Label>
        <Input
          value={formData.emergencyContact.name}
          onChange={(e) =>
            handleInputChange("emergencyContact.name", e.target.value)
          }
          disabled={!isEditing}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label>Emergency Contact Phone</Label>
        <Input
          value={formData.emergencyContact.phone}
          onChange={(e) =>
            handleInputChange("emergencyContact.phone", e.target.value)
          }
          disabled={!isEditing}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label>Relationship</Label>
        <Input
          value={formData.emergencyContact.relationship}
          onChange={(e) =>
            handleInputChange("emergencyContact.relationship", e.target.value)
          }
          disabled={!isEditing}
        />
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "about":
        return renderAboutSection();
      case "contact":
        return renderContactSection();
      case "medical":
        return renderMedicalSection();
      case "emergency":
        return renderEmergencySection();
      default:
        return renderAboutSection();
    }
  };

  const handleSave = async () => {
    try {
      await updatePatient(formData).unwrap();
      setIsEditing(false);
      refetchMe && refetchMe();
    } catch (e) {
      console.error("Failed updating profile:", e);
    }
  };

  return (
    <>
      <Header showDashboardNav />

      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Records</h1>
          </div>

          <div className="flex items-center space-x-8 mb-8">
            <div className="flex flex-col items-center">
              <Avatar className="w-24 h-24">
                <AvatarImage src={user.profileImage} alt={user.name} />
                <AvatarFallback className="bg-blue-100 text-blue-600 text-2xl font-bold">
                  {user.name?.charAt(0)?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <p className="mt-2 text-lg font-semibold">{user.name}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <div className="space-y-2">
                {sidebarItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeSection === item.id
                        ? "bg-blue-100 text-blue-600 border border-blue-200"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="lg:col-span-3">
              <Card>
                <CardContent className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold capitalize">
                      {sidebarItems.find((i) => i.id === activeSection)?.label}
                    </h2>

                    <div className="flex space-x-2">
                      {isEditing ? (
                        <>
                          <Button
                            variant="outline"
                            onClick={() => setIsEditing(false)}
                          >
                            Cancel
                          </Button>
                          <Button onClick={handleSave} disabled={loading}>
                            {loading ? "Saving..." : "Save"}
                          </Button>
                        </>
                      ) : (
                        <Button onClick={() => setIsEditing(true)}>Edit</Button>
                      )}
                    </div>
                  </div>

                  {renderContent()}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePatient;
