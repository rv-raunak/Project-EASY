const express = require('express');
const mongoose = require('mongoose');
const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/medreminder', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected');
}).catch(err => console.log(err));

app.use(express.json());
app.use('/bp', require('./Routes/Bp_Routes'));


app.listen(5000, () => console.log("Server running on http://localhost:5000"));
