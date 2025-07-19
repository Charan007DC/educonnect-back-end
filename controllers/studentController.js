const Student = require('../models/student');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // DEBUGGING: Print file object
    console.log('File Uploaded:', req.file);

    // Convert backslashes (Windows) to forward slashes (URL safe)
    const photoUrl = req.file.path.replace(/\\/g, '/');

    const student = await Student.findByIdAndUpdate(
      studentId,
      { profilePicture: photoUrl },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json({
      message: 'Profile picture updated successfully',
      profilePicture: student.profilePicture,
    });
  } catch (err) {
    console.error('Error updating profile picture:', err);
    res.status(500).json({ message: 'Error uploading photo', error: err.message });
  }
};
