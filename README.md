# 🚗 FIS Carpooling Platform

A full-stack web application for a carpooling system developed for the **FIS Project**. It helps users to publish trips, reserve seats, and manage carpooling reservations in a convenient and organized way.

---

## 📂 Project Structure

```
New folder/
├── Backend/               # Node.js + Express backend
│   ├── config/            # Environment & database config
│   ├── models/            # Mongoose schemas: User, Trip, Reservation, Notification
│   ├── routes/            # REST API routes
│   ├── db.js              # MongoDB connection
│   ├── index.js           # Main server file
│   └── package.json       # Backend dependencies
└── my-react-app/          # React frontend
    ├── src/               # Components and pages (not shown in tree)
    ├── public/            # Public assets
    ├── package.json       # Frontend dependencies
    └── .gitignore         # Git ignored files
```

---

## 🚀 Features

- 👤 **User Authentication**
  - JWT-based login & registration
- 🧳 **Trip Management**
  - Publish new trips
  - List and filter available trips
- 📅 **Reservation System**
  - Reserve seats on available trips
  - Store trip ID and user ID in reservations
- 🔔 **Notifications**
  - Receive trip updates
  - Mark notifications as seen
- 🖼️ **Profile**
  - Update user profile with profile pictures and ID photos (stored as base64)
  - Password change with validation of the old password

---

## 🛠️ Technologies

### Backend:
- **Node.js** + **Express.js**
- **MongoDB** with **Mongoose**
- **JWT** for auth
- **Multer** for image upload (memory storage)
- **bcrypt** for password hashing

### Frontend:
- **React.js**
- Uses `localStorage` for JWT storage

---

## 🧪 Getting Started

### Prerequisites
- Node.js
- MongoDB

### Installation

```bash
# Backend setup
cd "New folder/Backend"
npm install
npm start

# Frontend setup
cd "../my-react-app"
npm install
npm start
```

---

## ✍️ Authors

- 🧑‍💻 Moez Ben Jemiaa – Developer & Designer
- 🧑‍💻 Rostom torki – Developer & Designer

---

## 📄 License

This project is for educational use (FIS project). No commercial use permitted unless explicitly authorized.
