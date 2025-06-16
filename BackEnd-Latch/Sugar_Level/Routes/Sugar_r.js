const express = require('express');
const router = express.Router();
const Sugar = require('../Models/Sugar_m');

// Utility function to generate suggestion
function getSuggestion(level) {
  if (level < 70) return 'Low sugar! Eat something sweet and rest. Consult a doctor if needed.';
  if (level <= 140) return 'Normal sugar level. Keep maintaining a healthy lifestyle.';
  if (level <= 180) return 'Borderline high. Monitor your diet and lifestyle.';
  return 'High sugar! Avoid sugary foods, exercise, and consult a doctor.';
}

// Submit sugar level
router.post('/submit', async (req, res) => {
  const { userId, sugarLevel } = req.body;
  const suggestion = getSuggestion(sugarLevel);

  const reading = new Sugar({ userId, sugarLevel, suggestion });
  await reading.save();

  res.json({
    message: 'Sugar reading saved successfully.',
    suggestion
  });
});

// Get sugar history
router.get('/history/:userId', async (req, res) => {
  const readings = await Sugar.find({ userId: req.params.userId }).sort({ time: -1 });
  res.json(readings);
});

module.exports = router;
