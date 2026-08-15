const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  ageGroup: { type: String, enum: ['kids', 'middle_age', 'elderly'], required: true },
  language: { type: String, default: 'english' },
  familyPhone: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Patient', patientSchema);