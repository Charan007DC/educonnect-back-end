const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: String,
  email: {type :String, required: true, unique: true},
  password: String, // hashed
  profilePicture: String, // URL or base64
  role: { type: String, default: 'Student' },
  graduationYear: Number,
  institution: String,
  location: String,

  about: String,
  description: String, // New field for short tagline/bio under name

  academicInterests: [String], // e.g., ['AI', 'ML', 'Computer Vision']
  skills: [String],            // e.g., ['Python', 'TensorFlow', 'Git']

  projects: [
    {
      title: String,
      description: String,
      tags: [String], // e.g., ['React', 'Node.js']
    }
  ],

  fundraisingCampaigns: [
    {
      title: String,
      description: String,
      raised: Number,
      goal: Number,
    }
  ],

  lookingFor: [String], // e.g., ['ML mentorship', 'Open Source']
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
