const TestSession = require('../models/TestSession');
const REQUIRED_FREQUENCIES = [500, 1000, 2000, 4000];

// Re-run the same ascend/descend logic against the raw log to confirm
// the threshold the frontend reported. Returns null if it can't be confirmed.
function recomputeThreshold(responseLog) {
  if (!Array.isArray(responseLog) || responseLog.length === 0) return null;

  const ascendStats = {};
  let prevLevel = null;

  for (const entry of responseLog) {
    if (
      typeof entry.level !== 'number' ||
      typeof entry.heard !== 'boolean' ||
      !['up', 'down'].includes(entry.direction)
    ) {
      return null; // malformed entry -> can't trust this log
    }

    if (entry.direction === 'up') {
      if (!ascendStats[entry.level]) ascendStats[entry.level] = { heard: 0, trials: 0 };
      ascendStats[entry.level].trials += 1;
      if (entry.heard) ascendStats[entry.level].heard += 1;
    }

    prevLevel = entry.level;
  }

  // find the lowest level where 2 of 3 ascending trials were heard
  let threshold = null;
  Object.keys(ascendStats)
    .map(Number)
    .sort((a, b) => a - b)
    .forEach((level) => {
      const stat = ascendStats[level];
      if (threshold === null && stat.trials >= 3 && stat.heard >= 2) {
        threshold = level;
      }
    });

  return threshold;
}

function classifySeverity(ptaDb) {
  if (ptaDb <= 25) return 'Normal';
  if (ptaDb <= 40) return 'Mild';
  if (ptaDb <= 55) return 'Moderate';
  if (ptaDb <= 70) return 'Moderately Severe';
  if (ptaDb <= 90) return 'Severe';
  return 'Profound';
}

exports.submitTestSession = async (req, res) => {
  try {
    const { patientId, ear, protocol, frequencies, results } = req.body;

    if (!patientId || !ear || !Array.isArray(results)) {
      return res.status(400).json({ error: 'patientId, ear, and results are required' });
    }

    // 1. Completeness check
    const submittedFrequencies = results.map((r) => r.frequency);
    const missing = REQUIRED_FREQUENCIES.filter((f) => !submittedFrequencies.includes(f));

    if (missing.length > 0) {
      const rejected = await TestSession.create({
        patient: patientId,
        ear,
        protocol,
        frequencies,
        results,
        status: 'rejected',
        rejectionReason: 'incomplete',
      });
      return res.status(201).json({ message: 'Session rejected: incomplete', session: rejected });
    }

    // 2. Re-verify each frequency's threshold against its raw response log
    let hasInvalidSequence = false;
    let hasUnreliable = false;

    const verifiedResults = results.map((r) => {
      const recomputed = recomputeThreshold(r.responseLog);
      if (recomputed === null && r.reliable !== false) {
        // frontend claimed reliable but we can't confirm it -> treat as invalid sequence
        hasInvalidSequence = true;
      }
      if (recomputed === null) {
        hasUnreliable = true;
      }
      return { ...r, thresholdDbHL: recomputed, reliable: recomputed !== null };
    });

    if (hasInvalidSequence) {
      const rejected = await TestSession.create({
        patient: patientId,
        ear,
        protocol,
        frequencies,
        results: verifiedResults,
        status: 'rejected',
        rejectionReason: 'invalid_sequence',
      });
      return res.status(201).json({ message: 'Session rejected: invalid_sequence', session: rejected });
    }

    if (hasUnreliable) {
      const rejected = await TestSession.create({
        patient: patientId,
        ear,
        protocol,
        frequencies,
        results: verifiedResults,
        status: 'rejected',
        rejectionReason: 'unreliable_responses',
      });
      return res.status(201).json({ message: 'Session rejected: unreliable_responses', session: rejected });
    }

    // 3. All good — compute PTA and severity, save as completed
    const thresholds = verifiedResults.map((r) => r.thresholdDbHL);
    const pta = thresholds.reduce((sum, t) => sum + t, 0) / thresholds.length;
    const severity = classifySeverity(pta);

    const session = await TestSession.create({
      patient: patientId,
      ear,
      protocol,
      frequencies,
      results: verifiedResults,
      status: 'completed',
      pta,
      severity,
    });

    return res.status(201).json({ message: 'Test session saved', session });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

exports.getTestSessionsForPatient = async (req, res) => {
  try {
    const sessions = await TestSession.find({ patient: req.params.patientId }).sort({ createdAt: -1 });
    res.status(200).json({ sessions });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};