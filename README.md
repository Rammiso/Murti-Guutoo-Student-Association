# 🌐 Murti Guuto Students Association (MGSA) Website

A full-stack web platform built for **Murti Guuto Students Association (MGSA)** at **Haramaya University** — designed to empower students from East and West Hararghe through learning support, resource sharing, and community service.

---

## 🚀 Tech Stack

**Frontend:**

- React (Vite)
- Tailwind CSS
- Framer Motion (animations)
- Lucide Icons

**Backend:**

- Node.js + Express.js
- MongoDB (Atlas)
- JWT Authentication
- Cloudinary & UploadThing (for files & images)

---

## 🎯 Core Features

### 🧑‍🎓 Student Portal

- Register, login, and manage profiles
- Upload and update profile pictures
- View personal and academic info

### 🗂️ Resources

- Upload and download materials (PDFs, notes, past exams)
- Cloud storage via Cloudinary (≤10MB) and UploadThing (>10MB)
- Filter by category or uploader

### 🖼️ Gallery

- View campus and event photos
- Each image shows title and date at the bottom
- Admins can upload or delete images

### 💬 Contact & Communication

- Contact form for inquiries
- Messages stored in the admin dashboard

### 🧑‍💼 Admin Dashboard

- Manage users and contact messages
- Promote users to admin roles
- Delete resources or gallery items
- Export user data to Excel

---

## 🎨 Design Language

**Theme:** Futuristic dark neon ✨

- Glowing accents
- Smooth motion transitions
- Modern typography
- Fully mobile responsive

## 🧩 Project Structure

mgsa-website/
│
├── frontend/ # React + Vite app
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── assets/
│ │ └── context/
│ └── vite.config.js
│
├── backend/ # Node + Express API
│ ├── models/
│ ├── routes/
│ ├── controllers/
│ └── server.js
│
└── README.md

yaml
Copy code

---

## 🛠️ Setup

### 1. Clone the repository

```bash
git clone https://github.com/Rammiso/Murti-Guutoo-Student-Association.git
cd mgsa-website

2. Install dependencies

Frontend:
cd frontend && npm install
npm run dev
Backend:

cd ../backend && npm install
npm run dev
3. Configure environment variables


🧠 Vision & Mission
Vision: To produce capable, responsible, and united students who contribute positively to their community.
Mission: To empower Haramaya University students through education, mentorship, and service — ensuring that no student is left behind.

🖼️ Preview
(Add your screenshots here after deployment)

Home Page	Dashboard	Gallery

🤝 Contributors
Role	Name
Lead Developer	Musab Hassen
Backend Developer	Yihune Belay, Sultan Adinan
Frontend Developer	Ezedin, Nadhi, Gifti
Design & Content	MGSA Team

📜 License
Released under the MIT License.
© 2025 Murti Guuto Students Association (MGSA)

🌟 Support
If you like this project, give it a ⭐ on GitHub and share it with your friends!
Together, let’s empower more students.
```
