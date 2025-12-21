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

## 📡 API Endpoints Documentation

All routes are prefixed with `/api`.

### 🔐 Auth Module (`/api/auth`)
| Method | Endpoint | Role | Description |
| :--- | :--- | :--- | :--- |
| POST | `/login` | Public | Login and get JWT |
| POST | `/logout` | Auth | Clear session/token |
| POST | `/change-password` | Auth | Change password (logged in) |
| POST | `/forget-password` | Public | Send reset link via email |

### 👤 User Module (`/api/user`)
| Method | Endpoint | Role | Description |
| :--- | :--- | :--- | :--- |
| POST | `/register` | Public | Standard user registration |
| POST | `/create-host` | Super Admin | Admin can create Host accounts |
| GET | `/all-users` | Admin/Super | Get all registered users |
| GET | `/all-hosts` | Admin/Super | Get all host profiles |
| GET | `/me` | Auth | Get current logged-in user profile |
| PATCH| `/update-profile` | Auth | Update profile with image upload |
| PATCH| `/:id` | Super Admin | Update user status/details by Admin |
| GET | `/:id` | Admin/Super | Get specific user by ID |
| DELETE| `/delete-host/:id` | Super Admin | Permanently remove a host |

### 📅 Event Module (`/api/event`)
| Method | Endpoint | Role | Description |
| :--- | :--- | :--- | :--- |
| POST | `/create-event` | Host | Create new event (with image) |
| GET | `/types` | Public | Get available event categories |
| GET | `/all-events` | Public | List all active events |
| GET | `/my-events` | Host | Get events created by logged-in host |
| GET | `/:id` | Public | Detailed event view |
| PATCH| `/my-event/:id` | Host/Super | Edit specific event details |
| DELETE| `/my-event/:id` | Host | Host can delete their own event |
| DELETE| `/:id` | Super Admin | Admin can delete any event |

### 🎟️ Booking Module (`/api/booking`)
| Method | Endpoint | Role | Description |
| :--- | :--- | :--- | :--- |
| POST | `/` | User/Auth | Create a new event booking |
| GET | `/` | Admin/Host | View all bookings in system |
| GET | `/my-bookings` | Auth | View user's personal booking list |

### 💳 Payment Module (`/api/payment`)
| Method | Endpoint | Role | Description |
| :--- | :--- | :--- | :--- |
| POST | `/init-payment/:id` | User | Initialize SSLCommerz gateway |
| POST | `/success` | Public | Payment success callback |
| POST | `/fail` | Public | Payment failure callback |
| POST | `/cancel` | Public | Payment cancel callback |
| GET | `/invoice/:id` | Auth | Download payment invoice URL |
| GET | `/my-payments` | Auth | View personal payment history |
| GET | `/all-payments` | Super Admin | View all system transactions |

### ⭐ Review Module (`/api/review`)
| Method | Endpoint | Role | Description |
| :--- | :--- | :--- | :--- |
| POST | `/create-review` | Auth | Post rating and feedback |
| GET | `/all-reviews` | Public | View all site reviews |
| GET | `/:eventId` | Public | View reviews for a specific event |
| DELETE| `/:id` | Admin/Super | Delete inappropriate reviews |

### 📊 Stats Module (`/api/state`)
| Method | Endpoint | Role | Description |
| :--- | :--- | :--- | :--- |
| GET | `/super-admin` | Super Admin | System-wide analytics |
| GET | `/host` | Host | Stats for specific host's events |
| GET | `/user` | Auth | Personal activity stats |

### 📧 Contact Module (`/api/contact`)
| Method | Endpoint | Role | Description |
| :--- | :--- | :--- | :--- |
| POST | `/send` | Public | Send contact email from website |

---

## ⚙️ Setup Instructions

1. **Clone & Install:**
   ```bash
   git clone <repo-url>
   cd <repo-name>
   npm install