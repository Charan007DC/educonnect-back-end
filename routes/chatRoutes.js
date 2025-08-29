const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const verifyToken = require('../middlewares/verifyToken'); 

router.get(
    '/:sessionId/messages',
    verifyToken, 
    chatController.getMessages
);
router.post(
    '/:sessionId/messages',
    verifyToken, 
    chatController.sendMessage
);

module.exports = router;
