// routes/studentRoutes.js
const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { verifyStudentToken } = require('../middlewares/auth');
const multer = require('multer');
const { storage } = require('../utils/cloudinary');

const upload = multer({ storage });

// Route to upload profile picture
router.put('/upload-profile', verifyStudentToken, upload.single('photo'), studentController.updateProfilePicture);

module.exports = router;
