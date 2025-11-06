# 🌍 Murti Guuto Students Association (MGSA) Website

A modern, elegant, and fully responsive **MERN full-stack platform** built for the **Murti Guuto Students Association (MGSA)** of **Haramaya University**.  
This website connects students, provides academic resources, and showcases the association’s mission, leadership, and gallery.

---

## 🚀 Project Overview

The **MGSA Website** allows students to:

- Register and log in securely
- Access categorized study materials and past exams
- Connect with peers from East & West Hararghe zones
- View the association’s mission, leadership, and gallery
- Upload and share academic resources (coming soon)
- Enjoy a futuristic, student-centered, and fully responsive UI

> Designed and developed with **Cascade AI in Windsurf IDE**, featuring modern animations, stylish gradients, and futuristic visual effects.

---

## 🖥️ Tech Stack

### 🧩 **Frontend**

- ⚛️ **React (Vite)**
- 💨 **Tailwind CSS**
- 🎞️ **Framer Motion** — smooth animations
- 🔐 **React Router v6** — routing + protected pages
- 🌗 **Dark/Futuristic Theme System**
- 💫 **Lucide React Icons**

### 🧠 **Backend** (in development)

- 🟢 Node.js + Express.js
- 🍃 MongoDB + Mongoose
- 🔑 JWT Authentication
- ☁️ Cloud Storage for uploads (TBD)

---

## 📁 Folder Structure

mgsa-frontend/
│
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
│
└── src/
├── App.jsx
├── main.jsx
├── assets/
│ ├── logo.png
│ └── gallery/
│
├── components/
│ ├── Navbar.jsx
│ ├── Footer.jsx
│ ├── ProtectedRoute.jsx
│ ├── ResourceCard.jsx
│ └── LeadershipCard.jsx
│
├── context/
│ └── AuthContext.jsx
│
├── pages/
│ ├── Home.jsx
│ ├── About.jsx
│ ├── Resources.jsx
│ ├── Gallery.jsx
│ ├── Contact.jsx
│ ├── Login.jsx
│ ├── Register.jsx
│ └── Profile.jsx
│
└── data/
└── dummyData.js

---

## 🔐 Authentication Logic (Frontend Mock)

The current version uses **mock authentication** (frontend-only) for testing:

- Login and Registration validation
- Context-based session handling
- Protected routes using `<ProtectedRoute>`
- Auto redirect to `/login` if user not authenticated
- Easy upgrade to real JWT-based backend later

---

## 🌟 Key Features

| Category                     | Description                                             |
| ---------------------------- | ------------------------------------------------------- |
| 💻 **Responsive UI**         | Futuristic, elegant, mobile-first layout                |
| 🔒 **Protected Routes**      | Gallery, Contact & Resources require login              |
| 🖼️ **Dynamic Gallery**       | 100+ photos in a scrollable grid with overlay captions  |
| 📂 **Upload Resources**      | Upload course files (max 30MB, with category selection) |
| 👤 **Leadership Board**      | Styled profiles with hover & border effects             |
| ⚙️ **Auth Context**          | Mock authentication with easy backend integration       |
| 🌌 **Particles & Animation** | Futuristic motion effects via Framer Motion             |
| 🧭 **Mission & Features**    | Animated sections with glowing gradient cards           |

---

## 🧠 Team Collaboration Workflow

### 🌿 Branch Strategy

| Branch      | Description                                  |
| ----------- | -------------------------------------------- |
| `main`      | Stable, production-ready build               |
| `dev`       | Integration branch (frontend + backend test) |
| `feature/*` | Individual features per developer            |

**Example Workflow:**

```bash
git checkout -b feature/upload-resource
# develop your feature
git add .
git commit -m "Added upload resource feature"
git push origin feature/upload-resource
```
