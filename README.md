# FoodieExpress — Full-Stack Food Ordering Ecosystem

FoodieExpress is a cross-platform food delivery application built for the **SE2020 – Web and Mobile Technologies** module. It features a shared **Node.js/Express REST API** and **MongoDB Atlas** database powering both a **React Web Application** and a **React Native / Expo Mobile Application**.

---

## 🏗️ Project Architecture

```
Food_Ordering/
├── backend/          # Shared Express.js REST API, Mongoose Models, JWT Auth, Multer
├── mobile/           # React Native & Expo Mobile Application
└── frontend/         # React 18 & Vite Web Application (Full customer & admin features)
```

Both clients (Web & Mobile) synchronize in real-time through the shared backend:
- **Shared Authentication**: Register as a Customer or Admin on either platform and sign in interchangeably.
- **Shared Inventory**: Food items created, edited, or deleted on one platform instantly update on the other.
- **Shared Orders**: Orders placed on mobile appear in the admin order management dashboard on the website and vice versa.
- **Live Order Tracking**: Sequential status updates (`Pending` → `Preparing` → `Out for Delivery` → `Delivered`) update across both platforms.

---

## 🚀 Quick Start Guide

### 1. Backend Setup & Startup

```bash
cd backend

# Install dependencies (if not already done)
npm install

# (Optional) Seed the database with delicious sample dishes
npm run seed

# Start the server (runs on http://localhost:5001)
npm start
# OR for hot-reload development:
npm run dev
```

> **Note on Port 5001**: Port `5001` is used to prevent port conflicts with macOS AirPlay Receiver on port `5000`.

---

### 2. Web Application Setup & Startup

```bash
cd frontend

# Install dependencies
npm install

# Start development server (opens at http://localhost:3000)
npm run dev
```

The web application connects to `http://localhost:5001/api` by default (configured in `frontend/.env`).

---

### 3. Mobile Application Setup & Startup

```bash
cd mobile

# Install dependencies (if not already done)
npm install

# Start Expo dev server
npm start
```

Press:
- `a` to open on an Android Emulator
- `i` to open on an iOS Simulator
- Scan the QR code with the **Expo Go** app on your physical smartphone

---

## 🔑 Roles & Capabilities

### 🍔 Customer Features
- **Browse & Search**: Filter dishes by category (`Main Course`, `Starters`, `Desserts`, `Beverages`) or search by name.
- **Shopping Cart**: Real-time stock validation, persistent items across sessions.
- **Checkout**: Cash on Delivery with customizable delivery addresses and rider notes.
- **Live Order Tracking**: Visual progress bar from kitchen preparation to delivery.
- **Order Cancellation**: Cancel pending orders with automatic stock restoration to the kitchen.

### 👑 Administrator Features
- **Admin Dashboard**: Live metrics on gross sales, total orders, pending orders, and catalog stock.
- **Food Catalog Management**: Add, update, or delete dishes with image previews and stock inventory counters.
- **Order Pipeline Management**: Advance customer orders through `Pending` → `Preparing` → `Out for Delivery` → `Delivered`.
- **Role-based Route Guards**: Protected client-side routes prevent customer access to admin features.

---

## 🌐 Deploying to the Cloud

### Backend on Render (Web Service)
- **Root Directory**: `backend`
- **Build Command**: `npm install`
- **Start Command**: `node server.js`
- **Plan**: Free ($0/month)
- **Environment Variables**:
  - `MONGO_URI`: Your MongoDB Atlas connection string (`mongodb+srv://...`)
  - `JWT_SECRET`: `super_secret_jwt_key_food_ordering_2026`
  - `NODE_ENV`: `production`

### Frontend on Vercel
- **Root Directory**: `frontend`
- **Framework Preset**: `Vite`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variable**:
  - `VITE_API_BASE_URL`: `https://your-backend-app.onrender.com/api`
