const mongoose = require('mongoose');

const OxygenSchema = new mongoose.Schema({
  userId: String,
  oxygenLevel: Number,  // SpO2 percentage
  pulse: Number,        // Pulse along with SpO2 is common in oximeters
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Oxygen', OxygenSchema);
