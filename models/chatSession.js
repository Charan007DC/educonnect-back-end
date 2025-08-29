const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    sender: {
        type: Schema.Types.ObjectId,
        required: true,
        refPath: 'senderModel'
    },
    senderModel: {
        type: String,
        required: true,
        enum: ['Student', 'Alumni']
    },
    text: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const chatSessionSchema = new Schema({
    mentorship: {
        type: Schema.Types.ObjectId,
        ref: 'mentorshipRequest',
        required: true
    },
    messages: [messageSchema],
    expiresAt: {
        type: Date,
        required: true
    }
}, { timestamps: true });
chatSessionSchema.index({ "expiresAt": 1 }, { expireAfterSeconds: 0 });

const ChatSession = mongoose.model('chatSession', chatSessionSchema);
module.exports = ChatSession;
