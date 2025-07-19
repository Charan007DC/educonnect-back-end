const express = require('express');
const router = express.Router();
const { registerStudent, loginStudent } = require('../controllers/studentController');
const upload = require('../middlewares/uploadMiddleware');
const { updateProfilePicture } = require('../controllers/studentController');
const verifyStudentToken = require('../middlewares/verifyStudentToken');
// Register route
router.post('/register', registerStudent);
// Login route
router.post('/login', loginStudent);
// Update profile picture route
router.post('/upload-photo',verifyStudentToken,upload.single('photo'), updateProfilePicture);
module.exports = router;
