// app.js

const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();
const studentRoutes = require('./routes/studentRoutes');
const alumniRoutes = require('./routes/alumniRoutes');
const adminRoutes = require('./routes/adminRoutes');
const searchRoutes = require('./routes/search');

const app = express();

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  process.env.FRONTEND_URL
];

const corsOptions = {
  origin: (origin, callback) => {
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('This origin is not allowed by CORS policy.'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD'],
  credentials: true
};

app.options('*', cors(corsOptions)); 


app.use(cors(corsOptions));



app.use(express.json());


app.get('/', (req, res) => {
  res.status(200).send('Welcome to the EduConnect API. The app is running!');
});
//routes
app.use('/api/student', studentRoutes);
app.use('/api/alumni', alumniRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/search', searchRoutes);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


module.exports = app;
