const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const medRoutes = require('./Routes/medication');
const startReminderJob = require('./Scheduler/ReminderJob');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use('/med', medRoutes);

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/medreminder', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected');
  startReminderJob(); // Start the reminder job after DB connects
}).catch(err => console.log(err));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});