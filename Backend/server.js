require('dotenv').config(); // 👈 يجب أن يكون السطر رقم 1 في الملف
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const express = require('express');
const app = express();
const cakeRoutes = require('./routes/cakeRoutes');
const orderRoutes = require('./routes/orderRoutes');
const authRoutes = require('./routes/authRoutes');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

// Connect to MongoDB
const url = process.env.DATABASE_URL || 'mongodb://localhost:27017/cakeSite';
mongoose.connect(url)
  .then(() => console.log("Connected to cakeSite Database successfully!"))
  .catch(err => console.log("Error connecting:", err));

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use('/cakes', cakeRoutes);
app.use('/orders', orderRoutes);
app.use('/auth', authRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  if (res.headersSent) return next(err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

module.exports = app;

if (require.main === module) {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}