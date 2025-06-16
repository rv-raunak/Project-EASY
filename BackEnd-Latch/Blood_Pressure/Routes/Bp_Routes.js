const express = require('express');
const router = express.Router();
const BloodPressure = require('../Models/Bp');

router.post('/submit', async (req, res) => {
  const { userId, systolic, diastolic, pulse } = req.body;

  const bp = new BloodPressure({ userId, systolic, diastolic, pulse });
  await bp.save();

  const bpSuggestion = generateBPSuggestion(systolic, diastolic);
  const pulseSuggestion = generatePulseSuggestion(pulse);

  res.json({
    message: 'BP and pulse saved',
    bpSuggestion,
    pulseSuggestion
  });
});

function generateBPSuggestion(s, d) {
  if (s >= 140 || d >= 90) return "⚠️ High blood pressure. Please consult a doctor.";
  if (s < 90 || d < 60) return "⚠️ Low blood pressure. Stay hydrated and rest.";
  return "✅ Blood pressure is within normal range.";
}

function generatePulseSuggestion(p) {
  if (p > 100) return "⚠️ High pulse. Avoid stress and caffeine.";
  if (p < 60) return "⚠️ Low pulse. Could be normal if you're an athlete, otherwise consult a doctor.";
  return "✅ Pulse rate is normal.";
}

module.exports = router;
