const Mentorship = require('../models/mentorshipRequest');
const ChatSession = require('../models/chatSession');
const Student = require('../models/student');
const Alumni = require('../models/alumni');

// sending mentorship request to an alumni 
exports.requestMentorship = async (req, res) => {
    try {
        const { alumniId, requestMessage } = req.body;
        const studentId = req.user.id; 

        if (!alumniId || !requestMessage) {
            return res.status(400).json({ message: 'Alumni ID and a request message are required.' });
        }

        const newRequest = new Mentorship({
            student: studentId,
            alumni: alumniId,
            requestMessage: requestMessage
        });

        await newRequest.save();
        res.status(201).json({ message: 'Mentorship request sent successfully. Awaiting admin approval.', request: newRequest });

    } catch (error) {
        console.error("Error sending mentorship request:", error);
        res.status(500).json({ message: 'Server error' });
    }
};

//  Admin approves a mentorship request
exports.adminApproveRequest = async (req, res) => {
    try {
        const mentorship = await Mentorship.findByIdAndUpdate(
            req.params.requestId,
            { status: 'pending_alumni_approval' },
            { new: true }
        );

        if (!mentorship) {
            return res.status(404).json({ message: 'Mentorship request not found.' });
        }
        res.status(200).json({ message: 'Request approved by admin. Awaiting alumni approval.', mentorship });

    } catch (error) {
        console.error("Error approving request (admin):", error);
        res.status(500).json({ message: 'Server error' });
    }
};

//     Alumni approves a mentorship request, activating the chat
exports.alumniApproveRequest = async (req, res) => {
    try {
        const mentorship = await Mentorship.findById(req.params.requestId);

        if (!mentorship) {
            return res.status(404).json({ message: 'Mentorship request not found.' });
        }
        if (mentorship.alumni.toString() !== req.user.id) {
            return res.status(403).json({ message: 'You are not authorized to approve this request.' });
        }

        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 1); //1day 

        const newChatSession = new ChatSession({
            mentorship: mentorship._id,
            expiresAt: expirationDate
        });
        await newChatSession.save();

        mentorship.status = 'active';
        mentorship.chatSession = newChatSession._id;
        await mentorship.save();

        res.status(200).json({ message: 'Mentorship approved and chat session created.', mentorship });

    } catch (error) {
        console.error("Error approving request (alumni):", error);
        res.status(500).json({ message: 'Server error' });
    }
};

//   Admin or Alumni rejects a mentorship request
exports.rejectRequest = async (req, res) => {
    try {
        const mentorship = await Mentorship.findById(req.params.requestId);
        if (!mentorship) {
            return res.status(404).json({ message: 'Request not found.' });
        }

        // to display role 
        const userRole = req.user.role; //
        let newStatus;

        if (userRole === 'Admin') {
            newStatus = 'rejected_by_admin';
        } else if (userRole === 'Alumni' && mentorship.alumni.toString() === req.user.id) {
            newStatus = 'rejected_by_alumni';
        } else {
            return res.status(403).json({ message: 'You are not authorized to reject this request.' });
        }

        mentorship.status = newStatus;
        await mentorship.save();

        res.status(200).json({ message: 'Mentorship request has been rejected.', mentorship });

    } catch (error) {
        console.error("Error rejecting request:", error);
        res.status(500).json({ message: 'Server error' });
    }
};