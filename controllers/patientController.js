const Patient = require('../models/Patient');

// Create new patient
exports.createPatient = async (req, res) => {
  try {
    const patient = new Patient(req.body);
    await patient.save();
    res.status(201).json({ message: 'Patient created successfully', patient });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get single patient by ID
exports.getPatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.status(200).json({ patient });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all patients (New function added)
exports.getPatients = async (req, res) => {
  try {
    const patients = await Patient.find();
    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};