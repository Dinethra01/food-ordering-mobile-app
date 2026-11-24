# 🍔 FoodieExpress – Food Ordering Mobile Application

**SE2020 – Web and Mobile Technologies | Individual Assignment**

FoodieExpress is a full-stack mobile food ordering application developed using React Native, Expo, Node.js, Express.js, and MongoDB. It allows customers to browse food items, manage their shopping carts, place orders, and track order status also. Administrators can manage food items and customer orders through the admin interface.

## 📌 Main Features

### 👤 Customer Features
- User Registration and Login
- JWT-Based Authentication
- Browse and Search Food Items
- Filter Food Items by Category
- View Food Item Details
- Add Items to Shopping Cart
- Update Cart Quantities
- Checkout and Place Orders
- View Order History and Order Status
- Manage User Profile
- Logout

### 🛠️ Administrator Features
- Administrator Login
- View Dashboard Information
- Add, Update, and Delete Food Items
- Manage Food Prices and Descriptions
- Manage Food Categories
- Manage Stock Quantities and Availability
- View Customer Orders
- Update Order Status

## 💻 Technology Stack

| Category | Technologies |
|---|---|
| Frontend | React Native, Expo |
| Navigation | React Navigation |
| API Communication | Axios |
| Local Storage | AsyncStorage |
| Backend | Node.js, Express.js |
| Authentication | JWT, bcryptjs |
| File Upload | Multer |
| Database | MongoDB, Mongoose |
| Development Tools | VS Code, Git, GitHub |

## 🏗️ System Architecture

FoodieExpress follows a client-server architecture. The mobile application communicates with the backend through REST API requests using Axios. The backend handles authentication, food management, order processing, and business logic, while MongoDB stores the application data.

```text
┌──────────────────────────────┐
│    React Native + Expo       │
│                              │
│  Customer & Admin Interface  │
└──────────────┬───────────────┘
               │
          Axios / HTTP
               │
               ▼
┌──────────────────────────────┐
│       Node.js + Express      │
│                              │
│         REST API             │
│                              │
│  Authentication              │
│  Food Item Management        │
│  Order Management             │
└──────────────┬───────────────┘
               │
            Mongoose
               │
               ▼
┌──────────────────────────────┐
│           MongoDB            │
│                              │
│  Users                       │
│  FoodItems                   │
│  Orders                      │
└──────────────────────────────┘
```

## 🗄️ Database Collections

The application uses three main MongoDB collections:

- **Users:** Stores customer and administrator account information.
- **FoodItems:** Stores food names, prices, descriptions, categories, images, stock quantities, and availability.
- **Orders:** Stores customer orders, ordered items, quantities, delivery details, payment methods, total amounts, and order statuses.

## 🔌 API Modules

| Module | Main Operations |
|---|---|
| Authentication | Register, Login, Get User Details |
| Food Items | Get All, Get Single, Create, Update, Delete |
| Orders | Create, Get All, Get Single, Update Status, Cancel |

## 📦 Order Status

The application supports the following order statuses:

- Pending
- Preparing
- Out for Delivery
- Delivered
- Cancelled

## 🚀 Backend Deployment

**Platform:** Railway

**Backend URL:**  
https://food-ordering-mobile-app-production-abc1.up.railway.app/

The backend REST API is deployed on Railway, allowing the mobile application to communicate with the production server over the internet.

## 👩‍💻 Project Responsibility

This is an individual project. The complete application was planned, designed, developed, integrated, tested, and documented independently.

Responsibilities included:

- Mobile Application Development
- Backend REST API Development
- MongoDB Database Design
- Authentication and Authorization
- API Integration
- Food Item and Order Management
- Business Logic Implementation
- Testing and Documentation
- GitHub Repository Management

---

⭐ **FoodieExpress – Making Food Ordering Simple and Convenient!** 🍔
