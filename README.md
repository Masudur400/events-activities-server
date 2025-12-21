# Event & Entertainment Management System (Backend API)

This is the robust RESTful API that powers the Event & Entertainment platform. Built with **Node.js**, **Express**, and **TypeScript**, it handles everything from secure authentication and role-based access control to complex event bookings and payment processing.

## 🔗 Project Links
* **Live API Base URL:** [https://events-activities-server.vercel.app](https://events-activities-server.vercel.app)
* **Frontend Repository:** [https://github.com/Masudur400/events-activities-client](https://github.com/Masudur400/events-activities-client)

---

## 🛠 Tech Stack

* **Runtime:** Node.js
* **Framework:** Express.js
* **Language:** TypeScript
* **Database:** MongoDB with Mongoose (ODM)
* **Authentication:** JWT (JSON Web Tokens)
* **File Handling:** Multer & Cloudinary (Image Uploads)
* **Payment Gateway:** SSLCommerz
* **Security:** CORS, Dotenv, Bcrypt

---

## 🌟 Key Features

### 1. Authentication & Security
* **JWT Auth:** Secure stateless authentication.
* **Password Recovery:** Fully functional "Forgot Password" and "Reset Password" system via secure tokens.
* **Role-Based Access Control (RBAC):** Strict middleware for **User**, **Host**, and **Admin** roles.

### 2. Event Management
* **Host Capabilities:** Hosts can create, update, and manage their own events.
* **Media Support:** Image uploads directly to **Cloudinary** using Multer.
* **Public Access:** Public APIs for browsing and searching events without login.

### 3. Booking & Payments
* **Seamless Booking:** Real-time event booking logic.
* **Payment Integration:** Integrated with **SSLCommerz** for secure transactions.
* **Payment Status:** Automatic payment success/failure/cancel handling.

### 4. Reviews & Ratings
* Authenticated users can leave ratings and reviews for events.
* Average rating calculation for each event.

### 5. Administrative Control
* Manage all users, hosts, and events.
* Overview of all bookings, payment history, and site-wide reviews.

---

### 📡 API Endpoints (Quick Overview)
---
# 🔐 Authentication
/Endpoint,                    Method,        Role,         Description
/api/user/register,           POST,          Public,       New account registration (User)
/api/user/create-host         POST           Private       Create Host By Admin
/api/auth/login,              POST,          Public,       Login and receive JWT access token
/api/auth/forget-password,    POST,          Public,       Send password  
/api/auth/change-password,    PATCH,         Private,      Change password while logged in
---
# 👤 User Profile
Endpoint,                   Method,       Role,       Description
/api/user/me,               GET,          Private,    Get current logged-in user details
/api/user/update-profile,   PATCH,        Private,    Update profile info (with Image upload)
---
# 📅 Events
Endpoint,                Method,    Role,               Description
/api/event/create-event, POST       Host                Create a new event (Multer/Cloudinary)
/api/event/all-events,   GET,       Public,             Get all events (with filtering & search)
/api/event/:id,          GET,       Public,             Get single event details 
/api/event/:id,          PATCH,     Host/Admin,         Update event details
/api/event/:id,          DELETE,    Host/Admin,         Delete an event
/api/event/my-events,    GET,       Host,               Get events created by the logged-in host
---
# Bookings & Payments (SSLCommerz)
Endpoint,                  Method,       Role,      Description
/api/booking,              POST,         User,      Initialize booking and payment process
/api/booking/success,      POST,         Public,    SSLCommerz payment success callback
/api/booking/fail,         POST,         Public,    SSLCommerz payment failure callback
/api/booking/cancel,       POST,         Public,S   SLCommerz payment cancellation callback
/api/booking/my-bookings,  GET,          User,      Get booking history for current user
---
# ⭐ Reviews & Ratings
Endpoint,                   Method,      Role,       Description
/api/review/create-review,  POST,        User,       Add a review and rating for an event
/api/review/all-reviews     GET          admin       Review Can manage
/api/review/:eventId,       GET,         Public,     Get all reviews for a specific event
--- 