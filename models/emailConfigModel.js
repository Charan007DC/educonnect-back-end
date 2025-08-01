const mongoose = require('mongoose');

const emailConfigSchema = new mongoose.Schema({
  email: { type: String, required: true },
  appPassword: { type: String, required: true },
  service: { type: String, default: 'gmail' },
}, { timestamps: true });

module.exports = mongoose.model('EmailConfig', emailConfigSchema);
