const Admin = require('../models/admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Login Admin using username and password
exports.loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find admin by username
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: admin._id, role: 'admin' }, // Assuming role is always admin
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      admin: {
        username: admin.username,
        role: 'admin'
      }
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getAdminDashboard = async (req, res) => {
  try {
    // Dummy data — Replace with DB queries if needed
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
