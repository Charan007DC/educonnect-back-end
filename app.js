const express = require('express');
const dotenv = require('dotenv');
const studentRoutes = require('./routes/studentRoutes');
const alumniRoutes = require('./routes/alumniRoutes');

dotenv.config();

const app = express();
app.use(express.json());

// Routes
app.use('/api/student', studentRoutes);
app.use('/api/alumni', alumniRoutes);

module.exports = app;
