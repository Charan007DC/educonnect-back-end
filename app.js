const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
// Load environment variables
dotenv.config();
const studentRoutes = require('./routes/studentRoutes');
const alumniRoutes =require('./routes/alumniRoutes');
const adminRoutes = require('./routes/adminRoutes');
const searchRoutes = require('./routes/search');
const app = express();
const allowedOrigins = [
  'http://localhost:3000', 
  process.env.FRONTEND_URL 
];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
};
app.use(cors(corsOptions));

// Middleware to parse incoming JSON requests
app.use(express.json());
// render 
app.get('/', (req, res) => {
  res.status(200).send('Welcome to the EduConnect API. The app is running!');
});

// routes
app.use('/api/student', studentRoutes);
app.use('/api/alumni', alumniRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/search', searchRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
module.exports = app;
