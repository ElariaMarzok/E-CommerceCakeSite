
const express = require('express');
const app = express();
const cakeRoutes = require('./routes/cakeRoutes');
const orderRoutes = require('./routes/orderRoutes');
const authRoutes = require('./routes/authRoutes');
const cors = require('cors');
const mongoose = require('mongoose');




require('dotenv').config();


// Connect to MongoDB
const url = process.env.DATABASE_URL || 'mongodb://localhost:27017/cakeSite';
mongoose.connect(url)
  .then(() => console.log("Connected to cakeSite Database successfully!"))
  .catch(err => console.log("Error connecting:", err));

// Middleware
// edit the limit to handle large base64 images
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());
app.use(express.static('public')); // to serve static files like images
app.use('/uploads', express.static('uploads')); // serve uploaded files


// Routes
app.use('/cakes', cakeRoutes);
app.use('/orders', orderRoutes);
app.use('/auth', authRoutes);

// Export app for serverless deployment


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
module.exports = app;
