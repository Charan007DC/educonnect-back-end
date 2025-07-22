const Student = require('../models/student');
const Alumni = require('../models/alumni');

exports.searchProfiles = async (req, res) => {
  const { type, query } = req.query;

  if (!type || !query) {
    return res.status(400).json({ message: 'Type and query are required' });
  }

  if (!['student', 'alumni'].includes(type.toLowerCase())) {
    return res.status(400).json({ message: 'Type must be either student or alumni' });
  }

  try {
    const regex = new RegExp(query, 'i'); // fuzzy search: case-insensitive + partial

    const Model = type.toLowerCase() === 'student' ? Student : Alumni;

    const results = await Model.find({
      $or: [
        { name: regex },
        { email: regex },
        { department: regex },
        { graduationYear: regex }
      ]
    }).select('_id name email graduationYear department');

    res.status(200).json({ results });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
