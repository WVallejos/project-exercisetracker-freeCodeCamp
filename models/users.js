const mongoose = require('mongoose');

// User schema
const userSchema = new mongoose.Schema({
  username: String,
}, { versionKey: false });

module.exports = mongoose.model('User', userSchema);