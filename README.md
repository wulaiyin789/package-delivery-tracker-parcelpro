<p align="center">
  <img src="https://raw.githubusercontent.com/wulaiyin789/package-delivery-tracker-parcelpro/main/frontend/public/logo192.png" alt="Parcel Pro Logo" width="120" />
</p>
<h1 align="center">Parcel Pro - Shipping & Tracking System</h1>

## 📖 Description

A full-stack universal shipping and package tracking web application featuring user authentication, package lifecycle management, real-time update tracking, and admin control. Built with a Node.js + Express backend, MongoDB data storage, and a React frontend.

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| Axios | HTTP client / API communication |
| React Router | Client-side routing |
| Yarn | Package manager |
| PM2 (`serve`) | Production static file server |

### Backend
| Technology | Purpose |
|---|---|
| Node.js 22.x | JavaScript runtime |
| Express.js | REST API framework |
| MongoDB | NoSQL database |
| Mongoose | ODM for MongoDB |
| JSON Web Token (JWT) | Authentication & authorisation |
| dotenv | Environment variable management |
| Yarn | Package manager |
| PM2 | Production process manager |

### DevOps & Infrastructure
| Technology | Purpose |
|---|---|
| GitHub Actions | CI/CD pipeline |
| AWS EC2 | Cloud compute (self-hosted runner) |
| PM2 | Process management & auto-restart |
| dotenv / GitHub Secrets | Secrets & environment management |

---

## ✨ Features

- User registration and login (JWT-based auth)
- Role-based access: customer, courier, admin
  - **Create:** Create User
  - **Read:** Fetch user data from database
  - **Update:** Activate or Deactivate user account (Soft delete)
  - **Delete:** Delete a user completely
- Create and manage shipments
  - **Create:** Create Shipment
  - **Read:** Fetch shipment details from database
  - **Update:** Update shipment details
  - **Delete:** Delete shipment and relevant data
- Update tracking status, history, and location
  - **Create:** Create Tracking on backend
  - **Read:** Fetch tracking based on trackingId (Public)
  - **Update:** Update tracking status
  - **Delete:** Delete tracking data on backend
- View package delivery progress
- Admin user management and shipment oversight
- API-driven architecture with frontend and backend separation

---

## 🚀 Future Improvements

- Add real-time notification (underlying schema is built)
- Pagination for table (underlying backend is built)

---

## ⚙️ Setup

### Prerequisites

- Node.js 22.x or later
- npm 11.x or later
- MongoDB (local or Atlas)
- Yarn

```bash
npm install -g yarn
```

### Backend

1. Open terminal
2. `cd backend`
3. Run `yarn`
4. Configure `backend/config/db.js` with your MongoDB URI
5. Copy sample env variables or add required keys (JWT secret, DB URL, etc.)

### Frontend

1. Open terminal
2. `cd frontend`
3. Run `yarn`

---

## 🧑‍💻 Start for Development

### Backend
```bash
cd backend
yarn dev
```

Environment credentials are shown in `.env.example`.

### Frontend
```bash
cd frontend
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) and ensure the backend is running (default: [http://localhost:5001](http://localhost:5001)).

---

## 🏗️ Build for Production

### Frontend
```bash
cd frontend
npm run build
```

This creates optimised static assets in `frontend/build/`. Use PM2 to serve them:

```bash
pm2 serve build/ 3000 --name "frontend" --spa
```

### Backend
```bash
cd backend
yarn start
# or
pm2 start "yarn start" --name "backend"
```

---

## 🔄 CI/CD Pipeline

This project uses **GitHub Actions** with an **AWS EC2 self-hosted runner** and **PM2** for automated deployment on every push or pull request to the `main` branch.


### Step-by-Step Breakdown

**1. Trigger**
The pipeline fires on any `push` or `pull_request` targeting the `main` branch.

**2. Runner**
Jobs run on `aws-self-hosted` — your EC2 instance running the GitHub Actions runner agent. This means deployment happens directly on the production/staging server without any SSH or SCP steps.

**3. Secrets Management**
GitHub Actions Secrets (`MONGO_URI`, `JWT_SECRET`, `PORT`, `PROD`) are injected as environment variables at runtime. The `PROD` secret contains the full contents of the production `.env` file and is written to `backend/.env` during deployment.

**4. PM2 Process Management**
PM2 runs as a persistent process manager on EC2:
- All existing processes are stopped and deleted before each deployment to ensure a clean state.
- After install/build/test, PM2 spawns fresh `backend` and `frontend` processes.
- A final `pm2 restart all` ensures both services are live.

**5. Adding a New Secret**
- Go to your GitHub repo → **Settings** → **Secrets and variables** → **Actions**
- Add the secret, then reference it in `ci.yml` as `${{ secrets.YOUR_SECRET_NAME }}`
- Inject it via the `env:` block on the relevant step

### GitHub Actions Workflow File

The full pipeline is defined in `.github/workflows/ci.yml`. Key sections:

```yaml
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: [aws-self-hosted]
    environment: MONGO_URI
```

> **Note:** The `environment: MONGO_URI` line scopes the job to the `MONGO_URI` GitHub environment, which can have its own protection rules and additional secrets.

---

## ⚠️ Critical Information

- Ensure `backend` and `frontend` use the same API base URL via `frontend/src/axiosConfig.jsx` (default may be `/api` or `http://localhost:5001`)
- MongoDB connection must be valid before server startup
- If using production, set `NODE_ENV=production` and configure CORS/HTTPS
- **Never commit `.env` to Git** — keep your JWT secret safe

---

## ☁️ AWS EC2 Instance

```
Instance ID: i-033f94a1f89795ce9
```

---

## 🔑 Account Info (Testing)

```js
// Admin credential
username = "test@admin.com"
password = "ifn636_admin_123456"

// Customer credential
username = "test@customer.com"
password = "ifn636_customer_567890"
```

---

## 👷 Built By

**Wu Lai Yin Peter**

---

**🔗 GitHub: [package-delivery-tracker-parcelpro](https://github.com/wulaiyin789/package-delivery-tracker-parcelpro)**

> Assignment: *IFN636 Software Requirements Analysis and Design: LearnWords-English — A Full-Stack CRUD Application with DevOps Practices*