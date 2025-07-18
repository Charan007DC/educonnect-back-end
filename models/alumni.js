const mongoose = require('mongoose');

const alumniSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true , unique: true },
  password: { type: String, required: true },
  batch: { type: String, required: true },
  description: { type: String }
});

module.exports = mongoose.model('Alumni', alumniSchema);
