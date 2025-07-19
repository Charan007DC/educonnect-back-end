const { decodeBase64 } = require('bcryptjs');
const mongoose = require('mongoose');

const alumniSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true , unique: true },
  password: { type: String, required: true },
  graduationYear: { type: String, required: true },
  department: { type: String, required: true },
  institution: { type: String, required: true },
  currentCompany: { type: String},
  jobTitle: { type: String },
  about: { type: String },
  profilePicture: { type: String }, // URL or base64
  location: { type: String },
  decscription: { type: String }, // Short tagline/bio under name
  skills: [String],
    projects: [
    {
      title: String,
      description: String,
      tags: [String], // e.g., ['React', 'Node.js']
    }
  ],
  lookingFor: [String], // e.g., ['ML mentorship', 'Open Source']

});

module.exports = mongoose.model('Alumni', alumniSchema);
