// "use client";

// import React, { useState, useEffect } from "react";
// import { useGetMeQuery } from "@/feature/api/authApi";
// import { useUpdateDoctorOnboardingMutation } from "../feature/api/doctorApi"; // assuming both exported here; if patients are separate, adjust import
// import { useUpdatePatientOnboardingMutation } from "../feature/api/patientApi"; // assuming both exported here; if patients are separate, adjust import

// import Header from "../pages/landing/Header";

// import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";

// import { Card, CardContent } from "../components/ui/card";

// import { Button } from "../components/ui/button";
// import { Input } from "../components/ui/input";
// import { Textarea } from "../components/ui/textarea";
// import { Checkbox } from "../components/ui/checkbox";
// import { Label } from "../components/ui/label";
// import {
//   Select,
//   SelectTrigger,
//   SelectContent,
//   SelectItem,
//   SelectValue,
// } from "../components/ui/select";
// import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";

// import {
//   User,
//   Phone,
//   FileText,
//   MapPin,
//   Clock,
//   Stethoscope,
//   X,
//   Plus,
//   Badge,
// } from "lucide-react";

// import { healthcareCategories, specializations } from "../../utils/constant";
// const ProfilePage = () => {
//   const {
//     data: meData,
//     isLoading: meLoading,
//     refetch: refetchMe,
//   } = useGetMeQuery();
//   const [updateDoctor, { isLoading: doctorSaving }] =
//     useUpdateDoctorOnboardingMutation();
//   const [updatePatient, { isLoading: patientSaving }] =
//     useUpdatePatientOnboardingMutation();

//   const me = meData;
//   const role = me?.role; // "doctor" or "patient"
//   const user = me?.user;

//   const [isEditing, setIsEditing] = useState(false);
//   const [activeSection, setActiveSection] = useState("about");

//   const loading = meLoading || doctorSaving || patientSaving;
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     dob: "",
//     gender: "",
//     bloodGroup: "",
//     about: "",
//     specialization: "",
//     category: [],
//     qualification: "",
//     experience: 0,
//     fees: 0,
//     hospitalInfo: {
//       name: "",
//       address: "",
//       city: "",
//     },
//     medicalHistory: {
//       allergies: "",
//       currentMedications: "",
//       chronicConditions: "",
//     },
//     emergencyContact: {
//       name: "",
//       phone: "",
//       relationship: "",
//     },
//     availabilityRange: {
//       startDate: "",
//       endDate: "",
//       excludedWeekdays: [],
//     },
//     dailyTimeRanges: [],
//     slotDurationMinutes: 30,
//   });
//   useEffect(() => {
//     if (user) {
//       setFormData({
//         name: user.name || "",
//         email: user.email || "",
//         phone: user.phone || "",
//         dob: user.dob || "",
//         gender: user.gender || "",
//         bloodGroup: user.bloodGroup || "",
//         about: user.about || "",
//         specialization: user.specialization || "",
//         category: user.category || [],
//         qualification: user.qualification || "",
//         experience: user.experience || 0,
//         fees: user.fees || 0,
//         hospitalInfo: {
//           name: user.hospitalInfo?.name || "",
//           address: user.hospitalInfo?.address || "",
//           city: user.hospitalInfo?.city || "",
//         },
//         medicalHistory: {
//           allergies: user.medicalHistory?.allergies || "",
//           currentMedications: user.medicalHistory?.currentMedications || "",
//           chronicConditions: user.medicalHistory?.chronicConditions || "",
//         },
//         emergencyContact: {
//           name: user.emergencyContact?.name || "",
//           phone: user.emergencyContact?.phone || "",
//           relationship: user.emergencyContact?.relationship || "",
//         },
//         availabilityRange: {
//           startDate: user.availabilityRange?.startDate || "",
//           endDate: user.availabilityRange?.endDate || "",
//           excludedWeekdays: user.availabilityRange?.excludedWeekdays || [],
//         },
//         dailyTimeRanges: user.dailyTimeRanges || [],
//         slotDurationMinutes: user.slotDurationMinutes || 30,
//       });
//     }
//   }, [user]);
//   const handleInputChange = (field, value) => {
//     if (field.includes(".")) {
//       const [p, c] = field.split(".");
//       setFormData((prev) => ({
//         ...prev,
//         [p]: { ...prev[p], [c]: value },
//       }));
//     } else {
//       setFormData((prev) => ({ ...prev, [field]: value }));
//     }
//   };

//   const handleArrayChange = (field, index, subField, value) => {
//     setFormData((prev) => ({
//       ...prev,
//       [field]: prev[field].map((item, i) =>
//         i === index ? { ...item, [subField]: value } : item
//       ),
//     }));
//   };
//   const handleCategorySelect = (cat) => {
//     if (!formData.category.includes(cat.title)) {
//       handleInputChange("category", [...formData.category, cat.title]);
//     }
//   };

//   const handleCategoryDelete = (iDel) => {
//     const arr = formData.category.filter((_, i) => i !== iDel);
//     handleInputChange("category", arr);
//   };

//   const getAvailableCategories = () => {
//     return healthcareCategories.filter(
//       (cat) => !formData.category.includes(cat.title)
//     );
//   };
//   const handleWeekdayToggle = (weekday) => {
//     const arr = [...formData.availabilityRange.excludedWeekdays];
//     const idx = arr.indexOf(weekday);
//     if (idx > -1) arr.splice(idx, 1);
//     else arr.push(weekday);
//     handleInputChange("availabilityRange.excludedWeekdays", arr);
//   };

//   const addTimeRange = () => {
//     handleInputChange("dailyTimeRanges", [
//       ...formData.dailyTimeRanges,
//       { start: "09:00", end: "17:00" },
//     ]);
//   };

//   const removeTimeRange = (idx) => {
//     handleInputChange(
//       "dailyTimeRanges",
//       formData.dailyTimeRanges.filter((_, i) => i !== idx)
//     );
//   };
//   const formatDateForInput = (iso) => {
//     if (!iso) return "";
//     const d = new Date(iso);
//     if (isNaN(d.getTime())) return "";
//     return d.toISOString().split("T")[0];
//   };
//   const sidebarItems =
//     role === "doctor"
//       ? [
//           { id: "about", label: "About", icon: User },
//           { id: "professional", label: "Professional Info", icon: Stethoscope },
//           { id: "hospital", label: "Hospital Information", icon: MapPin },
//           { id: "availability", label: "Availability", icon: Clock },
//         ]
//       : [
//           { id: "about", label: "About", icon: User },
//           { id: "contact", label: "Contact Information", icon: Phone },
//           { id: "medical", label: "Medical History", icon: FileText },
//           { id: "emergency", label: "Emergency Contact", icon: Phone },
//         ];
//   const renderAboutSection = () => (
//     <div className="space-y-6">
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         <div className="flex flex-col gap-2">
//           <Label>Legal first name</Label>
//           <Input
//             value={formData.name}
//             onChange={(e) => handleInputChange("name", e.target.value)}
//             disabled={!isEditing}
//             className="w-80"
//           />
//         </div>
//       </div>

//       {role === "patient" && (
//         <>
//           <div className="flex flex-col gap-2">
//             <Label>Official date of birth</Label>
//             <Input
//               type="date"
//               value={formatDateForInput(formData.dob)}
//               onChange={(e) => handleInputChange("dob", e.target.value)}
//               disabled={!isEditing}
//               className="w-80"
//             />
//           </div>

//           <div className="flex flex-col gap-2">
//             <Label>Gender</Label>
//             <RadioGroup
//               value={formData.gender}
//               onValueChange={(val) => handleInputChange("gender", val)}
//               disabled={!isEditing}
//               className="flex space-y-2"
//             >
//               <div className="flex items-center space-x-2">
//                 <RadioGroupItem value="male" id="male" />
//                 <Label htmlFor="male">Male</Label>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <RadioGroupItem value="female" id="female" />
//                 <Label htmlFor="female">Female</Label>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <RadioGroupItem value="other" id="other" />
//                 <Label htmlFor="other">Other</Label>
//               </div>
//             </RadioGroup>
//           </div>

//           <div className="flex flex-col gap-2">
//             <Label>Blood Group</Label>
//             <Select
//               value={formData.bloodGroup}
//               onValueChange={(v) => handleInputChange("bloodGroup", v)}
//               disabled={!isEditing}
//             >
//               <SelectTrigger>
//                 <SelectValue placeholder="Select blood group" />
//               </SelectTrigger>
//               <SelectContent>
//                 {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((g) => (
//                   <SelectItem key={g} value={g}>
//                     {g}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>
//         </>
//       )}

//       {role === "doctor" && (
//         <div>
//           <Label>About</Label>
//           <Textarea
//             value={formData.about}
//             onChange={(e) => handleInputChange("about", e.target.value)}
//             disabled={!isEditing}
//             rows={4}
//           />
//         </div>
//       )}
//     </div>
//   );
//   const renderProfessionalSection = () => (
//     <div className="space-y-6">
//       <div className="flex flex-col gap-2">
//         <Label>Specialization</Label>
//         <Select
//           value={formData.specialization || ""}
//           onValueChange={(v) => handleInputChange("specialization", v)}
//           disabled={!isEditing}
//         >
//           <SelectTrigger>
//             <SelectValue placeholder="Select specialization" />
//           </SelectTrigger>
//           <SelectContent>
//             {specializations.map((spec) => (
//               <SelectItem key={spec} value={spec}>
//                 {spec}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//       </div>

//       <div className="flex flex-col gap-2">
//         <Label>Category</Label>
//         <div className="flex flex-wrap gap-2 mt-2">
//           {formData.category?.map((cat, index) => (
//             <Badge
//               key={index}
//               variant="secondary"
//               className="flex items-center space-x-1"
//             >
//               <span>{cat}</span>
//               {isEditing && (
//                 <button
//                   type="button"
//                   className="ml-1 p-0 bg-transparent"
//                   onClick={(e) => {
//                     e.preventDefault();
//                     handleCategoryDelete(index);
//                   }}
//                 >
//                   <X className="w-3 h-3" />
//                 </button>
//               )}
//             </Badge>
//           ))}

//           {isEditing && getAvailableCategories().length > 0 && (
//             <Select
//               onValueChange={(id) => {
//                 const selected = getAvailableCategories().find(
//                   (c) => c.id === id
//                 );
//                 if (selected) handleCategorySelect(selected);
//               }}
//             >
//               <SelectTrigger className="w-48">
//                 <SelectValue placeholder="Add Category" />
//               </SelectTrigger>
//               <SelectContent>
//                 {getAvailableCategories().map((c) => (
//                   <SelectItem key={c.id} value={c.id}>
//                     <div className="flex items-center space-x-2">
//                       <div className={`w-3 h-3 rounded-full ${c.color}`}></div>
//                       <span>{c.title}</span>
//                     </div>
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           )}
//         </div>
//       </div>

//       <div className="flex flex-col gap-2">
//         <Label>Qualification</Label>
//         <Input
//           value={formData.qualification || ""}
//           onChange={(e) => handleInputChange("qualification", e.target.value)}
//           disabled={!isEditing}
//         />
//       </div>

//       <div className="flex flex-col gap-2">
//         <Label>Experience (years)</Label>
//         <Input
//           type="number"
//           value={formData.experience || ""}
//           onChange={(e) =>
//             handleInputChange("experience", parseInt(e.target.value) || 0)
//           }
//           disabled={!isEditing}
//         />
//       </div>

//       <div className="flex flex-col gap-2">
//         <Label>Consultation Fee (₹)</Label>
//         <Input
//           type="number"
//           value={formData.fees || ""}
//           onChange={(e) =>
//             handleInputChange("fees", parseInt(e.target.value) || 0)
//           }
//           disabled={!isEditing}
//         />
//       </div>
//     </div>
//   );
//   const renderHospitalSection = () => (
//     <div className="space-y-6">
//       <div className="flex flex-col gap-2">
//         <Label>Hospital / Clinic Name</Label>
//         <Input
//           value={formData.hospitalInfo.name || ""}
//           onChange={(e) =>
//             handleInputChange("hospitalInfo.name", e.target.value)
//           }
//           disabled={!isEditing}
//         />
//       </div>

//       <div className="flex flex-col gap-2">
//         <Label>Address</Label>
//         <Textarea
//           value={formData.hospitalInfo.address || ""}
//           onChange={(e) =>
//             handleInputChange("hospitalInfo.address", e.target.value)
//           }
//           rows={3}
//           disabled={!isEditing}
//         />
//       </div>

//       <div className="flex flex-col gap-2">
//         <Label>City</Label>
//         <Input
//           value={formData.hospitalInfo.city || ""}
//           onChange={(e) =>
//             handleInputChange("hospitalInfo.city", e.target.value)
//           }
//           disabled={!isEditing}
//         />
//       </div>
//     </div>
//   );
//   const renderAvailabilitySection = () => (
//     <div className="space-y-6">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <div className="flex flex-col gap-2">
//           <Label>Available From</Label>
//           <Input
//             type="date"
//             value={formatDateForInput(formData.availabilityRange.startDate)}
//             onChange={(e) =>
//               handleInputChange("availabilityRange.startDate", e.target.value)
//             }
//             disabled={!isEditing}
//           />
//         </div>

//         <div className="flex flex-col gap-2">
//           <Label>Available Until</Label>
//           <Input
//             type="date"
//             value={formatDateForInput(formData.availabilityRange.endDate)}
//             onChange={(e) =>
//               handleInputChange("availabilityRange.endDate", e.target.value)
//             }
//             disabled={!isEditing}
//           />
//         </div>
//       </div>

//       <div className="flex flex-col gap-2">
//         <Label>Excluded Weekdays</Label>
//         <div className="flex flex-wrap gap-2">
//           {[
//             "Sunday",
//             "Monday",
//             "Tuesday",
//             "Wednesday",
//             "Thursday",
//             "Friday",
//             "Saturday",
//           ].map((d, i) => (
//             <label key={i} className="flex items-center space-x-2">
//               <Checkbox
//                 checked={formData.availabilityRange.excludedWeekdays.includes(
//                   i
//                 )}
//                 onCheckedChange={() => handleWeekdayToggle(i)}
//                 disabled={!isEditing}
//               />
//               <span>{d}</span>
//             </label>
//           ))}
//         </div>
//       </div>

//       <div className="flex flex-col gap-2">
//         <Label>Daily Time Ranges</Label>
//         <div className="space-y-3">
//           {formData.dailyTimeRanges.map((t, i) => (
//             <div key={i} className="flex items-center space-x-2">
//               <Input
//                 type="time"
//                 value={t.start}
//                 onChange={(e) =>
//                   handleArrayChange(
//                     "dailyTimeRanges",
//                     i,
//                     "start",
//                     e.target.value
//                   )
//                 }
//                 disabled={!isEditing}
//               />
//               <span>to</span>
//               <Input
//                 type="time"
//                 value={t.end}
//                 onChange={(e) =>
//                   handleArrayChange("dailyTimeRanges", i, "end", e.target.value)
//                 }
//                 disabled={!isEditing}
//               />
//               {isEditing && (
//                 <Button
//                   size="sm"
//                   variant="outline"
//                   onClick={() => removeTimeRange(i)}
//                 >
//                   <X className="w-4 h-4" />
//                 </Button>
//               )}
//             </div>
//           ))}

//           {isEditing && (
//             <Button variant="outline" size="sm" onClick={addTimeRange}>
//               <Plus className="w-4 h-4 mr-2" /> Add Time Range
//             </Button>
//           )}
//         </div>
//       </div>

//       <div className="flex flex-col gap-2">
//         <Label>Slot Duration (minutes)</Label>
//         <Select
//           value={formData.slotDurationMinutes.toString()}
//           onValueChange={(v) =>
//             handleInputChange("slotDurationMinutes", parseInt(v))
//           }
//           disabled={!isEditing}
//         >
//           <SelectTrigger>
//             <SelectValue placeholder="Select duration" />
//           </SelectTrigger>
//           <SelectContent>
//             {["15", "20", "30", "45", "60", "90", "120"].map((m) => (
//               <SelectItem key={m} value={m}>
//                 {m} minutes
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//       </div>
//     </div>
//   );
//   const renderContactSection = () => (
//     <div className="space-y-6">
//       <div className="flex flex-col gap-2">
//         <Label>Phone Number</Label>
//         <Input
//           value={formData.phone}
//           onChange={(e) => handleInputChange("phone", e.target.value)}
//           disabled={!isEditing}
//         />
//       </div>

//       <div className="flex flex-col gap-2">
//         <Label>Email</Label>
//         <Input value={formData.email} disabled />
//       </div>
//     </div>
//   );
//   const renderMedicalSection = () => (
//     <div className="space-y-6">
//       <div className="flex flex-col gap-2">
//         <Label>Allergies</Label>
//         <Textarea
//           value={formData.medicalHistory.allergies}
//           onChange={(e) =>
//             handleInputChange("medicalHistory.allergies", e.target.value)
//           }
//           disabled={!isEditing}
//           rows={3}
//         />
//       </div>

//       <div className="flex flex-col gap-2">
//         <Label>Current Medications</Label>
//         <Textarea
//           value={formData.medicalHistory.currentMedications}
//           onChange={(e) =>
//             handleInputChange(
//               "medicalHistory.currentMedications",
//               e.target.value
//             )
//           }
//           disabled={!isEditing}
//           rows={3}
//         />
//       </div>

//       <div className="flex flex-col gap-2">
//         <Label>Chronic Conditions</Label>
//         <Textarea
//           value={formData.medicalHistory.chronicConditions}
//           onChange={(e) =>
//             handleInputChange(
//               "medicalHistory.chronicConditions",
//               e.target.value
//             )
//           }
//           disabled={!isEditing}
//           rows={3}
//         />
//       </div>
//     </div>
//   );
//   const renderEmergencySection = () => (
//     <div className="space-y-6">
//       <div className="flex flex-col gap-2">
//         <Label>Emergency Contact Name</Label>
//         <Input
//           value={formData.emergencyContact.name}
//           onChange={(e) =>
//             handleInputChange("emergencyContact.name", e.target.value)
//           }
//           disabled={!isEditing}
//         />
//       </div>

//       <div className="flex flex-col gap-2">
//         <Label>Emergency Contact Phone</Label>
//         <Input
//           value={formData.emergencyContact.phone}
//           onChange={(e) =>
//             handleInputChange("emergencyContact.phone", e.target.value)
//           }
//           disabled={!isEditing}
//         />
//       </div>

//       <div className="flex flex-col gap-2">
//         <Label>Relationship</Label>
//         <Input
//           value={formData.emergencyContact.relationship}
//           onChange={(e) =>
//             handleInputChange("emergencyContact.relationship", e.target.value)
//           }
//           disabled={!isEditing}
//         />
//       </div>
//     </div>
//   );
//   const renderContent = () => {
//     switch (activeSection) {
//       case "about":
//         return renderAboutSection();
//       case "professional":
//         return renderProfessionalSection();
//       case "hospital":
//         return renderHospitalSection();
//       case "availability":
//         return renderAvailabilitySection();
//       case "contact":
//         return renderContactSection();
//       case "medical":
//         return renderMedicalSection();
//       case "emergency":
//         return renderEmergencySection();
//       default:
//         return renderAboutSection();
//     }
//   };
//   const handleSave = async () => {
//     try {
//       if (role === "doctor") {
//         await updateDoctor(formData).unwrap();
//       } else if (role === "patient") {
//         await updatePatient(formData).unwrap();
//       }
//       setIsEditing(false);
//       refetchMe();
//     } catch (e) {
//       console.error("Failed updating profile:", e);
//     }
//   };
//   if (meLoading) return <div>Loading...</div>;

//   return (
//     <>
//       <Header showDashboardNav />

//       <div className="min-h-screen bg-gray-50 pt-16">
//         <div className="container mx-auto px-4 py-8">
//           <div className="mb-8">
//             <h1 className="text-3xl font-bold text-gray-900">Records</h1>
//           </div>

//           <div className="flex items-center space-x-8 mb-8">
//             <div className="flex flex-col items-center">
//               <Avatar className="w-24 h-24">
//                 <AvatarImage src={user.profileImage} alt={user.name} />
//                 <AvatarFallback className="bg-blue-100 text-blue-600 text-2xl font-bold">
//                   {user.name?.charAt(0)?.toUpperCase()}
//                 </AvatarFallback>
//               </Avatar>
//               <p className="mt-2 text-lg font-semibold">{user.name}</p>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
//             <div className="lg:col-span-1">
//               <div className="space-y-2">
//                 {sidebarItems.map((item) => (
//                   <button
//                     key={item.id}
//                     onClick={() => setActiveSection(item.id)}
//                     className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
//                       activeSection === item.id
//                         ? "bg-blue-100 text-blue-600 border border-blue-200"
//                         : "text-gray-600 hover:bg-gray-100"
//                     }`}
//                   >
//                     <item.icon className="w-5 h-5" />
//                     <span>{item.label}</span>
//                   </button>
//                 ))}
//               </div>
//             </div>

//             <div className="lg:col-span-3">
//               <Card>
//                 <CardContent className="p-8">
//                   <div className="flex items-center justify-between mb-6">
//                     <h2 className="text-2xl font-semibold capitalize">
//                       {sidebarItems.find((i) => i.id === activeSection)?.label}
//                     </h2>

//                     <div className="flex space-x-2">
//                       {isEditing ? (
//                         <>
//                           <Button
//                             variant="outline"
//                             onClick={() => setIsEditing(false)}
//                           >
//                             Cancel
//                           </Button>
//                           <Button onClick={handleSave} disabled={loading}>
//                             {loading ? "Saving..." : "Save"}
//                           </Button>
//                         </>
//                       ) : (
//                         <Button onClick={() => setIsEditing(true)}>Edit</Button>
//                       )}
//                     </div>
//                   </div>

//                   {renderContent()}
//                 </CardContent>
//               </Card>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default ProfilePage;
