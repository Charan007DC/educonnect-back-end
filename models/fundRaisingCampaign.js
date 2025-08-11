const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// DONORSSS
const donationSchema = new Schema({
    donorName: {
        type: String,
        required: true,
        default: 'Anonymous'
    },
    amount: {
        type: Number,
        required: true
    },
    donationDate: {
        type: Date,
        default: Date.now
    },
    donorId: { 
        type: Schema.Types.ObjectId,
        refPath: 'donorModel'
    },
    donorModel: {
        type: String,
        required: function() { return this.donorId != null; },
        enum: ['student', 'alumni']
    }
});


//FUNDRAISING CAMPAIFGN 
const fundraisingCampaignSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Campaign title is required.'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Description is required.']
    },
    goalAmount: {
        type: Number,
        required: [true, 'Goal amount is required.']
    },
    currentAmount: {
        type: Number,
        default: 0
    },
    endDate: {
        type: Date,
        required: [true, 'End date is required.']
    },
    creator: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'student' 
    },
    project: { 
        type: Schema.Types.ObjectId,
        ref: 'project', 
        required: false 
    },
    category: {
        type: String,
        enum: ['Education', 'Technology', 'Community', 'Health', 'Arts', 'Other'],
        required: [true, 'Category is required.']
    },
    campaignImage: {
        type: String, 
        required: [true, 'Campaign image is required.']
    },
    donations: [donationSchema], 
    status: {
        type: String,
        enum: ['Active', 'Completed', 'Expired'],
        default: 'Active'
    }
}, { timestamps: true }); 

const FundraisingCampaign = mongoose.model('FundraisingCampaign', fundraisingCampaignSchema);

module.exports = FundraisingCampaign;
