const express = require('express');
const router = express.Router();
const searchProfiles = require('../controllers/searchController');
router.get('/', searchProfiles);

module.exports = router;
