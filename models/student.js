const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: {type :String,required: true},
  email: {type :String, required: true, unique: true},
  password:{type : String , required: true }, // hashed
  institution: {type:String,required: true}, 
  department: {type:String,required: true},
  graduationYear:{type : Number,required: true}, 
  profilePicture: String, // URL or base64
  role: { type: String, default: 'Student' },
  location: String,
  about: String,
  description: String, // New field for short tagline/bio under name\
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
