const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // <-- Ye missing tha, add kar lo
  role: { type: String, enum: ['worker', 'admin'], default: 'worker' }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);