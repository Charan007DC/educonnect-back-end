const http = require('http');
const mongoose = require('mongoose');
require('dotenv').config();
const url = require('url');

// Define student and alumni schemas
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  department: String,
  graduationYear: String,
});

const Student = mongoose.model('Student', userSchema, 'students');
const Alumni = mongoose.model('Alumni', userSchema, 'alumni');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

// Create HTTP server
const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);

  if (req.method === 'GET' && parsedUrl.pathname === '/api/search') {
    const query = parsedUrl.query.q || '';
    const type = parsedUrl.query.type || '';

    if (!query || !type || !['student', 'alumni'].includes(type.toLowerCase())) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid or missing query/type' }));
      return;
    }

    const Model = type.toLowerCase() === 'student' ? Student : Alumni;

    try {
      const users = await Model.find({}, 'name email department graduationYear');

      const results = users.filter(user => {
        const q = query.toLowerCase();
        return (
          user.name.toLowerCase().includes(q) ||
          user.email.toLowerCase().includes(q) ||
          user.department.toLowerCase().includes(q) ||
          user.graduationYear.toString().includes(q)
        );
      });

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ results }));
    } catch (err) {
      console.error('Search error:', err);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Server error' }));
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

// Start server on Render (PORT is auto-provided)
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
