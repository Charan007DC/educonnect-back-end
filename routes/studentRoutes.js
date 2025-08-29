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
router.post('/register', registerStudent);
router.post('/login', loginStudent);
router.get('/dashboard', verifyStudentToken, getStudentDashboardDetails);
router.get('/profile', verifyStudentToken, getStudentProfile);
router.put('/profile', verifyStudentToken, updateStudentProfile);
router.post('/upload-photo', verifyStudentToken, upload.single('photo'), updateProfilePicture);


module.exports = router;
