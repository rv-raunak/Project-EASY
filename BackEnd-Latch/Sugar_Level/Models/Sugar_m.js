const mongoose = require('mongoose');

const SugarSchema = new mongoose.Schema({
  userId: String,
  sugarLevel: Number,
  time: { type: Date, default: new Date() },
  suggestion: String
});

module.exports = mongoose.model('Sugar', SugarSchema);
