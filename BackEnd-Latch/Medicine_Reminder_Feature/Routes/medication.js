const express = require('express');
const router = express.Router();
const Medication = require('../Models/Medication');

// Add medication
router.post('/add', async (req, res) => {
  const { userId, medName, dosage, time } = req.body;
  const newMed = new Medication({ userId, medName, dosage, time });
  await newMed.save();
  res.json({ message: 'Medication added!' });
});

// Mark as taken
router.post('/mark-taken/:id', async (req, res) => {
  const med = await Medication.findById(req.params.id);
  if (!med) return res.status(404).json({ error: 'Not found' });
  med.taken = true;
  await med.save();
  res.json({ message: 'Marked as taken' });
});

// Get meds for a user
router.get('/user/:userId', async (req, res) => {
  const meds = await Medication.find({ userId: req.params.userId });
  res.json(meds);
});

router.put('/taken/:id', async (req, res) => {
  await Medication.findByIdAndUpdate(req.params.id, { taken: true });
  res.json({ message: 'Marked as taken' });
});

module.exports = router;