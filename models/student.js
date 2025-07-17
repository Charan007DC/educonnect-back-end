const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  register_no: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  year: { type: String, required: true },
  semester: { type: String, required: true },
  description: { type: String }
});

module.exports = mongoose.model('Student', studentSchema);
