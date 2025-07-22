const express = require('express');
const router = express.Router();
const Student = require('../models/student');
const Alumni = require('../models/alumni');

// POST /api/search
router.post('/search', async (req, res) => {
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ message: 'Search query is required' });
  }

  try {
    const regex = new RegExp(query, 'i'); // case-insensitive, partial match

    const students = await Student.find({
      $or: [
        { name: regex },
        { email: regex },
        { department: regex },
        { graduationYear: regex }
      ]
    });

    const alumni = await Alumni.find({
      $or: [
        { name: regex },
        { email: regex },
        { department: regex },
        { graduationYear: regex }
      ]
    });

    res.status(200).json({
      students: students.map(s => ({
        _id: s._id,
        name: s.name,
        email: s.email,
        graduationYear: s.graduationYear,
        department: s.department
      })),
      alumni: alumni.map(a => ({
        _id: a._id,
        name: a.name,
        email: a.email,
        graduationYear: a.graduationYear,
        department: a.department
      }))
    });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
