const express = require('express');
const router = express.Router();
const Oxygen = require('../Models/Oxygen_m');

// Route to submit oxygen data
router.post('/submit', async (req, res) => {
  const { userId, oxygenLevel } = req.body;

  const newReading = new Oxygen({ userId, oxygenLevel });

  try {
    await newReading.save();
    res.status(201).json({ message: 'Oxygen reading saved successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save oxygen reading' });
  }
});

// ✅ Route to get oxygen history for a user
router.get('/history/:userId', async (req, res) => {
  try {
    const history = await Oxygen.find({ userId: req.params.userId }).sort({ date: -1 });
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve oxygen history' });
  }
});

module.exports = router;
