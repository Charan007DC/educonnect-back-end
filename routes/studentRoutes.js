const express = require('express');
const router = express.Router();
const {registerStudent,loginStudent,updateProfilePicture,updateStudentProfile,getStudentProfile} = require('../controllers/studentController');
const upload = require('../middlewares/uploadMiddleware');
const verifyStudentToken = require('../middlewares/verifyStudentToken');

// Register route
router.post('/register', registerStudent);

// Login route
router.post('/login', loginStudent);

// Update profile picture route
router.post('/upload-photo', verifyStudentToken, upload.single('photo'), updateProfilePicture);

// Get student profile (for viewing/editing)
router.get('/profile', verifyStudentToken, getStudentProfile);

// Update student profile (after editing)
router.put('/profile', verifyStudentToken, updateStudentProfile);

module.exports = router;
