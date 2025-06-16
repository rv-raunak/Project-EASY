const mongoose = require('mongoose');

const BloodPressureSchema = new mongoose.Schema({
  userId: String,
  systolic: Number,     // Top number
  diastolic: Number,    // Bottom number
  pulse: Number,        // Beats per minute
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('BloodPressure', BloodPressureSchema);
