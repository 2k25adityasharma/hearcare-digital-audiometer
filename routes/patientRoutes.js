const express = require('express');
const router = express.Router();
const { createPatient, getPatient, getPatients } = require('../controllers/patientController');

router.post('/', createPatient);
router.get('/', getPatients); // <-- Ye line missing thi
router.get('/:id', getPatient);

module.exports = router;