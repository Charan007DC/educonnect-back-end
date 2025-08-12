const FundraisingCampaign = require('../models/fundRaisingCampaign');
const Student = require('../models/student');
// Create a new fundraising campaign
exports.createCampaign = async (req, res) => {
    try {
        const { title, goalAmount, endDate, category, description, projectId } = req.body;
        const creatorId = req.user.id;

        if (!req.file) {
            return res.status(400).json({ message: 'Campaign image is required.' });
        }
        
        const newCampaign = new FundraisingCampaign({
            title,
            goalAmount,
            endDate,
            category,
            description,
            creator: creatorId,
            project: projectId, // Link to the project
            campaignImage: req.file.path
        });

        const savedCampaign = await newCampaign.save();
        
        await Student.findByIdAndUpdate(creatorId, {
            $push: { fundraisingCampaigns: savedCampaign._id }
        });

        res.status(201).json({ message: 'Campaign created successfully', campaign: savedCampaign });

    } catch (error) {
        console.error('Error creating campaign:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
//  Get all fundraising campaigns
exports.getAllCampaigns = async (req, res) => {
    try {
        // /populate is used hereeee
        const campaigns = await FundraisingCampaign.find()
            .populate('creator', 'name profilePicture')
            .populate('project', 'title'); 
        res.status(200).json(campaigns);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

//  Add a donation to a campaign
//private only for students and alumniii
exports.addDonation = async (req, res) => {
    try {
        const { amount, donorName } = req.body;
        const campaignId = req.params.id;
        
        const campaign = await FundraisingCampaign.findById(campaignId);
        if (!campaign) {
            return res.status(404).json({ message: 'Campaign not found.' });
        }

        const newDonation = {
            amount,
            donorName: donorName || 'Anonymous',
            donorId: req.user.id, 
            donorModel: req.user.role //checking the role of the userr
        };

        campaign.donations.push(newDonation);
        campaign.currentAmount += Number(amount); 
        
        await campaign.save();

        res.status(200).json({ message: 'Donation successful!', campaign });

    } catch (error) {
        console.error('Error adding donation:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
