const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors'); 
const studentRoutes = require('./routes/studentRoutes');
const alumniRoutes = require('./routes/alumniRoutes');
const adminRoutes = require('./routes/adminRoutes');
const path = require('path');
const search = require('./routes/search');

const app = express();
const allowedOrigins = [
  'http://localhost:3000', 
  'https://your-frontend-app-url.com' // for future purpose i need to change this after fronend deployment
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


app.use(express.json());
app.use('/api/student', studentRoutes);
app.use('/api/alumni', alumniRoutes);
app.use('/api/admin', adminRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/search',search);

module.exports = app;
