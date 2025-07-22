const Student = require('../models/student');
const Alumni = require('../models/alumni');

exports.searchProfiles = async (req, res) => {
  const query = req.query.query?.trim();
  const type = req.query.type; // 'student' or 'alumni'

  if (!query || !type) {
    return res.status(400).json({ message: 'Search query and type are required' });
  }

  try {
    const regex = new RegExp(query, 'i'); // case-insensitive regex

    const searchConditions = [
      { name: regex },
      { email: regex },
      { department: regex },
      { institution: regex },
      { graduationYear: { $regex: regex } },
    ];

    if (type === 'student') {
      const students = await Student.find({ $or: searchConditions }).limit(20);
      return res.status(200).json({ results: students });
    }

    if (type === 'alumni') {
      // Add location field for alumni
      const alumniSearch = [...searchConditions, { location: regex }];
      const alumni = await Alumni.find({ $or: alumniSearch }).limit(20);
      return res.status(200).json({ results: alumni });
    }

    return res.status(400).json({ message: 'Invalid type: must be student or alumni' });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
