const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Body parser & CORS middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Fallback for default food image to avoid broken image links
app.get('/uploads/default-food.jpg', (req, res) => {
  res.redirect('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80');
});

// Serve static uploads folder for images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount Routers (Supports both /api/* and root /* paths for all web & mobile clients)
const authRoutes = require('./routes/authRoutes');
const foodItemRoutes = require('./routes/foodItemRoutes');
const orderRoutes = require('./routes/orderRoutes');

// Auth routes (/api/auth, /auth, and direct shortcuts)
app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes);
app.use('/', authRoutes);

// Food items routes (/api/food-items and /food-items)
app.use('/api/food-items', foodItemRoutes);
app.use('/food-items', foodItemRoutes);

// Orders routes (/api/orders and /orders)
app.use('/api/orders', orderRoutes);
app.use('/orders', orderRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Food Ordering REST API Server Running',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      foodItems: '/api/food-items',
      orders: '/api/orders',
    },
  });
});

// 404 Handler for non-existent routes
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} Not Found` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err.stack);
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5001;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`⚠️ Port ${PORT} is busy. Stopping previous process...`);
  } else {
    console.error('Server error:', err);
  }
});

