const mongoose = require('mongoose');

const MedicationSchema = new mongoose.Schema({
  userId: String,
  medName: String,
  dosage: String,
  time: String, // HH:MM
  taken: { type: Boolean, default: false },
  date: { type: Date, default: new Date() }
});

module.exports = mongoose.model('Medication', MedicationSchema);
