require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// import routes
const authRoutes = require('./routes/auth');   // ✅ lowercase if your file is auth.js
const transactionRoutes = require('./routes/transactions');

const app = express(); // ✅ must come before app.use()

// middleware
app.use(cors());
app.use(express.json());

// serve uploaded profile pics statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes); // ✅ now works fine

// connect to Mongo and start server
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Mongo connected');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
.catch(err => console.error('MongoDB connection error:', err));
