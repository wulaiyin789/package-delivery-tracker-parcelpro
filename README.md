
<p align="center">
  <img src="https://raw.githubusercontent.com/wulaiyin789/package-delivery-tracker-parcelpro/main/frontend/public/logo192.png" alt="Parcel Pro Logo" width="120" />
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
- yarn

1. npm install -g yarn
2. Continue the following steps

### Backend

1. Open terminal
2. cd backend
3. `yarn`
4. Configure `backend/config/db.js` with your MongoDB URI
5. Copy sample env variables or add required keys (JWT secret, DB URL, etc.)

### Frontend

1. open terminal
2. cd frontend
3. `yarn`

## Start for development

### Backend

```bash
cd backend
yarn dev
```

Environment credential is shown on `.env.example`

### Frontend

```bash
cd frontend
yarn dev
```

Open http://localhost:3000 and ensure backend is running (default http://localhost:5001).

## Build production

### Frontend

```bash
cd frontend
npm run build
```

This creates optimized static assets in `frontend/build`.

Use `pm2 serve build/ 3000 "yarn start" --name=frontend --spa` as preferred.

### Backend

```bash
cd backend
yarn start
```

or use `npm run pm2`/`pm2 start "yarn start" --name=backend` as preferred.

## Critical information

- Ensure `backend` and `frontend` use the same API base URL via `frontend/src/axiosConfig.jsx` (default may be `/api` or `http://localhost:5001`)
- MongoDB connection must be valid before server startup.
- If using production, set `NODE_ENV=production` and configure CORS/HTTPS.
- Keep JWT secret safe and do not commit `.env` to Git.

## AWS EC2 instance

i-033f94a1f89795ce9

## Account Info
For testing purpose, the following credential can be used.

```js
// Admin credential
username=test@admin.com
password=ifn636_admin_123456

// Customer credential
username=test@customer.com
password=ifn636_customer_567890
```

## Built by

Wu Lai Yin Peter

---

**GitHub link of the starter project: [https://github.com/wulaiyin789/package-delivery-tracker-parcelpro}**

Assignment: “IFN636 Software Requirements Analysis and Design: LearnWords-English — A Full-Stack CRUD Application with DevOps Practices”