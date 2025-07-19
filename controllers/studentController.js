const Student = require('../models/student');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');

// Register a student
exports.registerStudent = async (req, res) => {
  const { name, email, password ,graduationYear,institution,department } = req.body;
  if (!name || !email || !password || !graduationYear || !institution || !department) {
    return res.status(400).json({ message: 'All fields are required' }); 
  }
  try {
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ message: 'Student already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newStudent = new Student({
      name,
      email,
      password: hashedPassword,
      graduationYear,
      institution,
      department,
      // Leave all other fields as default/empty
      profilePicture: '',
      location: '',
      description: '',
      about: '',
      academicInterests: [],
      skills: [],
      projects: [],
      fundraisingCampaigns: [],
      lookingFor: [],
      role: 'Student'
    });

    await newStudent.save();

    res.status(201).json({ message: 'Student registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

//  Login a student
exports.loginStudent = async (req, res) => {
  const { email, password } = req.body;

  try {
    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: student._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      student: {
        id: student._id,
        email: student.email,
        name: student.name,
        description: student.description,
        profilePicture: student.profilePicture
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
// Update profile picture
exports.updateProfilePicture = async (req, res) => {
  try {
    const studentId = req.user.id;

    // Check if file was uploaded
    if (!req.file || !req.file.path) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const photoUrl = req.file.path; // This is the Cloudinary URL



    // Update the student's profile picture in the database


const Student = require('../models/student'); // Ensure Student model is imported

const updateProfilePicture = async (req, res) => {
  try {
    const studentId = req.user._id;

    // Ensure file was uploaded
    if (!req.file || !req.file.path) {
      return res.status(400).json({ message: 'No photo uploaded' });
    }

    const photoUrl = req.file.path;

    // Update profilePicture field in MongoDB
    const updatedStudent = await Student.findByIdAndUpdate(
      studentId,
      { profilePicture: photoUrl },
      { new: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json({
      message: 'Profile picture updated successfully',
      profilePicture: updatedStudent.profilePicture
    });

  } catch (error) {
    console.error('Error updating profile picture:', error);
    res.status(500).json({
      message: 'Error uploading photo',
      error: error.message
    });
  }
};

module.exports = { updateProfilePicture };
