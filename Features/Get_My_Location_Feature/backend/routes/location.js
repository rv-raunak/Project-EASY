const express = require('express');
const router = express.Router();
const Location = require('../Models/Location');

// Save location
router.post('/add', async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    const newLocation = new Location({ latitude, longitude });
    await newLocation.save();
    res.status(201).json({ message: 'Location saved successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all locations
router.get('/all', async (req, res) => {
  try {
    const locations = await Location.find({});
    res.json(locations);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch locations' });
  }
});

module.exports = router;
