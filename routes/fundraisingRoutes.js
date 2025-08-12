const express = require('express');
const router = express.Router();
const fundraisingController = require('../controllers/fundraisingController');
const verifyStudentToken = require('../middlewares/verifyStudentToken');
// more incominggg for doantionnnsss
const upload = require('../middlewares/uploadMiddleware');

//  Create a new fundraising campaign
router.post(
    '/create',
    verifyStudentToken,
    upload.single('campaignImage'),
    fundraisingController.createCampaign
);
//   Get all fundraising campaigns
router.get('/', fundraisingController.getAllCampaigns);
//   Add a donation to a campaign
router.post(
    '/:id/donate',
    verifyStudentToken, // Or a general verifyToken middleware
    fundraisingController.addDonation
);

module.exports = router;
