const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    default: 'admin' // default admin username
  },
  password: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Admin', adminSchema);
