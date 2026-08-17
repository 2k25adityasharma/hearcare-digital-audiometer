const TestResult = require('../models/TestResult');

// Save Audiogram Test
exports.saveTestResult = async (req, res) => {
  try {
    const newTest = new TestResult(req.body);
    await newTest.save();
    res.status(201).json({ success: true, message: 'Test saved successfully', data: newTest });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Fetch Patient Test History
exports.getPatientTests = async (req, res) => {
  try {
    const tests = await TestResult.find({ patientId: req.params.patientId }).populate('patientId');
    res.status(200).json({ success: true, data: tests });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};