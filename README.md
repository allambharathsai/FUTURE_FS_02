# Client Lead Management System (Mini CRM)

![React](https://img.shields.io/badge/Frontend-React.js-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Build-Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/API-Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

## 📌 Project Overview

The **Client Lead Management System (Mini CRM)** is a full-stack web application designed to help businesses efficiently manage and track customer leads throughout the sales process.

The system allows administrators to securely manage incoming leads, update their progress, maintain follow-up records, and monitor conversion performance through an interactive dashboard.

This project was developed as part of the **Future Interns - Full Stack Web Development Internship** for **Task 2**.

## 🧩 Problem Statement

Businesses often receive customer inquiries through websites, social media, and referrals. Managing these leads manually using spreadsheets can be inefficient, time-consuming, and error-prone.

This CRM application provides a centralized platform where administrators can:

- Store customer lead information
- Track lead status
- Manage follow-up notes
- Monitor conversions
- Analyze lead performance

## ✨ Key Features

### 🔐 Authentication & Security

- Secure Admin Login
- JWT-based Authentication
- Password hashing using bcrypt
- Protected Routes
- Session Management

### 👥 Lead Management

- Add New Leads
- View Lead Details
- Edit Existing Leads
- Delete Leads
- Search Leads
- Filter Leads by Status
- Export Leads as CSV

### 🔄 Lead Tracking Workflow

```text
New -> Contacted -> Converted
```

| Status | Description |
| --- | --- |
| New | Customer has shown interest in the business |
| Contacted | Admin has communicated with the customer |
| Converted | Customer has successfully become a client |

### 📊 Dashboard Analytics

- Total Leads
- New Leads Count
- Contacted Leads Count
- Converted Leads Count
- Conversion Rate
- Status Distribution Charts
- Lead Source Analytics

### 📝 Lead Information

Each lead contains:

- Name
- Email Address
- Phone Number
- Lead Source
- Lead Status
- Follow-up Notes
- Created Date
- Updated Date

## 🛠️ Technology Stack

| Layer | Technologies |
| --- | --- |
| Frontend | React.js, Vite, JavaScript, CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | JWT, bcrypt |
| Additional Libraries | Axios, React Router, Chart.js, Bootstrap, Lucide React |

## 🚀 Skills Demonstrated

- Full Stack Web Development
- REST API Development
- CRUD Operations
- Authentication & Authorization
- MongoDB Database Management
- State Management
- Responsive Web Design
- Business Workflow Automation
- Dashboard and Analytics Implementation

## 🌍 Real-World Use Case

This CRM system can be used by:

- Web Development Agencies
- Digital Marketing Companies
- Freelancers
- Startups
- Educational Institutions
- Real Estate Businesses

It helps teams manage customer inquiries, track communication, and improve lead conversion efficiency.

## 🎯 Project Outcome

This project demonstrates how a modern CRM system helps businesses organize client information, streamline communication, track customer interactions, and convert potential leads into paying customers through a structured workflow.

## ✅ Features

- Admin Authentication
- Lead Management CRUD
- Lead Status Tracking
- Dashboard Analytics
- Search and Filter
- CSV Export
- Dark Mode
- Responsive User Interface

## ⚙️ Installation

### 1. Clone Repository

```bash
git clone https://github.com/allambharathsai/FUTURE_FS_02.git
cd FUTURE_FS_02
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Configure Backend Environment

Create a `.env` file inside the `backend` folder using `.env.example` as reference.

```bash
cp .env.example .env
```

For Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Update the environment variables such as:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
```

### 4. Start Backend Server

```bash
npm run dev
```

The backend server will run at:

```text
http://localhost:5000
```

### 5. Install Frontend Dependencies

Open a new terminal:

```bash
cd frontend
npm install
```

### 6. Configure Frontend Environment

Create a `.env` file inside the `frontend` folder using `.env.example` as reference.

```bash
cp .env.example .env
```

For Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Example frontend environment:

```env
VITE_API_URL=http://localhost:5000/api
```

### 7. Start Frontend Application

```bash
npm run dev
```

The frontend application will run at:

```text
http://localhost:5173
```

## 🔑 Default Admin Login

```text
Email: admin@example.com
Password: Admin@12345
```

## 📁 Project Structure

```text
FUTURE_FS_02/
|-- backend/
|   |-- config/
|   |   |-- db.js
|   |   |-- store.js
|   |-- controllers/
|   |   |-- authController.js
|   |   |-- leadController.js
|   |-- middleware/
|   |   |-- authMiddleware.js
|   |   |-- errorMiddleware.js
|   |-- models/
|   |   |-- Lead.js
|   |   |-- User.js
|   |-- routes/
|   |   |-- authRoutes.js
|   |   |-- leadRoutes.js
|   |-- data/
|   |-- package.json
|   |-- server.js
|
|-- frontend/
|   |-- src/
|   |   |-- components/
|   |   |   |-- Layout.js
|   |   |   |-- Loading.js
|   |   |   |-- ProtectedRoute.js
|   |   |   |-- StatusBadge.js
|   |   |-- pages/
|   |   |   |-- Dashboard.js
|   |   |   |-- LeadDetails.js
|   |   |   |-- LeadForm.js
|   |   |   |-- Leads.js
|   |   |   |-- Login.js
|   |   |-- services/
|   |   |   |-- api.js
|   |   |   |-- AuthContext.js
|   |   |   |-- leadService.js
|   |   |-- App.js
|   |   |-- index.js
|   |   |-- styles.css
|   |-- index.html
|   |-- package.json
|   |-- vite.config.js
|
|-- .gitignore
|-- README.md
```

## 🖼️ Screenshots

### Login Page Screenshot

> Add login page screenshot here.

### Dashboard Screenshot

> Add dashboard screenshot here.

### Lead Management Screenshot

> Add lead management page screenshot here.

### Lead Details Screenshot

> Add lead details page screenshot here.

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/auth/login` | Admin login |

### Leads

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/leads` | Get all leads |
| GET | `/api/leads/:id` | Get single lead details |
| POST | `/api/leads` | Create a new lead |
| PUT | `/api/leads/:id` | Update lead information |
| DELETE | `/api/leads/:id` | Delete a lead |
| PUT | `/api/leads/status/:id` | Update lead status |
| GET | `/api/leads/stats/summary` | Get lead analytics |

Protected routes require:

```http
Authorization: Bearer <jwt_token>
```

## 🏢 Internship Information

| Field | Details |
| --- | --- |
| Organization | Future Interns |
| Track | Full Stack Web Development |
| Task Number | Task 2 |
| Project | Client Lead Management System (Mini CRM) |
| Repository | FUTURE_FS_02 |

## 📄 License

This project is created for internship and educational purposes.

## 👨‍💻 Author

**Allam Bharath Sai**

GitHub: [allambharathsai](https://github.com/allambharathsai)
