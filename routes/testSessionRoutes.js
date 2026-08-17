const express = require('express');
const router = express.Router();
const { submitTestSession, getTestSessionsForPatient } = require('../controllers/testSessionController');

router.post('/', submitTestSession);
router.get('/patient/:patientId', getTestSessionsForPatient);

module.exports = router;