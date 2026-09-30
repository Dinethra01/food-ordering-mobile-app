# FoodieExpress – Food Ordering Mobile Application

FoodieExpress is a full-stack food ordering mobile application developed using **React Native with Expo** for the mobile frontend and **Node.js, Express.js, MongoDB and Mongoose** for the backend REST API.

The application allows customers to browse food items, search the menu, add food to a shopping cart, place orders, and view their order history. An administrator can manage menu items, monitor customer orders, update order statuses, and view basic system statistics.

---

## 📌 Project Overview

The system consists of two main components:

* **Mobile Application** – React Native / Expo
* **Backend REST API** – Node.js / Express.js
* **Database** – MongoDB
* **Authentication** – JWT-based authentication
* **Password Security** – bcryptjs password hashing
* **Image Uploads** – Multer
* **API Communication** – Axios
* **Local Session Storage** – AsyncStorage

### Application Name

**FoodieExpress**

### Project Type

Full-stack mobile food ordering system

---

## ✨ Main Features

### 👤 Customer Features

* Customer registration
* Customer login
* JWT-based authentication
* Persistent login using AsyncStorage
* Browse available food items
* Search food items by name
* Filter food items by category
* View detailed food information
* Select food quantity
* Add items to cart
* Increase/decrease cart quantities
* Remove items from cart
* View cart subtotal and delivery fee
* Enter delivery address
* Place food orders
* View previous orders
* View order status
* Customer profile
* Logout

### ⚙️ Administrator Features

* Administrator login
* Administrator dashboard
* View menu items
* Create new food items
* Edit existing food items
* Delete food items
* Manage food price
* Manage stock quantity
* Manage food categories
* Manage food descriptions
* Manage food image URLs
* View customer orders
* View customer information associated with orders
* Update order status
* View basic system statistics
* View total menu items
* View total orders
* View calculated system order revenue

---

## 🛠️ Technologies Used

### Frontend

| Technology                     | Purpose                              |
| ------------------------------ | ------------------------------------ |
| React Native                   | Mobile application development       |
| Expo                           | React Native development platform    |
| React Navigation               | Application navigation               |
| Axios                          | REST API communication               |
| AsyncStorage                   | Local authentication/session storage |
| Expo Image Picker              | Image-related mobile functionality   |
| React Native Safe Area Context | Safe-area handling                   |

### Backend

| Technology | Purpose                         |
| ---------- | ------------------------------- |
| Node.js    | Backend runtime                 |
| Express.js | REST API framework              |
| MongoDB    | Database                        |
| Mongoose   | MongoDB object modelling        |
| JWT        | Authentication                  |
| bcryptjs   | Password hashing                |
| Multer     | Image upload handling           |
| CORS       | Cross-origin request handling   |
| dotenv     | Environment variable management |
| Nodemon    | Development server              |

---

## 📂 Project Structure

```text
Food_Ordering/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── foodItemController.js
│   │   └── orderController.js
│   │
│   ├── middleware/
│   │   ├── auth.js
│   │   └── upload.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── FoodItem.js
│   │   └── Order.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── foodItemRoutes.js
│   │   └── orderRoutes.js
│   │
│   ├── .env.example
│   ├── package.json
│   ├── seed.js
│   └── server.js
│
├── mobile/
│   ├── src/
│   │   ├── api/
│   │   │   └── apiClient.js
│   │   │
│   │   ├── context/
│   │   │   ├── AuthContext.js
│   │   │   └── CartContext.js
│   │   │
│   │   ├── navigation/
│   │   │   └── AppNavigator.js
│   │   │
│   │   └── screens/
│   │       ├── LoginScreen.js
│   │       ├── RegisterScreen.js
│   │       ├── HomeScreen.js
│   │       ├── FoodDetailsScreen.js
│   │       ├── CartScreen.js
│   │       ├── OrderSuccessScreen.js
│   │       ├── OrdersScreen.js
│   │       ├── AdminDashboardScreen.js
│   │       └── AdminMenuScreen.js
│   │
│   ├── App.js
│   ├── package.json
│   └── metro.config.js
│
└── .gitignore
```

---

## 🏗️ System Architecture

```text
┌─────────────────────────────┐
│      React Native / Expo    │
│        Mobile Client        │
└──────────────┬──────────────┘
               │
               │ Axios / REST API
               ▼
┌─────────────────────────────┐
│       Express.js API        │
│                             │
│ Authentication              │
│ Food Item Management        │
│ Order Management             │
│ JWT Middleware              │
│ Image Uploads               │
└──────────────┬──────────────┘
               │
               │ Mongoose
               ▼
┌─────────────────────────────┐
│          MongoDB            │
│                             │
│ Users                       │
│ Food Items                  │
│ Orders                      │
└─────────────────────────────┘
```

---

# 🔐 Authentication

The application uses **JSON Web Tokens (JWT)** for authentication.

When a customer or administrator logs in successfully:

1. The backend validates the email and password.
2. A JWT token is generated.
3. The token is returned to the mobile application.
4. The mobile application stores the token using AsyncStorage.
5. Axios automatically attaches the token to authenticated API requests.

Passwords are hashed using **bcryptjs** before being stored in MongoDB.

---

# 👥 User Roles

The application supports two user roles:

### Customer

Customers can:

* Browse the menu
* Search for food
* View food details
* Manage their cart
* Place orders
* View their orders
* View their profile
* Sign out

### Administrator

Administrators can access the administrator dashboard to:

* Manage menu items
* Monitor orders
* Update order statuses
* View system statistics

---

# 🍔 Food Item Management

Each food item contains:

* Name
* Price
* Description
* Image
* Stock quantity
* Category
* Availability status
* Created/updated timestamps

The backend provides APIs for creating, retrieving, updating and deleting food items.

Food images can either be supplied as external image URLs or uploaded through the backend using Multer.

---

# 🛒 Cart and Ordering

Customers can add food items to the cart and modify quantities before placing an order.

During checkout the customer provides:

* Food items
* Quantities
* Delivery address

The backend validates:

* Whether the food item exists
* Whether the item is available
* Whether sufficient stock is available

The server calculates the order total using the food item prices stored in MongoDB rather than trusting the price submitted by the client.

When an order is created, the corresponding stock quantity is reduced.

If an order is cancelled, the associated stock quantity is restored.

---

# 📦 Order Status

The backend supports the following order statuses:

```text
Pending
Preparing
Out for Delivery
Delivered
Cancelled
```

Orders are stored with:

* Customer/user ID
* Ordered food items
* Quantities
* Item prices
* Total amount
* Delivery address
* Payment method
* Order status
* Created/updated timestamps

The current application uses **Cash on Delivery** as the default payment method.

---

# 🔌 REST API

## Authentication

| Method | Endpoint             | Description            |
| ------ | -------------------- | ---------------------- |
| POST   | `/api/auth/register` | Register a customer    |
| POST   | `/api/auth/login`    | Login                  |
| GET    | `/api/auth/me`       | Get authenticated user |

## Food Items

| Method | Endpoint              | Description              |
| ------ | --------------------- | ------------------------ |
| GET    | `/api/food-items`     | Get all food items       |
| GET    | `/api/food-items/:id` | Get a specific food item |
| POST   | `/api/food-items`     | Create a food item       |
| PUT    | `/api/food-items/:id` | Update a food item       |
| DELETE | `/api/food-items/:id` | Delete a food item       |

Food items can also be filtered using query parameters:

```text
/api/food-items?category=...
/api/food-items?search=...
```

## Orders

| Method | Endpoint                 | Description         |
| ------ | ------------------------ | ------------------- |
| POST   | `/api/orders`            | Create an order     |
| GET    | `/api/orders`            | Get orders          |
| GET    | `/api/orders/:id`        | Get an order by ID  |
| PATCH  | `/api/orders/:id/status` | Update order status |
| DELETE | `/api/orders/:id`        | Cancel an order     |

---

# 🚀 Installation and Setup

## Prerequisites

Install the following before running the project:

* Node.js
* npm
* MongoDB
* Expo CLI / Expo development environment
* Android Studio or an Android/iOS device/emulator if required

---

## 1. Clone the Repository

```bash
git clone <YOUR-GITHUB-REPOSITORY-URL>
cd Food_Ordering
```

---

## 2. Backend Setup

Open a terminal in the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
PORT=5001
MONGO_URI=mongodb://127.0.0.1:27017/food_ordering
JWT_SECRET=your_secure_jwt_secret
```

For MongoDB Atlas, replace `MONGO_URI` with the MongoDB Atlas connection string.

Start the backend:

```bash
npm start
```

For development with automatic restart:

```bash
npm run dev
```

The API will normally run at:

```text
http://localhost:5001
```

The root endpoint can be tested using:

```text
http://localhost:5001/
```

A successful response contains:

```json
{
  "success": true,
  "message": "Food Ordering REST API Server Running"
}
```

---

## 3. Seed Sample Data

The project includes sample food items and a default administrator account.

From the backend directory:

```bash
npm run seed
```

The application also contains database initialization logic that creates sample food items and the default administrator when the database is empty.

---

## 4. Mobile Application Setup

Open another terminal:

```bash
cd mobile
```

Install dependencies:

```bash
npm install
```

Start Expo:

```bash
npm start
```

Other available commands:

```bash
npm run android
npm run ios
npm run web
```

---

# 🌐 API Connection Configuration

The mobile application currently uses:

### Android Emulator

```text
http://10.0.2.2:5001/api
```

### iOS Simulator / Web

```text
http://localhost:5001/api
```

This configuration is located in:

```text
mobile/src/api/apiClient.js
```

When using a physical mobile device, the API URL may need to be changed to the computer's local network IP address, for example:

```text
http://192.168.x.x:5001/api
```

The mobile device and computer must be connected to the same network.

---

# 🔑 Default Administrator Account

The backend creates a default administrator account:

```text
Email: admin@foodapp.com
Password: admin123
```

The login screen provides an Admin Login option that pre-fills these credentials.

**For production use, these default credentials should be changed.**

---

# 🗄️ Database

The application uses MongoDB with the following main collections:

```text
users
fooditems
orders
```

### User

Stores:

* Name
* Email
* Hashed password
* Role
* Timestamps

### FoodItem

Stores:

* Name
* Price
* Description
* Image
* Stock quantity
* Category
* Availability
* Timestamps

### Order

Stores:

* Customer
* Ordered items
* Quantities
* Prices
* Total amount
* Order status
* Delivery address
* Payment method
* Timestamps

---

# 🧪 Business Logic

The backend contains several business rules:

### Stock Validation

An order cannot be created when:

* The food item does not exist
* The food item is unavailable
* Requested quantity exceeds available stock

### Server-Side Price Calculation

The backend retrieves current prices from MongoDB and calculates the order total.

This prevents the client from directly controlling the stored food item price.

### Automatic Stock Deduction

After a successful order, the requested quantity is deducted from stock.

If stock reaches zero, the item is marked unavailable.

### Stock Restoration

When an order is cancelled, its quantities are added back to the corresponding food items.

### Order Status Protection

Orders that are already:

```text
Delivered
```

or

```text
Cancelled
```

cannot be changed to another status through the backend status-update logic.

---

# 📱 Main Mobile Screens

### Authentication

* Login
* Registration

### Customer

* Home / Menu
* Food Details
* Cart
* Order Success
* Orders
* Profile

### Administrator

* Admin Dashboard
* Menu CRUD
* Order Management
* System Overview

---

# 🔒 Environment and Security

Sensitive environment configuration should not be committed to GitHub.

The project includes:

```text
backend/.env.example
```

while the actual:

```text
backend/.env
```

is excluded through `.gitignore`.

The following should remain private:

* MongoDB connection strings
* JWT secrets
* Database passwords
* Other environment-specific credentials

---

# ⚠️ Current Implementation Notes

The following points reflect the current source code:

1. The mobile checkout interface displays a **Rs. 350 delivery fee**, while the backend currently calculates and stores the order total from the food-item prices only.
2. The backend accepts `Cash on Delivery` as the default payment method.
3. The backend defines order statuses as `Pending`, `Preparing`, `Out for Delivery`, `Delivered`, and `Cancelled`.
4. The current Admin Dashboard contains a status option named `Completed`, which does not match the backend's defined `Delivered` status.
5. The mobile application contains both `AdminDashboardScreen.js` and `AdminMenuScreen.js`; the active administrator navigation uses `AdminDashboardScreen.js`.
6. Public registration creates a customer account because the backend registration controller explicitly assigns the `user` role.
7. MongoDB is the primary database. The backend also contains fallback logic for an in-memory MongoDB server if the configured MongoDB connection is unavailable.

---

# 📄 Academic Project

This project was developed as an academic mobile application project demonstrating:

* Mobile application development
* RESTful API development
* Database integration
* Authentication and authorization concepts
* CRUD operations
* State management
* Shopping cart management
* Order processing
* Stock management
* Client-server communication
* Software architecture

---

## 👩‍💻 Development

**Project:** FoodieExpress – Food Ordering Mobile Application

**Frontend:** React Native + Expo

**Backend:** Node.js + Express.js

**Database:** MongoDB

**Authentication:** JWT

**API Client:** Axios

**Database ODM:** Mongoose

---
