const Student = require('../models/student');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

// Register a student
exports.registerStudent = async (req, res) => {
  const { name, email, password, graduationYear, institution, department } = req.body;
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

// Login a student
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
      { id: student._id }, // The payload is { id: ... }
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
    // Corrected to use req.user.id to match the JWT payload
    const studentId = req.user.id; 
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    const imageUrl = file.path;
    
    // You don't need to require the model again here
    const student = await Student.findByIdAndUpdate(
      studentId,
      { profilePicture: imageUrl },
      { new: true }
    );

    res.status(200).json({
      message: 'Profile picture updated successfully.',
      profilePicture: imageUrl,
      student,
    });
  } catch (error) {
    console.error('Error updating profile picture:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get student profile 
exports.getStudentProfile = async (req, res) => {
  try {
    // Corrected to use req.user.id
    const studentId = req.user.id; 

    const student = await Student.findById(studentId).select('-password');

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json(student);
  } catch (error) {
    console.error('Error fetching student profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update student profile
exports.updateStudentProfile = async (req, res) => {
  try {
    const allowedFields = [
      'name', 'location', 'description', 'about', 'academicInterests',
      'skills', 'projects', 'fundraisingCampaigns', 'lookingFor'
    ];

    const updates = {};
    for (const key of allowedFields) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: 'No valid fields provided for update.' });
    }

    const updatedStudent = await Student.findByIdAndUpdate(
      req.user.id, // Corrected to use req.user.id
      updates,
      { new: true }
    ).select('-password'); 

    if (!updatedStudent) {
      return res.status(404).json({ message: 'Student not found.' });
    }
    res.status(200).json({
      message: 'Profile updated successfully.',
      student: updatedStudent
    });
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getStudentDashboardDetails = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id).select('name');

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    res.json(student);

  } catch (err) {
    console.error("Error fetching student dashboard details:", err.message);
    res.status(500).send('Server Error');
  }
};
