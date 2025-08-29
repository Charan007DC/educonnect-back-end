const Student = require('../models/student');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
//register student
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
//login student
exports.loginStudent = async (req, res) => {
    console.log('Backend received login request for:', req.body);
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

        const payload = {
            id: student._id,
            role: student.role 
        };

        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        console.log(`Login successful for ${student.name}. Sending token.`);

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
        console.error("Login server error:", err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
//update profile picture
exports.updateProfilePicture = async (req, res) => {
  try {
    const studentId = req.user.id; 
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    const imageUrl = file.path;
    
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
//get student profile
exports.getStudentProfile = async (req, res) => {
  try {
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
//update student profile
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
      req.user.id,
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
//get student dashboard details
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
