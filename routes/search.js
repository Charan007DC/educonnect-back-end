const express = require('express');
const router = express.Router();
const searchProfiles  = require('../controllers/searchController');

router.get('/search', searchProfiles); // GET /api/search?type=student&query=rohith

module.exports = router;
