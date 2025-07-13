    // Load environment variables from .env file
    require('dotenv').config();

    const express = require('express');
    const mongoose = require('mongoose');
    const cors = require('cors');

    const app = express();
    const PORT = process.env.PORT || 5000; // Use port from .env or default to 5000
    const MONGODB_URI = process.env.MONGODB_URI;

    // --- Middleware ---
    // Enable CORS for all origins (for development)
    // In production, you should restrict this to your frontend's domain:
    // app.use(cors({ origin: 'http://your-frontend-domain.com' }));
    app.use(cors());

    // Parse JSON request bodies
    app.use(express.json());

    // --- MongoDB Connection ---
    mongoose.connect(MONGODB_URI)
      .then(() => console.log('MongoDB connected successfully!'))
      .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1); // Exit process with failure
      });

    // --- Mongoose Schema and Model ---
    const wellnessResultSchema = new mongoose.Schema({
      userId: {
        type: String,
        required: true,
      },
      mode: {
        type: String,
        required: true,
      },
      score: {
        type: Number,
        required: true,
      },
      answers: {
        type: Object, // Store answers as a flexible object
        required: true,
      },
      timestamp: {
        type: Date,
        default: Date.now, // Automatically set creation timestamp
      },
    });

    const WellnessResult = mongoose.model('WellnessResult', wellnessResultSchema);

    // --- API Routes ---

    // POST /api/wellnessResults
    // Saves a new wellness assessment result
    app.post('/api/wellnessResults', async (req, res) => {
      try {
        const { userId, mode, score, answers, timestamp } = req.body;

        // Basic validation
        if (!userId || !mode || score === undefined || !answers) {
          return res.status(400).json({ message: 'Missing required fields' });
        }

        const newResult = new WellnessResult({
          userId,
          mode,
          score,
          answers,
          timestamp: timestamp ? new Date(timestamp) : undefined, // Use provided timestamp or default
        });

        await newResult.save();
        res.status(201).json({ message: 'Result saved successfully!', resultId: newResult._id });
      } catch (error) {
        console.error('Error saving wellness result:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
      }
    });

    // GET /api/wellnessResults/:userId
    // Fetches all wellness assessment results for a specific user, sorted by timestamp descending
    app.get('/api/wellnessResults/:userId', async (req, res) => {
      try {
        const { userId } = req.params;

        if (!userId) {
          return res.status(400).json({ message: 'User ID is required' });
        }

        const results = await WellnessResult.find({ userId: userId })
                                          .sort({ timestamp: -1 }); // Sort by timestamp descending

        res.status(200).json(results);
      } catch (error) {
        console.error('Error fetching wellness results:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
      }
    });

    // --- Start the Server ---
    app.listen(PORT, () => {
      console.log(`Backend server running on port ${PORT}`);
      console.log(`MongoDB URI: ${MONGODB_URI ? 'Connected' : 'Not Provided'}`);
    });
    