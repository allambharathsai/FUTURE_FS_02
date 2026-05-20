# Client Lead Management System

A complete MERN stack mini CRM for managing client leads, follow-up notes, status changes, dashboard metrics, CSV exports, dark mode, and lead analytics.

## Tech Stack

- Frontend: React.js, Bootstrap, React Router, Axios, Chart.js
- Backend: Node.js, Express.js, JWT, Mongoose
- Database: MongoDB
- Authentication: JWT bearer token authentication

## Project Structure

```text
client-lead-management/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.js
│   │   └── index.js
└── README.md
```

## Setup

### 1. Database

The app uses MongoDB when `MONGO_URI` is reachable. If MongoDB Atlas/local MongoDB is unavailable, the backend automatically falls back to a local JSON file database at `backend/data/db.json`, so you can still run and test the CRM.

To use MongoDB, run MongoDB locally or update `backend/.env` with a MongoDB Atlas connection string.

Local MongoDB example:

```bash
mongod
```

### 2. Configure Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

The backend starts at `http://localhost:5000`.

On Windows PowerShell, use `Copy-Item .env.example .env` instead of `cp .env.example .env` if `cp` is not available.

Default seeded admin:

- Email: `admin@example.com`
- Password: `Admin@12345`

Change these values in `backend/.env` before deploying.

### 3. Configure Frontend

Open a second terminal:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

The frontend starts at `http://localhost:5173`.

On Windows PowerShell, use `Copy-Item .env.example .env` instead of `cp .env.example .env` if needed.

## API Endpoints

Authentication:

- `POST /api/auth/login`

Leads:

- `GET /api/leads`
- `GET /api/leads/:id`
- `POST /api/leads`
- `PUT /api/leads/:id`
- `DELETE /api/leads/:id`
- `PUT /api/leads/status/:id`
- `GET /api/leads/stats/summary`

All lead endpoints require:

```http
Authorization: Bearer <jwt_token>
```

## Lead Fields

- `name`
- `email`
- `phone`
- `source`: Website, LinkedIn, Instagram, Referral, Other
- `status`: New, Contacted, Converted
- `notes`
- `createdAt`

## Production Notes

- Replace `JWT_SECRET` with a long random secret.
- Use a managed MongoDB URI in `MONGO_URI`.
- Set `CLIENT_URL` to the deployed frontend origin.
- Build the frontend with `npm run build`.
- Run the backend with `npm start` behind a process manager such as PM2 or a hosting platform runtime.
