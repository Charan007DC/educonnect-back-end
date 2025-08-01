

const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

// --- IMPORT ROUTE HANDLERS ---
const studentRoutes = require('./routes/studentRoutes');
const alumniRoutes =require('./routes/alumniRoutes');
const adminRoutes = require('./routes/adminRoutes');
const searchRoutes = require('./routes/search');

// --- CREATE EXPRESS APP ---
const app = express();

// --- MIDDLEWARE SETUP ---
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  process.env.FRONTEND_URL
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204
};
app.use(cors(corsOptions));
app.use(express.json());

// --- API ROUTES ---
app.get('/', (req, res) => {
  res.status(200).send('Welcome to the EduConnect API. The app is running!');
});

app.use('/api/student', studentRoutes);
app.use('/api/alumni', alumniRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/search', searchRoutes);

// --- STATIC FILE SERVING ---
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- EXPORT THE APP ---
module.exports = app;
