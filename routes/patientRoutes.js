const express = require('express');
const router = express.Router();
const { createPatient, getPatient } = require('../controllers/patientController');

router.post('/', createPatient);
router.get('/:id', getPatient);

module.exports = router;