const express = require('express');
const router = express.Router();
const mentorshipController = require('../controllers/mentorshipController');

const verifyStudentToken = require('../middlewares/verifyStudentToken');
const verifyAdminToken = require('../middlewares/verifyAdminToken');
const verifyAlumniToken = require('../middlewares/verifyAlumniToken');
const verifyToken = require('../middlewares/verifyToken');

router.post(
    '/request',
    verifyStudentToken,
    mentorshipController.requestMentorship
);

router.put(
    '/admin-approve/:requestId',
    verifyAdminToken,
    mentorshipController.adminApproveRequest
);

router.put(
    '/alumni-approve/:requestId',
    verifyAlumniToken,
    mentorshipController.alumniApproveRequest
);

router.put(
    '/reject/:requestId',
    verifyToken,
    mentorshipController.rejectRequest
);

module.exports = router;
