const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

require('./models/student');
require('./models/alumni');
require('./models/project');
require('./models/fundraisingCampaign');

const studentRoutes = require('./routes/studentRoutes');
const alumniRoutes = require('./routes/alumniRoutes');
const adminRoutes = require('./routes/adminRoutes');
const searchRoutes = require('./routes/search');
const projectRoutes = require('./routes/projectRoutes');
const fundraisingRoutes = require('./routes/fundraisingRoutes');
const app = express();
// --- START OF CORRECTIONS ---
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

app.use(cors(corsOptions));
app.use(express.json());


app.get('/', (req, res) => {
  res.status(200).send('Welcome to the EduConnect API. The app is running!');
});

app.use('/api/student', studentRoutes);
app.use('/api/alumni', alumniRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/search', searchRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/projects', projectRoutes);
app.use('/api/fundraising', fundraisingRoutes);

module.exports = app;
