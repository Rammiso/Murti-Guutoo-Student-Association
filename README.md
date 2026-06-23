# 🌐 Murti Guuto Students Association (MGSA) — Digital Campus Hub

> **Empowering Knowledge. Building Unity. Inspiring Growth.**

A full-stack web platform built for **Murti Guuto Students Association (MGSA)** at **Haramaya University** — the ultimate digital hub for students from **East and West Hararghe** to access academic resources, connect with peers, engage with leadership, and stay informed.

---

## 🔥 The Problem

Students at Haramaya University — particularly those from East and West Hararghe — face significant challenges:

- 📚 **Scattered study materials** — handouts, past exams, and notes are hard to find and inconsistently shared
- 🤝 **No centralized communication** — announcements, contact with leadership, and community updates are fragmented across informal channels
- 🖼️ **Lost memories** — event photos and campus moments are shared once and lost forever
- 💸 **No transparent giving** — students who want to give back lack a clear, trusted channel for donations

## 💡 The Solution

**MGSA Website** is a unified, modern digital campus hub that brings everything under one roof:

- **Resource Library** — Upload, organize, and download study materials (PDFs, notes, past exams) by course category with cloud storage
- **Photo Gallery** — Browse campus and event photos with an immersive lightbox experience
- **Student Portal** — Register, manage your profile, and track your academic journey
- **Leadership Team** — Meet the team, find contact info, and stay connected
- **Admin Dashboard** — Manage users, resources, gallery, and messages from a powerful control panel
- **Donation System** — Secure, transparent giving to support fellow students in need

---

## 🚀 Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| **React (Vite)** | Fast, modern UI framework |
| **Tailwind CSS** | Utility-first styling |
| **Framer Motion** | Smooth animations & transitions |
| **React Router v6** | Client-side routing |
| **Lucide Icons** | Clean, consistent iconography |
| **Axios** | HTTP client with interceptors |

### Backend
| Technology | Purpose |
|-----------|---------|
| **Node.js + Express** | RESTful API server |
| **MongoDB (Atlas)** | NoSQL cloud database |
| **Mongoose** | Elegant MongoDB ODM |
| **JWT** | Secure authentication |
| **Cloudinary** | Cloud file & image storage |
| **Multer** | File upload handling |
| **Joi** | Request validation |
| **Bcrypt.js** | Password hashing |

### Deployment
- **Frontend:** Vercel
- **Backend:** Render

---

## ✨ Core Features

### 🧑‍🎓 Student Portal
- Register & login with JWT-based authentication
- Profile management with photo upload
- Role-based access (Student / Admin)

### 📚 Resource Library
- Upload study materials (PDF, DOCX, PPT, ZIP, images)
- Cloudinary cloud storage (≤10MB direct, >10MB via UploadThing)
- Browse & filter by course category (Mathematics, Physics, English, Geography, Psychology, Economics, Logic, CoC)
- **Public browsing** — anyone can view resources
- **Login required** to download materials

### 🖼️ Photo Gallery
- Immersive grid layout with lazy-loaded images
- Lightbox modal with keyboard navigation & touch swipe
- Title & date displayed on each image
- **Open to everyone** — no login needed to browse
- Admins can upload & manage images

### 💬 Contact & Communication
- Contact form for inquiries, suggestions, or support
- Messages stored and managed in the admin dashboard
- Direct Telegram integration

### 🧑‍💼 Admin Dashboard
- Manage users — promote to admin, view details
- Moderate resources — approve or delete uploads
- Manage gallery — upload & remove images
- View & respond to contact messages
- Export user data to Excel

### 💰 Donations
- Secure donation form for community contributions
- Transparent payment tracking
- Admin panel to monitor donations

---

## 🎨 Design Language

> **Theme:** Futuristic Dark Neon — a glowing, immersive experience

- 🌑 Dark backgrounds with neon green (`#22C55E`) accents
- ✨ Animated particle backgrounds & gradient orbs
- 🎬 Smooth page transitions & micro-animations with Framer Motion
- 📱 Fully responsive — mobile, tablet, desktop
- 🔲 Glassmorphism cards with backdrop blur
- 💡 Glowing hover effects & shadow accents

---

## 🧩 Project Structure

```
mgsa-website/
├── frontend/                    # React + Vite app
│   ├── src/
│   │   ├── api/                 # API service modules
│   │   ├── assets/              # Images & static files
│   │   ├── components/          # Reusable UI components
│   │   ├── context/             # Auth context provider
│   │   ├── hooks/               # Custom React hooks
│   │   ├── pages/               # Page components
│   │   └── utils/               # Helpers & constants
│   └── ...
├── backend/                     # Node + Express API
│   ├── config/                  # Cloudinary, DB config
│   ├── middleware/              # Auth, upload, validation
│   ├── models/                  # Mongoose schemas
│   ├── routes/                  # API route handlers
│   └── server.js                # Entry point
└── README.md
```

---

## 🛠️ Local Setup

### Prerequisites
- Node.js ≥ 18
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account

### 1. Clone the repo
```bash
git clone https://github.com/Rammiso/Murti-Guutoo-Student-Association.git
cd Murti-Guutoo-Student-Association
```

### 2. Install dependencies
```bash
# Frontend
cd mgsa-frontend && npm install

# Backend
cd ../backend && npm install
```

### 3. Configure environment variables

**Backend** (`backend/.env`):
```
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Frontend** (`mgsa-frontend/.env`):
```
VITE_API_URL=http://localhost:5000/api
```

### 4. Run the development servers
```bash
# Backend (from backend/)
npm run dev

# Frontend (from mgsa-frontend/)
npm run dev
```

The frontend will be available at `http://localhost:5173` and the backend at `http://localhost:5000`.

---

## 🧠 Vision & Mission

**Vision:**  
To produce capable, responsible, and united students who contribute positively to their community.

**Mission:**  
To empower Haramaya University students through education, mentorship, and service — ensuring that no student is left behind.

---

## 🌟 Why MGSA Website?

| For Students | For Leaders | For the Community |
|-------------|-------------|-------------------|
| Free access to study materials | Centralized management dashboard | Transparent donation system |
| Connect with leadership team | User & content moderation | Event photo archive |
| Profile & academic tracking | Data export & analytics | Contact & feedback channel |
| Stay updated with announcements | Role-based access control | Open & inclusive platform |

---

## 👨‍💻 Developer Team

The passionate team of developers who brought this project to life:

| Name | Role | Portfolio |
|------|------|-----------|
| **Musab Hassen** | Lead Developer — Frontend & Backend | — |
| **Yihune Belay** | Full-Stack Developer | [Portfolio](https://yihunebelayportfolio.onrender.com) |
| **Ezedin Aliyi** | Full-Stack Developer | — |
| **Sultan Adinan** | Frontend & Backend Developer | — |
| **Nadhi Jemal** | Frontend & Backend Developer | — |
| **Gifti Hussein** | Frontend & Backend Developer | — |

Built with ❤️ by the MGSA Developer Team at Haramaya University.

---

## 🤝 Leadership Team

| Role | Name |
|------|------|
| President | Anes Mohammed |
| Vice President | Abdunasir Ahmed |
| Secretary | Yonas Shemekit |
| Female Affairs Head | Hawi Ahmed |
| Auditor Head | Firomsa Abduraman |
| Public Relation Affairs Head | Obsaa Mohammed |
| Academic Affairs Head | Ezedin Aliyi |
| Financial & Charity Affairs Head | Mahdi Jemal |

---

## 📜 License

Released under the **MIT License**.  
© 2025 Murti Guuto Students Association (MGSA)

---

## ⭐ Support

If this project empowers you or your community, **give it a star ⭐ on GitHub** and share it with your friends.  

> *Together, let's empower more students. One resource, one connection, one step at a time.*

---

**🌐 Live Site:** [murti-guutoo-student-association.vercel.app](https://murti-guutoo-student-association.vercel.app)  
**📧 Contact:** MGSA Team — Haramaya University  
**🐛 Report Issues:** [GitHub Issues](https://github.com/Rammiso/Murti-Guutoo-Student-Association/issues)
