const Admin = require('../models/admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//register admin
exports.registerAdmin = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Please provide username and password.' });
        }

        const existingAdmin = await Admin.findOne({ username });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Admin with this username already exists.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newAdmin = new Admin({
            username,
            password: hashedPassword
        });

        await newAdmin.save();

        res.status(201).json({ message: 'Admin registered successfully.' });

    } catch (error) {
        console.error("Error registering admin:", error);
        res.status(500).json({ message: 'Server error' });
    }
};


// Login Admin using username and password
exports.loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const payload = { 
        id: admin._id, 
        role: 'Admin' 
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      admin: {
        username: admin.username,
        role: 'Admin' 
      }
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAdminDashboard = async (req, res) => {
  try {
    const dashboardData = {
      totalUsers: 120,
      activeAlumni: 45,
      mentorshipRequests: 8,
      reports: 3
    };

    res.status(200).json({
      message: 'Admin dashboard data fetched successfully',
      dashboard: dashboardData
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to load dashboard', error: err.message });
  }
};
