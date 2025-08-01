const express = require('express');
const router = express.Router();
const { registerStudent, loginStudent } = require('../controllers/studentController');
const upload = require('../middlewares/uploadMiddleware');
const { updateProfilePicture } = require('../controllers/studentController');
const verifyStudentToken = require('../middlewares/verifyStudentToken');
const { sendOtp, resetPassword } = require('../controllers/forgotPasswordController');
// Register route
router.post('/register', registerStudent);
// Login route
router.post('/login', loginStudent);
// Update profile picture route
router.post('/upload-photo',verifyStudentToken,upload.single('photo'), updateProfilePicture);
router.post('/forgot-password/send-otp', sendOtp);
router.post('/forgot-password/reset', resetPassword);

module.exports = router;

