
<p align="center">
  <img src="https://raw.githubusercontent.com/wulaiyin789/ifn636-web/master/frontend/public/logo192.png" alt="Parcel Pro Logo" width="120" />
</p>

<h1 align="center">Parcel Pro - Shipping & Tracking System</h1>

## Description

A full-stack universal shipping and package tracking web application featuring user authentication, package lifecycle management, real-time update tracking, and admin control. Built with Node.js + Express backend, MongoDB data storage, and React frontend.

## Features

- User registration and login (JWT-based auth)
- Role-based access: customer, courier, admin
  - Create: Create User
  - Read: Fetch user data from database
  - Update: Activate or Deactivate user account (Soft delete)
  - Delete: Delete a user completely
- Create and manage shipments
  - Create: Create Shipment
  - Read: Fetch shipment details from database
  - Update: Update shipment details
  - Delete: Delete shipment and relevant data
- Update tracking status, history, location
  - Create: Create Tracking on backend
  - Read: Fetch tracking based on trackingId (Public)
  - Update: Update tracking status
  - Delete: Delete tracking data on backend
- View package delivery progress
- Admin user management and shipment oversight
- API-driven architecture with frontend and backend separation

## Future improvements
- Add real-time notification (Underlying schema is built)
- Pagination for table (Underlying backend is built)

## Setup

### Prerequisites

- Node.js 22.x or later
- npm 11.x or later
- MongoDB (local or Atlas)

### Backend

1. Open terminal
2. cd backend
3. `npm install`
4. Configure `backend/config/db.js` with your MongoDB URI
5. Copy sample env variables or add required keys (JWT secret, DB URL, etc.)

### Frontend

1. open terminal
2. cd frontend
3. `npm install`

## Start for development

### Backend

```bash
cd backend
npm run dev
```

### Frontend

```bash
cd frontend
npm run dev
```

Open http://localhost:3000 and ensure backend is running (default http://localhost:5001).

## Build production

### Frontend

```bash
cd frontend
npm run build
```

This creates optimized static assets in `frontend/build`.

### Backend

```bash
cd backend
npm run start
```

or use `npm run pm2`/`pm2 start server.js` as preferred.

## Critical information

- Ensure `backend` and `frontend` use the same API base URL via `frontend/src/axiosConfig.jsx` (default may be `/api` or `http://localhost:5001`)
- MongoDB connection must be valid before server startup.
- If using production, set `NODE_ENV=production` and configure CORS/HTTPS.
- Keep JWT secret safe and do not commit `.env` to Git.

## Built by

Peter Wu (Student No.)

---

**GitHub link of the starter project: [https://github.com/wulaiyin789/ifn636-web}**

Assignment: “Software Requirements Analysis and Design: LearnWords-English — A Full-Stack CRUD Application with DevOps Practices”