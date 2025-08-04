console.log("Loading: studentRoutes.js");
const express = require('express');
const router = express.Router();
const { 
    registerStudent, 
    loginStudent,
    updateProfilePicture,
    getStudentProfile,
    updateStudentProfile,
    getStudentDashboardDetails
} = require('../controllers/studentController');
const upload = require('../middlewares/uploadMiddleware');
const verifyStudentToken = require('../middlewares/verifyStudentToken');
const { sendOtp, resetPassword } = require('../controllers/forgotPasswordController');
router.post('/register', registerStudent);
router.post('/login', loginStudent);
router.post('/forgot-password/send-otp', sendOtp);
router.post('/forgot-password/reset', resetPassword);
router.get('/dashboard', verifyStudentToken, getStudentDashboardDetails);
router.get('/profile', verifyStudentToken, getStudentProfile);
router.put('/profile', verifyStudentToken, updateStudentProfile);
router.post('/upload-photo', verifyStudentToken, upload.single('photo'), updateProfilePicture);


module.exports = router;
