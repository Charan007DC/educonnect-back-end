const express = require('express');
const dotenv = require('dotenv');
const studentRoutes = require('./routes/studentRoutes');
const alumniRoutes = require('./routes/alumniRoutes');
const adminRoutes = require('./routes/adminRoutes');
const path = require('path');
dotenv.config();

const app = express();
app.use(express.json());

// Routes
app.use('/api/student', studentRoutes);
app.use('/api/alumni', alumniRoutes);
app.use('/api/admin', adminRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


module.exports = app;
