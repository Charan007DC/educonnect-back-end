const ChatSession = require('../models/chatSession');
const Mentorship = require('../models/mentorshipRequest');

//   GET /api/chat/:sessionId/messages
exports.getMessages = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const userId = req.user.id;

        const session = await ChatSession.findById(sessionId).populate('mentorship', 'student alumni');

        if (!session || !session.mentorship) {
            return res.status(404).json({ message: 'Chat session or associated mentorship not found.' });
        }

        const { student, alumni } = session.mentorship;
        if (userId.toString() !== student.toString() && userId.toString() !== alumni.toString()) {
            return res.status(403).json({ message: 'You are not authorized to view this chat.' });
        }

        // Populate sender details for each message
        await ChatSession.populate(session, {
            path: 'messages.sender',
            select: 'name profilePicture'
        });

        res.status(200).json(session.messages);

    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @route   POST /api/chat/:sessionId/messages
// @desc    Send a new message in a chat session
exports.sendMessage = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const { text } = req.body;
        const userId = req.user.id;
        const userRole = req.user.role; 

        if (!text) {
            return res.status(400).json({ message: 'Message text is required.' });
        }

        const session = await ChatSession.findById(sessionId).populate('mentorship', 'student alumni');

        if (!session || !session.mentorship) {
            return res.status(404).json({ message: 'Chat session or associated mentorship not found.' });
        }

        const { student, alumni } = session.mentorship;
        if (userId.toString() !== student.toString() && userId.toString() !== alumni.toString()) {
            return res.status(403).json({ message: 'You are not authorized to send messages in this chat.' });
        }

        const newMessage = {
            text,
            sender: userId,
            senderModel: userRole 
        };

        session.messages.push(newMessage);
        await session.save();
        
        // --- Socket.io Integration ---

        const io = req.app.get('socketio');
        
    
        const populatedMessage = session.messages[session.messages.length - 1];
        await populatedMessage.populate({ path: 'sender', select: 'name' });

        io.to(sessionId).emit('newMessage', populatedMessage);
        
        res.status(201).json({ message: 'Message sent successfully', newMessage: populatedMessage });

    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ message: 'Server error' });
    }
};
