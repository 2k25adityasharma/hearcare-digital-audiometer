const mongoose = require('mongoose');

const testResultSchema = new mongoose.Schema({
  patientId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Patient', 
    required: true 
  },
  operatorId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  leftEar: [
    { frequency: Number, thresholdDb: Number }
  ],
  rightEar: [
    { frequency: Number, thresholdDb: Number }
  ],
  hearingLossType: { 
    type: String, 
    enum: ['Normal', 'Mild', 'Moderate', 'Severe', 'Profound'], 
    default: 'Normal' 
  },
  testedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TestResult', testResultSchema);