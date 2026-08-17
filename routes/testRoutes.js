const express = require('express');
const router = express.Router();
const { saveTestResult, getPatientTests } = require('../controllers/testController');

router.post('/save', saveTestResult);
router.get('/patient/:patientId', getPatientTests);

module.exports = router;