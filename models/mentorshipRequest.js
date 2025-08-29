const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const mentorshipSchema = new Schema({
    student: {
        type: Schema.Types.ObjectId,
        ref: 'student', 
        required: true
    },
    alumni: {
        type: Schema.Types.ObjectId,
        ref: 'alumni', 
        required: true
    },
    status: {
        type: String,
        enum: [
            'pending_admin_approval', 
            'pending_alumni_approval', 
            'active', 
            'rejected_by_admin', 
            'rejected_by_alumni',
            'expired'
        ],
        default: 'pending_admin_approval'
    },
    chatSession: {
        type: Schema.Types.ObjectId,
        ref: 'chatSession' // Corrected to lowercase to match your file name
    },
    requestMessage: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Mentorship = mongoose.model('mentorshipRequest', mentorshipSchema);

module.exports = Mentorship;
