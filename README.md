🩺 Doctor Consultancy Platform - Technical Specification
Version: 1.0
Status: Prototype (End-to-End Working)
Stack: MERN + RTK Query + ZegoCloud + Razorpay

## 1. Executive Summary

The Doctor Consultancy Platform is a full-stack telemedicine application facilitating secure, remote medical consultations. It acts as a two-sided marketplace connecting Patients (seeking medical advice) with Doctors (managing appointments and prescriptions). The platform handles the entire lifecycle: onboarding, discovery, scheduling, payments, real-time video consultation, and post-consultation prescription management.

## 2. System Architecture

### 2.1 Tech Stack

| Layer            | Technology        | Key Libraries/Features                               |
| ---------------- | ----------------- | ---------------------------------------------------- |
| Frontend         | React (Vite)      | TailwindCSS, ShadCN, Framer Motion, React Router     |
| State Management | Redux Toolkit     | RTK Query (Caching, Invalidation), Role-based Slices |
| Backend          | Node.js + Express | REST API, Middleware Chains                          |
| Database         | MongoDB           | Mongoose ORM                                         |
| Authentication   | JWT               | HttpOnly Cookies (Security First - No LocalStorage)  |
| Video Services   | ZegoCloud SDK     | Real-time Audio/Video, Token generation              |
| Payments         | Razorpay SDK      | Order creation, Verification, Platform fee logic     |

### 2.2 Security Architecture

Token Storage: Strict usage of HttpOnly cookies to prevent XSS attacks.

Route Guards (Frontend):

- PublicAuthGuard : Redirects logged-in users away from login/register.
- DashboardAuthGuard : Protects private routes.
- HomeGuard : Redirects based on role (Doctor vs Patient).
- OnBoardingGuard : Enforces profile completion before dashboard access.

API Security: Role-based middleware checks on backend routes.

---

## 3. Core Functional Modules

### 3.1 Authentication & Onboarding

The system treats Doctors and Patients as distinct entities with separate data models.

Doctor Onboarding:
Phase 1: Account Creation (Email/Password).
Phase 2 (Profile): Personal details, Hospital/Clinic info, Specialization, Categories, Consultation Fees.
Phase 3 (Availability): Date range definition, Daily time range, Slot duration (e.g., 30 mins).

Patient Onboarding:
Phase 1: Account Creation.
Phase 2 (Profile): Medical history, Emergency contact details.

---

### 3.2 Appointment Scheduling Engine

This is the core logic of the application.

1. Slot Generation: The backend dynamically calculates available time slots based on:

- availabilityRange (Start/End Date)
- dailyTimeRange (Start/End Time)
- slotDurationMinutes
- excludedWeekdays

2. Filtering & Search:
   Patients can filter doctors by Category, Specialization, City, Experience, and Sort by Fees.

3. Booking Logic:
   Users select a date (Backend validates against availability).
   Users select a time slot (Backend checks BookedSlots collection).
   Past times are automatically disabled for same-day bookings.

---

### 3.3 Payment Gateway (Razorpay)

1. Order Creation: Total amount calculated.
2. Platform Fee: A percentage is calculated/deducted (logic handles platform commission).
3. Verification: Backend verifies the Razorpay signature.
4. Confirmation: Appointment status moves to Scheduled only after successful verification.

---

### 3.4 Live Consultation (ZegoCloud)

Trigger: "Join Call" button becomes active at the scheduled time.
Access: Guarded by join token. Only the specific Doctor and Patient can enter the room.
Media: Supports High-Definition Video and Voice-only modes.

---

### 3.5 Prescription System

Post-Call: Doctor accesses a prescription form.
Data Fields: Medicines, Dosage, Instructions, Clinical Notes.
Output: Saved to database; visible in Patient's dashboard history.

---

## 4. API Reference

### 4.1 Authentication

| Method | Endpoint          | Description                   |
| ------ | ----------------- | ----------------------------- |
| POST   | /doctor/register  | Create Doctor account         |
| POST   | /doctor/login     | Authenticate Doctor           |
| POST   | /patient/register | Create Patient account        |
| POST   | /patient/login    | Authenticate Patient          |
| POST   | /logout           | Clear HttpOnly cookies        |
| GET    | /me               | Retrieve current user context |

---

### 4.2 Doctor Operations

| Method | Endpoint           | Description                              |
| ------ | ------------------ | ---------------------------------------- |
| PUT    | /doctor/onboarding | Update profile and availability settings |
| GET    | /doctor/list       | Retrieve doctors with filters/search     |
| GET    | /doctor/:id        | Public profile for a specific doctor     |
| GET    | /doctor/dashboard  | Aggregated stats for doctor dashboard    |

---

### 4.3 Appointment Operations

| Method | Endpoint                | Description                           |
| ------ | ----------------------- | ------------------------------------- |
| GET    | /doctor/:id/slots/:date | Get calculated available/booked slots |
| POST   | /appointment/book       | Initialize booking process            |
| GET    | /appointment/doctor     | List appointments (Doctor View)       |
| GET    | /appointment/patient    | List appointments (Patient View)      |
| GET    | /appointment/:id        | Single appointment details            |
| POST   | /appointment/:id/join   | Generate ZegoCloud token              |
| POST   | /appointment/:id/end    | Submit prescription and close case    |
| PATCH  | /appointment/:id        | Status updates (Cancel/Reschedule)    |

---

### 4.4 Payments

| Method | Endpoint              | Description                          |
| ------ | --------------------- | ------------------------------------ |
| POST   | /payment/create-order | Generate Razorpay Order ID           |
| POST   | /payment/verify       | Verify signature and confirm booking |

---

## 5. State Management Strategy (Redux + RTK Query)

The frontend relies heavily on RTK Query for efficient data handling.

Caching & Invalidation:

Tag: Appointment : Invalidated upon Booking, Cancellation, or Completion. Triggers re-fetch of Dashboard and History lists.

Tag: BookedSlots : Invalidated immediately after a successful payment/booking to prevent double-booking for other users viewing the same doctor.

Tag: User : Invalidated on Profile Update/Onboarding completion.

---

## 6. Future Roadmap

[ ] Reviews System: Rating logic for Doctors.
[ ] Refund Handling: Automated webhooks for failed/cancelled consultations.
[ ] Multi-Doctor Clinics: Hierarchical account management.
[ ] Notifications: SMS/Email integration via Twilio/SendGrid.
[ ] Calendar UI: Visual calendar for availability management (Drag & Drop)
