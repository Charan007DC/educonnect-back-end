const express = require('express');
const router = express.Router();
const { registerStudent, loginStudent } = require('../controllers/studentController');

// Register route
router.post('/register', registerStudent);

// Login route
router.post('/login', loginStudent);

module.exports = router;
