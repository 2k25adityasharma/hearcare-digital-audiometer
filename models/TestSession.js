const mongoose = require('mongoose');

const responseLogEntrySchema = new mongoose.Schema({
  level: { type: Number, required: true },
  heard: { type: Boolean, required: true },
  direction: { type: String, enum: ['up', 'down'], required: true },
  timestamp: { type: Number, required: true },
}, { _id: false });

const frequencyResultSchema = new mongoose.Schema({
  frequency: { type: Number, required: true },
  thresholdDbHL: { type: Number, default: null },
  reliable: { type: Boolean, required: true },
  responseLog: [responseLogEntrySchema],
}, { _id: false });

const testSessionSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  ear: { type: String, enum: ['left', 'right'], required: true },
  protocol: { type: String, default: 'hughson_westlake_demo_v1' },
  frequencies: [{ type: Number }],
  results: [frequencyResultSchema],
  status: { type: String, enum: ['completed', 'rejected'], required: true },
  rejectionReason: {
    type: String,
    enum: ['incomplete', 'invalid_sequence', 'excessive_noise', 'unreliable_responses', null],
    default: null,
  },
  pta: { type: Number, default: null },
  severity: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('TestSession', testSessionSchema);
