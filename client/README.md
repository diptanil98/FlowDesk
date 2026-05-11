# ⚡ FlowDesk — Project & Task Management Platform

> A full-stack project and task management web application built for teams. Manage projects, assign tasks, track progress, and collaborate — all in one place.

![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)
![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)

---

## 🌐 Live Demo

| Service | URL |
|---------|-----|
| 🖥️ Frontend | [flowdesk-production-3f4a.up.railway.app](https://flowdesk-production-3f4a.up.railway.app) |
| ⚙️ Backend API | [flowdesk-production-e1f4.up.railway.app](https://flowdesk-production-e1f4.up.railway.app) |

---

## ✨ Features

### 🔐 Authentication
- JWT-based login & registration
- Secure password hashing with bcrypt
- Auto logout on token expiry
- Protected routes with role-based access

### 👥 Role-Based Access Control

| Feature | Admin | Member |
|---------|-------|--------|
| View all projects | ✅ | ❌ |
| Create projects | ✅ | ❌ |
| Create tasks | ✅ | ❌ |
| Move own tasks | ✅ | ✅ |
| Delete anything | ✅ | ❌ |
| Manage users & roles | ✅ | ❌ |
| Add/remove members | ✅ | ❌ |

### 📋 Project Management
- Create, edit, and delete projects
- Set deadlines with overdue indicators
- Add and remove members from projects
- Project status: Active / Completed / On Hold

### ✅ Task Management
- Create tasks with title, description, priority, due date
- Assign tasks to specific team members
- Filter tasks by status and priority
- Search tasks by keyword

### 🗂️ Kanban Board
- Visual drag-and-drop board
- 3 columns: To Do → In Progress → Completed
- Members can only move their own assigned tasks
- Color-coded priority and status badges

### 📊 Dashboard
- Stats: Total Projects, Tasks, Completed, Pending
- Productivity bar chart (Last 7 Days)
- Recent tasks feed with status

### 🛠️ Admin Panel
- User management table
- Change user roles (Member ↔ Admin)
- Add/remove members from any project

---

## 🧰 Tech Stack

### Frontend
| Tool | Purpose |
|------|---------|
| React 18 + Vite | UI Framework |
| Tailwind CSS | Styling |
| React Router v6 | Navigation |
| Axios | HTTP Client |
| Recharts | Charts & Analytics |
| React Hot Toast | Notifications |

### Backend
| Tool | Purpose |
|------|---------|
| Node.js + Express | Server Framework |
| MongoDB + Mongoose | Database & ODM |
| JWT | Authentication Tokens |
| bcryptjs | Password Hashing |
| CORS | Cross-Origin Requests |

### Deployment
| Service | Purpose |
|---------|---------|
| Railway | Backend + Frontend Hosting |
| MongoDB Atlas | Cloud Database |

---

## 📁 Project Structure

```
FlowDesk/
├── client/                        # React Frontend
│   ├── public/
│   └── src/
│       ├── assets/                # Static assets
│       ├── components/            # Reusable UI components
│       │   ├── EmptyState.jsx
│       │   ├── LoadingSpinner.jsx
│       │   ├── Modal.jsx
│       │   ├── ProtectedRoute.jsx
│       │   └── StatusBadge.jsx
│       ├── context/
│       │   └── AuthContext.jsx    # Auth state management
│       ├── layouts/
│       │   └── Layout.jsx         # Sidebar + Topbar layout
│       ├── pages/
│       │   ├── Admin.jsx
│       │   ├── Dashboard.jsx
│       │   ├── Login.jsx
│       │   ├── ProjectBoard.jsx   # Kanban board
│       │   ├── Projects.jsx
│       │   ├── Register.jsx
│       │   └── Tasks.jsx
│       ├── utils/
│       │   └── api.js             # Axios instance + interceptors
│       ├── App.jsx
│       └── main.jsx
│
└── server/                        # Node.js Backend
    ├── controllers/
    │   ├── adminController.js
    │   ├── authController.js
    │   ├── dashboardController.js
    │   ├── projectBoardController.js
    │   ├── projectController.js
    │   └── taskController.js
    ├── middleware/
    │   ├── auth.js                # JWT verification
    │   └── authorize.js           # Role-based access
    ├── models/
    │   ├── Project.js
    │   ├── Task.js
    │   └── User.js
    ├── routes/
    │   ├── admin.js
    │   ├── auth.js
    │   ├── dashboard.js
    │   ├── projects.js
    │   └── tasks.js
    ├── .env
    ├── index.js
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/diptanil98/FlowDesk.git
cd FlowDesk
```

### 2. Setup Backend

```bash
cd server
npm install
```

Create `.env` file inside `/server`:

```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/flowdesk
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

Start backend:

```bash
npm start
```

### 3. Setup Frontend

```bash
cd client
npm install
```

Create `.env` file inside `/client`:

```env
VITE_API_URL=http://localhost:5000/api
```

Start frontend:

```bash
npm run dev
```

### 4. Open in Browser

```
http://localhost:5173
```

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login user | Public |

### Projects
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/projects` | Get all projects | Auth |
| POST | `/api/projects` | Create project | Admin |
| PUT | `/api/projects/:id` | Update project | Admin |
| DELETE | `/api/projects/:id` | Delete project | Admin |
| GET | `/api/projects/:id/board` | Get kanban board | Auth |

### Tasks
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/tasks` | Get all tasks | Auth |
| POST | `/api/tasks` | Create task | Admin |
| PUT | `/api/tasks/:id` | Update task status | Auth |
| DELETE | `/api/tasks/:id` | Delete task | Admin |

### Dashboard
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/dashboard` | Get stats & recent tasks | Auth |

### Admin
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/admin/users` | Get all users | Admin |
| PUT | `/api/admin/users/:id/role` | Update user role | Admin |
| POST | `/api/admin/projects/:id/members` | Add member | Admin |
| DELETE | `/api/admin/projects/:id/members/:userId` | Remove member | Admin |

---

## 🌍 Deployment

### Backend (Railway)
1. Push code to GitHub
2. Connect repo to Railway → New Service
3. Set root directory → `server`
4. Add environment variables (MONGO_URI, JWT_SECRET)
5. Deploy ✅

### Frontend (Railway)
1. Connect same repo → New Service
2. Set root directory → `client`
3. Build command → `npm run build`
4. Output directory → `dist`
5. Add `VITE_API_URL` → your backend Railway URL + `/api`
6. Deploy ✅

---

## 👤 Author

**Diptanil Sarkar**
- GitHub: [@diptanil98](https://github.com/diptanil98)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">Built with ❤️ by Diptanil Sarkar</p>
