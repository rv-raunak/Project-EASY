const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const sugarRoutes = require('./Routes/Sugar_r');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/medreminder')
  .then(() => console.log('Connected to MongoDB for Sugar feature'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/sugar', sugarRoutes);

// Start Server
const PORT = 6000;
app.listen(PORT, () => {
  console.log(`Sugar tracking server running on http://localhost:${PORT}`);
});
