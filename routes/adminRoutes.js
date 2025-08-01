console.log("Loading: adminRoutes.js");
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Only login route
router.post('/login', adminController.loginAdmin);

module.exports = router;
router.post('/login', adminController.loginAdmin);
router.get('/dashboard', adminController.getAdminDashboard);

module.exports = router;
