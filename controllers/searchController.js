const Student = require('../models/student');
const Alumni = require('../models/alumni');

const searchProfiles = async (req, res, query) => {
  try {
    const { query: searchQuery, type } = query;

    if (!searchQuery || !type || !['student', 'alumni'].includes(type.toLowerCase())) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'Invalid or missing query/type' }));
    }

    const Model = type.toLowerCase() === 'student' ? Student : Alumni;

    // Fuzzy match on multiple fields using regex
    const results = await Model.find({
      $or: [
        { name: { $regex: searchQuery, $options: 'i' } },
        { department: { $regex: searchQuery, $options: 'i' } },
        { institution: { $regex: searchQuery, $options: 'i' } },
        { location: { $regex: searchQuery, $options: 'i' } },
        { skills: { $regex: searchQuery, $options: 'i' } },
        { academicInterests: { $regex: searchQuery, $options: 'i' } },
        { 'projects.title': { $regex: searchQuery, $options: 'i' } },
        { 'projects.description': { $regex: searchQuery, $options: 'i' } },
      ]
    });

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ results }));

  } catch (err) {
    console.error('🔴 Search Controller Error:', err);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Server error' }));
  }
};

module.exports = searchProfiles;
