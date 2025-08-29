const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

// Register all your Mongoose models
require('./models/student');
require('./models/alumni'); 
require('./models/project');
require('./models/fundRaisingCampaign');
require('./models/mentorshipRequest');
require('./models/chatSession');

// Import all your route files
const studentRoutes = require('./routes/studentRoutes');
const alumniRoutes = require('./routes/alumniRoutes');
const adminRoutes = require('./routes/adminRoutes');
const searchRoutes = require('./routes/search');
const projectRoutes = require('./routes/projectRoutes');
const fundraisingRoutes = require('./routes/fundraisingRoutes'); 
const chatRoutes = require('./routes/chatRoutes');
// Corrected the path to point to the correct routes file
const mentorshipRoutes = require('./routes/mentorshipRequest'); 

const app = express();

// CORS and Middleware Setup
const allowedOrigins = [
 'http://localhost:5175',
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

// API Routes
app.use('/api/student', studentRoutes);
app.use('/api/alumni', alumniRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/fundraising', fundraisingRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/mentorship', mentorshipRoutes);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

module.exports = app;
