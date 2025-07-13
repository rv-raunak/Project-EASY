import React, { useState, useEffect, createContext, useContext } from 'react';

// App Context for easy access to shared state (like userId)
const AppContext = createContext(null);

// Custom hook to use App context
const useAppContext = () => useContext(AppContext);

// Helper function to shuffle an array
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Swap elements
  }
  return shuffled;
};

// Questions data based on the provided PDF
const quickModeQuestions = [
  {
    id: 1,
    question: "How often do you feel emotionally exhausted without knowing why?",
    options: [
      { text: "Rarely", score: 10 },
      { text: "Sometimes", score: 20 },
      { text: "Often", score: 30 },
      { text: "Almost every day", score: 40 },
    ],
  },
  {
    id: 2,
    question: "When facing minor problems, how does your mind typically react?",
    options: [
      { text: "I stay calm", score: 10 },
      { text: "I feel a little stressed", score: 20 },
      { text: "I overthink for hours", score: 30 },
      { text: "I panic or shut down", score: 40 },
    ],
  },
  {
    id: 3,
    question: "How would you describe your social interactions lately?",
    options: [
      { text: "Engaging and fulfilling", score: 10 },
      { text: "Neutral or routine", score: 20 },
      { text: "Draining or forced", score: 30 },
      { text: "I avoid people now", score: 40 },
    ],
  },
  {
    id: 4,
    question: "Do you feel joy while doing things you used to love?",
    options: [
      { text: "As much as ever", score: 10 },
      { text: "A little less", score: 20 },
      { text: "It feels like a task now", score: 30 },
      { text: "I don't enjoy them anymore", score: 40 },
    ],
  },
  {
    id: 5,
    question: "How often do you feel like a burden to others?",
    options: [
      { text: "Never", score: 10 },
      { text: "Occasionally", score: 20 },
      { text: "Frequently", score: 30 },
      { text: "Constantly", score: 40 },
    ],
  },
  {
    id: 6,
    question: "Do you experience restlessness, even in silence?",
    options: [
      { text: "Rarely", score: 10 },
      { text: "Sometimes", score: 20 },
      { text: "Often", score: 30 },
      { text: "Almost always", score: 40 },
    ],
  },
  {
    id: 7,
    question: "How do you view your future right now?",
    options: [
      { text: "Hopeful and optimistic", score: 10 },
      { text: "Cautiously positive", score: 20 },
      { text: "Unclear or doubtful", score: 30 },
      { text: "Dark or directionless", score: 40 },
    ],
  },
  {
    id: 8,
    question: "When you wake up, what's the first emotional response?",
    options: [
      { text: "Gratitude or peace", score: 10 },
      { text: "Slight pressure", score: 20 },
      { text: "Dread or disinterest", score: 30 },
      { text: "Emptiness or fear", score: 40 },
    ],
  },
  {
    id: 9,
    question: "How frequently do you wish to just disappear or not exist?",
    options: [
      { text: "Never", score: 10 },
      { text: "Rarely", score: 20 },
      { text: "Often", score: 30 },
      { text: "It's a daily thought", score: 40 },
    ],
  },
  {
    id: 10,
    question: "How's your energy level during the day?",
    options: [
      { text: "Full of energy", score: 10 },
      { text: "Normal ups and downs", score: 20 },
      { text: "Mostly tired", score: 30 },
      { text: "Drained all the time", score: 40 },
    ],
  },
  {
    id: 11,
    question: "Do you feel emotionally supported by people around you?",
    options: [
      { text: "Absolutely", score: 10 },
      { text: "Sometimes", score: 20 },
      { text: "Not really", score: 30 },
      { text: "I feel completely alone", score: 40 },
    ],
  },
  {
    id: 12,
    question: "When you look in the mirror, what do you usually feel?",
    options: [
      { text: "Confidence or calm", score: 10 },
      { text: "Indifference", score: 20 },
      { text: "Criticism", score: 30 },
      { text: "Shame or sadness", score: 40 },
    ],
  },
];

const definedModeQuestions = [
  {
    id: 1,
    question: "How often do you feel emotionally exhausted without knowing why?",
    options: [
      { text: "Rarely", score: 10 },
      { text: "Sometimes", score: 20 },
      { text: "Often", score: 30 },
      { text: "Almost every day", score: 40 },
    ],
  },
  {
    id: 2,
    question: "When facing minor problems, how does your mind typically react?",
    options: [
      { text: "I stay calm", score: 10 },
      { text: "I feel a little stressed", score: 20 },
      { text: "I overthink for hours", score: 30 },
      { text: "I panic or shut down", score: 40 },
    ],
  },
  {
    id: 3,
    question: "How would you describe your social interactions lately?",
    options: [
      { text: "Engaging and fulfilling", score: 10 },
      { text: "Neutral or routine", score: 20 },
      { text: "Draining or forced", score: 30 },
      { text: "I avoid people now", score: 40 },
    ],
  },
  {
    id: 4,
    question: "Do you feel joy while doing things you used to love?",
    options: [
      { text: "As much as ever", score: 10 },
      { text: "A little less", score: 20 },
      { text: "It feels like a task now", score: 30 },
      { text: "I don’t enjoy them anymore", score: 40 },
    ],
  },
  {
    id: 5,
    question: "How often do you feel like a burden to others?",
    options: [
      { text: "Never", score: 10 },
      { text: "Occasionally", score: 20 },
      { text: "Frequently", score: 30 },
      { text: "Constantly", score: 40 },
    ],
  },
  {
    id: 6,
    question: "Do you experience restlessness, even in silence?",
    options: [
      { text: "Rarely", score: 10 },
      { text: "Sometimes", score: 20 },
      { text: "Often", score: 30 },
      { text: "Almost always", score: 40 },
    ],
  },
  {
    id: 7,
    question: "How do you view your future right now?",
    options: [
      { text: "Hopeful and optimistic", score: 10 },
      { text: "Cautiously positive", score: 20 },
      { text: "Unclear or doubtful", score: 30 },
      { text: "Dark or directionless", score: 40 },
    ],
  },
  {
    id: 8,
    question: "When you wake up, what’s the first emotional response?",
    options: [
      { text: "Gratitude or peace", score: 10 },
      { text: "Slight pressure", score: 20 },
      { text: "Dread or disinterest", score: 30 },
      { text: "Emptiness or fear", score: 40 },
    ],
  },
  {
    id: 9,
    question: "How frequently do you wish to just disappear or not exist?",
    options: [
      { text: "Never", score: 10 },
      { text: "Rarely", score: 20 },
      { text: "Often", score: 30 },
      { text: "It’s a daily thought", score: 40 },
    ],
  },
  {
    id: 10,
    question: "How’s your energy level during the day?",
    options: [
      { text: "Full of energy", score: 10 },
      { text: "Normal ups and downs", score: 20 },
      { text: "Mostly tired", score: 30 },
      { text: "Drained all the time", score: 40 },
    ],
  },
  {
    id: 11,
    question: "Do you feel emotionally supported by people around you?",
    options: [
      { text: "Absolutely", score: 10 },
      { text: "Sometimes", score: 20 },
      { text: "Not really", score: 30 },
      { text: "I feel completely alone", score: 40 },
    ],
  },
  {
    id: 12,
    question: "When you look in the mirror, what do you usually feel?",
    options: [
      { text: "Confidence or calm", score: 10 },
      { text: "Indifference", score: 20 },
      { text: "Criticism", score: 30 },
      { text: "Shame or sadness", score: 40 },
    ],
  },
  {
    id: 13,
    question: "Do you find yourself withdrawing from activities even when you're free?",
    options: [
      { text: "Rarely", score: 10 },
      { text: "Sometimes", score: 20 },
      { text: "Often", score: 30 },
      { text: "Almost always", score: 40 },
    ],
  },
  {
    id: 14,
    question: "Do you find it hard to focus, even on simple tasks?",
    options: [
      { text: "No, I’m focused", score: 10 },
      { text: "Sometimes I lose track", score: 20 },
      { text: "I get distracted easily", score: 30 },
      { text: "I can’t concentrate at all", score: 40 },
    ],
  },
  {
    id: 15,
    question: "Do you ever feel like your life is on autopilot?",
    options: [
      { text: "No, I feel in control", score: 10 },
      { text: "Occasionally", score: 20 },
      { text: "Frequently", score: 30 },
      { text: "Constantly", score: 40 },
    ],
  },
  {
    id: 16,
    question: "How do you respond to compliments or appreciation?",
    options: [
      { text: "I accept and value them", score: 10 },
      { text: "I feel a little awkward", score: 20 },
      { text: "I doubt if they’re true", score: 30 },
      { text: "I feel unworthy of them", score: 40 },
    ],
  },
  {
    id: 17,
    question: "How do you usually deal with emotional pain?",
    options: [
      { text: "I talk it out or write it down", score: 10 },
      { text: "I try to ignore it", score: 20 },
      { text: "I numb it with distractions", score: 30 },
      { text: "I feel crushed by it", score: 40 },
    ],
  },
  {
    id: 18,
    question: "How often do you pretend to be “fine” when you’re not?",
    options: [
      { text: "Rarely", score: 10 },
      { text: "Sometimes", score: 20 },
      { text: "Frequently", score: 30 },
      { text: "All the time", score: 40 },
    ],
  },
  {
    id: 19,
    question: "When was the last time you cried?",
    options: [
      { text: "Within a healthy emotional moment", score: 10 },
      { text: "During a mild breakdown", score: 20 },
      { text: "Due to overwhelming stress", score: 30 },
      { text: "I cry secretly and often", score: 40 },
    ],
  },
  {
    id: 20,
    question: "Do you ever feel disconnected from your surroundings or your body?",
    options: [
      { text: "No, I feel grounded", score: 10 },
      { text: "Occasionally", score: 20 },
      { text: "Frequently", score: 30 },
      { text: "I often feel detached", score: 40 },
    ],
  },
  {
    id: 21,
    question: "Do you feel safe in your own mind?",
    options: [
      { text: "Yes, always", score: 10 },
      { text: "Mostly", score: 20 },
      { text: "Sometimes not", score: 30 },
      { text: "No, it’s a chaotic place", score: 40 },
    ],
  },
  {
    id: 22,
    question: "When was the last time you laughed genuinely?",
    options: [
      { text: "Today or yesterday", score: 10 },
      { text: "A few days ago", score: 20 },
      { text: "A few weeks ago", score: 30 },
      { text: "I can’t remember", score: 40 },
    ],
  },
  {
    id: 23,
    question: "Do you find yourself reliving painful memories often?",
    options: [
      { text: "Rarely", score: 10 },
      { text: "Sometimes", score: 20 },
      { text: "Frequently", score: 30 },
      { text: "Constantly", score: 40 },
    ],
  },
  {
    id: 24,
    question: "Do you judge yourself harshly for small mistakes?",
    options: [
      { text: "Never", score: 10 },
      { text: "Occasionally", score: 20 },
      { text: "Most of the time", score: 30 },
      { text: "I overthink them for days", score: 40 },
    ],
  },
  {
    id: 25,
    question: "Do you feel like you are truly living—or just existing?",
    options: [
      { text: "I feel alive and purposeful", score: 10 },
      { text: "I try to live intentionally", score: 20 },
      { text: "I go through the motions", score: 30 },
      { text: "I feel like a shadow of myself", score: 40 },
    ],
  },
];

// AppProvider component to provide a userId
const AppProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    // Generate a unique user ID for this session
    setUserId(crypto.randomUUID());
    setAppReady(true);
  }, []);

  return (
    <AppContext.Provider value={{ userId, appReady }}>
      {children}
    </AppContext.Provider>
  );
};

// Onboarding screen component
const OnboardingScreen = ({ onStartQuiz, onViewHistory }) => {
  return (
    <div className="app-container app-container--onboarding">
      <div className="card onboarding-card">
        <h1 className="main-heading">Welcome to the Mental Wellness Assessment</h1>
        <p className="sub-heading">
          Life can be heavy. Our minds carry more than we speak about—and sometimes, we don't realize how much until we pause. This tool is designed to help you take that pause.
        </p>
        <div className="mode-grid">
          <div className="mode-card mode-card--blue">
            <h2 className="mode-heading">Quick Mode (~2 mins - 12 Questions)</h2>
            <p className="mode-description">
              For when you're in a hurry, but still want a snapshot of where you stand. It uses deeply tested psychological indicators to deliver maximum insight with minimal time.
            </p>
          </div>
          <div className="mode-card mode-card--purple">
            <h2 className="mode-heading">Defined Mode (~4-6 mins - 25 Questions)</h2>
            <p className="mode-description">
              For a more detailed mental health picture. The more time you give, the more precisely we can understand your emotional and cognitive wellness.
            </p>
          </div>
        </div>
        <p className="info-text">
          This is not a diagnostic tool, but a self-awareness guide designed with help from psychology-backed research. All answers are confidential and meant to help you reflect and grow.
        </p>
        <div className="onboarding-buttons">
          <button
            onClick={onStartQuiz}
            className="btn btn-primary"
          >
            Start Assessment
          </button>
          <button
            onClick={onViewHistory}
            className="btn btn-secondary"
          >
            View Past Results
          </button>
        </div>
      </div>
    </div>
  );
};

// Mode selection screen component
const ModeSelectionScreen = ({ onSelectMode, onViewHistory }) => {
  return (
    <div className="app-container app-container--mode-selection">
      <div className="card mode-selection-card">
        <h1 className="main-heading">Choose Your Assessment Mode</h1>
        <p className="sub-heading">Select a mode to begin your mental wellness assessment.</p>
        <div className="mode-buttons-container">
          <button
            onClick={() => onSelectMode('quick')}
            className="btn btn-mode-blue"
          >
            Quick Mode (12 Questions)
          </button>
          <button
            onClick={() => onSelectMode('defined')}
            className="btn btn-mode-purple"
          >
            Defined Mode (25 Questions)
          </button>
          <button
            onClick={onViewHistory}
            className="btn btn-secondary"
          >
            View Past Results
          </button>
        </div>
      </div>
    </div>
  );
};

// Quiz component
const Quiz = ({ mode, onQuizComplete }) => {
  const { userId, appReady } = useAppContext();
  const initialQuestions = mode === 'quick' ? quickModeQuestions : definedModeQuestions;

  // Shuffle questions once when the component mounts or mode changes
  const [shuffledQuestions, setShuffledQuestions] = useState(() => shuffleArray(initialQuestions));

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  // Handle option selection
  const handleOptionSelect = (questionId, score) => {
    setAnswers({ ...answers, [questionId]: score });
  };

  // Move to the next question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < shuffledQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      calculateScore();
    }
  };

  // Calculate the total score and show results
  const calculateScore = async () => {
    let score = 0;
    for (const questionId in answers) {
      score += answers[questionId];
    }
    setTotalScore(score);
    setShowResult(true);

    // Save results to hypothetical backend API
    if (appReady && userId) {
      setIsSaving(true);
      setSaveError(null);
      try {
        const response = await fetch('/api/wellnessResults', { // Hypothetical API endpoint
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: userId,
            mode: mode,
            score: score,
            answers: answers,
            timestamp: new Date().toISOString(), // Using ISO string for timestamp
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to save quiz results');
        }

        console.log("Quiz results sent to hypothetical backend!");
      } catch (e) {
        console.error("Error saving wellness result:", e);
        setSaveError(e.message);
      } finally {
        setIsSaving(false);
      }
    }
  };

  // Get result interpretation and suggestions based on score
  const getResultInterpretation = (score) => {
    if (mode === 'quick') {
      if (score >= 120 && score <= 160) return {
        status: "Mentally healthy, emotionally balanced",
        colorClass: "text-green", bgClass: "bg-green-light",
        suggestion: "Great job maintaining your mental well-being! Continue with your healthy habits, practice mindfulness, and stay connected with your support system. Consider exploring new hobbies or learning techniques to further enhance your resilience."
      };
      if (score >= 161 && score <= 240) return {
        status: "Mild emotional disturbance; needs reflection",
        colorClass: "text-yellow", bgClass: "bg-yellow-light",
        suggestion: "You're experiencing some mild emotional strain. Take time for self-reflection. Identify stressors and consider incorporating stress-reducing activities like meditation, light exercise, or journaling into your routine. Don't hesitate to talk to a trusted friend or family member."
      };
      if (score >= 241 && score <= 320) return {
        status: "Moderate distress; early signs of mental strain",
        colorClass: "text-orange", bgClass: "bg-orange-light",
        suggestion: "You're showing moderate signs of mental strain. It's important to prioritize self-care. Focus on getting adequate sleep, maintaining a balanced diet, and engaging in activities that genuinely bring you joy. Consider seeking support from a school counselor, HR representative, or a mental health professional for guidance."
      };
      if (score >= 321 && score <= 480) return {
        status: "High emotional distress; signs of depression or burnout",
        colorClass: "text-red", bgClass: "bg-red-light",
        suggestion: "You're experiencing significant emotional distress. It's highly recommended to seek professional help immediately. Reach out to a mental health professional, a doctor, or a crisis hotline. You don't have to go through this alone. Prioritize your well-being above all else."
      };
    } else { // Defined Mode
      if (score >= 250 && score <= 400) return {
        status: "Healthy & Emotionally Resilient",
        colorClass: "text-green", bgClass: "bg-green-light",
        suggestion: "Your mental well-being is strong! Keep nurturing your emotional resilience by practicing gratitude, maintaining strong social connections, and continuing to engage in activities that foster personal growth and happiness. You might also consider volunteering or mentoring to share your positive energy."
      };
      if (score >= 401 && score <= 600) return {
        status: "Mild emotional strain; monitor regularly",
        colorClass: "text-yellow", bgClass: "bg-yellow-light",
        suggestion: "You're facing some mild emotional challenges. Pay close attention to your daily habits. Are you getting enough rest? Are you managing your time effectively? Implement small, consistent changes like regular breaks, deep breathing exercises, or setting boundaries to protect your energy."
      };
      if (score >= 601 && score <= 800) return {
        status: "Noticeable signs of mental fatigue; suggested self-care and support",
        colorClass: "text-orange", bgClass: "bg-orange-light",
        suggestion: "You're experiencing noticeable mental fatigue. It's time to actively invest in your self-care. This could include dedicating time to hobbies, spending time in nature, or reconnecting with loved ones. If symptoms persist, consider talking to a therapist or counselor who can offer coping strategies and support."
      };
      if (score >= 801 && score <= 1000) return {
        status: "High likelihood of emotional distress or depressive tendencies; consider professional help",
        colorClass: "text-red", bgClass: "bg-red-light",
        suggestion: "Your score indicates a high level of emotional distress. It is critical to seek professional help without delay. A mental health professional can provide a proper assessment and develop a personalized treatment plan. Reach out to a doctor, therapist, or a mental health support organization. Your well-being is paramount."
      };
    }
    return { status: "Unknown", colorClass: "text-gray", bgClass: "bg-gray-light", suggestion: "Unable to provide specific suggestions. Please consult a professional." };
  };

  const result = getResultInterpretation(totalScore);

  if (showResult) {
    return (
      <div className="app-container app-container--result">
        <div className="card result-card">
          <h1 className="main-heading">Your Assessment Result</h1>
          <p className="result-score-text">Your total score is: <span className="score-value">{totalScore}</span></p>
          <div className={`result-interpretation-box ${result.bgClass}`}>
            <h2 className={`result-status-heading ${result.colorClass}`}>Mental Wellness Insight:</h2>
            <p className={`result-status-text ${result.colorClass}`}>{result.status}</p>
          </div>
          <div className="suggestion-box">
            <h3 className="suggestion-heading">Suggestions for Your Well-being:</h3>
            <p className="suggestion-text">{result.suggestion}</p>
          </div>
          {isSaving && <p className="saving-message">Saving results...</p>}
          {saveError && <p className="error-message">Error saving results: {saveError}</p>}
          <button
            onClick={() => onQuizComplete()}
            className="btn btn-primary"
          >
            Take Another Assessment
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = shuffledQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / shuffledQuestions.length) * 100;

  return (
    <div className="app-container app-container--quiz">
      <div className="card quiz-card">
        <div className="progress-section">
          <div className="question-count">
            Question {currentQuestionIndex + 1} of {shuffledQuestions.length}
          </div>
          <div className="progress-bar-background">
            <div
              className="progress-bar-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        <h2 className="question-text">{currentQuestion.question}</h2>
        <div className="options-container">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionSelect(currentQuestion.id, option.score)}
              className={`option-button ${answers[currentQuestion.id] === option.score ? 'option-button--selected' : ''}`}
            >
              {option.text}
            </button>
          ))}
        </div>
        <div className="quiz-navigation">
          <button
            onClick={handleNextQuestion}
            disabled={answers[currentQuestion.id] === undefined}
            className={`btn btn-primary ${answers[currentQuestion.id] === undefined ? 'btn--disabled' : ''}`}
          >
            {currentQuestionIndex === shuffledQuestions.length - 1 ? 'Finish Assessment' : 'Next Question'}
          </button>
        </div>
      </div>
    </div>
  );
};

// History component to display past results
const History = ({ onBackToHome }) => {
  const { userId, appReady } = useAppContext();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      if (!appReady || !userId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        // Hypothetical API endpoint to fetch user-specific results
        const response = await fetch(`/api/wellnessResults/${userId}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch past results');
        }
        const data = await response.json();
        // Assuming the backend returns an array of results, sorted by timestamp descending
        // Sort client-side if backend doesn't guarantee order
        const sortedData = data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setResults(sortedData);
      } catch (e) {
        console.error("Error fetching history:", e);
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
    // In a real application, you might want to poll or use WebSockets for real-time updates
    // For this simulation, we'll just fetch once on component mount/userId change.
  }, [userId, appReady]);

  if (!appReady) {
    return (
      <div className="app-container loading-container">
        <div className="loading-message">Initializing Application...</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="app-container loading-container">
        <div className="loading-message">Loading past results...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-container error-container">
        <div className="error-message-box">
          <div className="error-message">Error loading results: {error}</div>
          <button
              onClick={onBackToHome}
              className="btn btn-primary"
            >
              Back to Home
            </button>
        </div>
      </div>
    );
  }

  const getResultInterpretation = (score, mode) => {
    if (mode === 'quick') {
      if (score >= 120 && score <= 160) return { status: "Mentally healthy, emotionally balanced", colorClass: "text-green", bgClass: "bg-green-light" };
      if (score >= 161 && score <= 240) return { status: "Mild emotional disturbance; needs reflection", colorClass: "text-yellow", bgClass: "bg-yellow-light" };
      if (score >= 241 && score <= 320) return { status: "Moderate distress; early signs of mental strain", colorClass: "text-orange", bgClass: "bg-orange-light" };
      if (score >= 321 && score <= 480) return { status: "High emotional distress; signs of depression or burnout", colorClass: "text-red", bgClass: "bg-red-light" };
    } else { // Defined Mode
      if (score >= 250 && score <= 400) return { status: "Healthy & Emotionally Resilient", colorClass: "text-green", bgClass: "bg-green-light" };
      if (score >= 401 && score <= 600) return { status: "Mild emotional strain; monitor regularly", colorClass: "text-yellow", bgClass: "bg-yellow-light" };
      if (score >= 601 && score <= 800) return { status: "Noticeable signs of mental fatigue; suggested self-care and support", colorClass: "text-orange", bgClass: "bg-orange-light" };
      if (score >= 801 && score <= 1000) return { status: "High likelihood of emotional distress or depressive tendencies; consider professional help", colorClass: "text-red", bgClass: "bg-red-light" };
    }
    return { status: "Unknown", colorClass: "text-gray", bgClass: "bg-gray-light" };
  };

  return (
    <div className="app-container app-container--history">
      <div className="card history-card">
        <h1 className="main-heading">Your Past Assessment Results</h1>
        <p className="user-id-text">Your User ID: <span className="user-id-value">{userId}</span></p>

        {results.length === 0 ? (
          <p className="no-results-message">No past results found. Take an assessment to see your history here!</p>
        ) : (
          <div className="results-grid">
            {results.map((result) => {
              const interpretation = getResultInterpretation(result.score, result.mode);
              const date = result.timestamp ? new Date(result.timestamp).toLocaleString() : 'N/A'; // Parse ISO string
              return (
                <div key={result._id || result.id} className={`result-item ${interpretation.bgClass}`}>
                  <h3 className="result-mode-heading">{result.mode} Mode</h3>
                  <p className="result-score-detail">Score: <span className="result-score-value">{result.score}</span></p>
                  <p className="result-date-detail">Date: <span className="result-date-value">{date}</span></p>
                  <div className={`result-interpretation-box-small ${interpretation.bgClass}`}>
                    <p className={`result-status-text-small ${interpretation.colorClass}`}>{interpretation.status}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="history-navigation">
          <button
            onClick={onBackToHome}
            className="btn btn-primary"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};


// Main App component
const App = () => {
  const [currentPage, setCurrentPage] = useState('onboarding'); // 'onboarding', 'modeSelection', 'quiz', 'history'
  const [quizMode, setQuizMode] = useState(null); // 'quick' or 'defined'

  const handleStartQuiz = () => {
    setCurrentPage('modeSelection');
  };

  const handleSelectMode = (mode) => {
    setQuizMode(mode);
    setCurrentPage('quiz');
  };

  const handleQuizComplete = () => {
    setCurrentPage('history'); // After quiz, show history
  };

  const handleBackToHome = () => {
    setCurrentPage('modeSelection'); // Back to mode selection or onboarding
  };

  const handleViewHistory = () => {
    setCurrentPage('history');
  };

  return (
    <AppProvider>
      <style>{`
        /* Import Google Fonts - Inter */
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

        /* Basic Reset and Global Styles */
        :root {
          /* Colors */
          --color-primary: #4f46e5; /* Indigo-600 */
          --color-primary-hover: #4338ca; /* Indigo-700 */
          --color-secondary: #7c3aed; /* Purple-600 */
          --color-secondary-hover: #6d28d9; /* Purple-700 */
          --color-btn-secondary-bg: #6b7280; /* Gray-500 */
          --color-btn-secondary-hover: #4b5563; /* Gray-700 */


          --color-green: #22c55e;
          --color-yellow: #eab308;
          --color-orange: #f97316;
          --color-red: #ef4444;

          --color-text-dark: #1f2937; /* Gray-800 */
          --color-text-medium: #4b5563; /* Gray-700 */
          --color-text-light: #6b7280; /* Gray-600 */
          --color-text-lighter: #9ca3af; /* Gray-500 */
          --color-text-white: #ffffff;

          --color-border-light: #e5e7eb; /* Gray-200 */
          --color-border-medium: #d1d5db; /* Gray-300 */
          --color-border-blue-light: #bfdbfe; /* Blue-200 */
          --color-border-purple-light: #e9d5ff; /* Purple-200 */

          /* Backgrounds */
          --bg-white: #ffffff;
          --bg-gray-light: #f9fafb; /* Gray-50 */
          --bg-blue-light: #eff6ff; /* Blue-50 */
          --bg-purple-light: #f5f3ff; /* Purple-50 */
          --bg-green-light: #dcfce7; /* Green-100 */
          --bg-yellow-light: #fef9c3; /* Yellow-100 */
          --bg-orange-light: #ffedd5; /* Orange-100 */
          --bg-red-light: #fee2e2; /* Red-100 */

          /* Gradients */
          --gradient-purple-blue: linear-gradient(to bottom right, #ede9fe, #eff6ff); /* from-purple-100 to-blue-100 */
          --gradient-green-teal: linear-gradient(to bottom right, #dcfce7, #ccfbf1); /* from-green-100 to-teal-100 */
          --gradient-indigo-pink: linear-gradient(to bottom right, #e0e7ff, #fce7f3); /* from-indigo-100 to-pink-100 */
          --gradient-blue-purple: linear-gradient(to bottom right, #eff6ff, #f5f3ff); /* from-blue-100 to-purple-100 */
          --gradient-gray-blue: linear-gradient(to bottom right, #f9fafb, #eff6ff); /* from-gray-50 to-blue-50 */

          /* Shadows */
          --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
          --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          --shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }

        body {
          margin: 0;
          font-family: 'Inter', sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        /* App Container Layouts */
        .app-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          padding: 1rem; /* p-4 */
          font-family: 'Inter', sans-serif;
        }

        .app-container--onboarding {
          background-image: var(--gradient-purple-blue);
        }

        .app-container--mode-selection {
          background-image: var(--gradient-green-teal);
        }

        .app-container--quiz {
          background-image: var(--gradient-blue-purple);
        }

        .app-container--result {
          background-image: var(--gradient-indigo-pink);
        }

        .app-container--history {
          background-image: var(--gradient-gray-blue);
        }

        .loading-container, .error-container {
          background-image: var(--gradient-gray-blue); /* Consistent background */
          text-align: center;
        }

        .loading-message {
          font-size: 1.25rem; /* text-xl */
          color: var(--color-text-light);
        }

        .error-message-box {
          background-color: var(--bg-red-light);
          padding: 2rem;
          border-radius: 0.75rem; /* rounded-xl */
          box-shadow: var(--shadow-2xl);
          max-width: 32rem; /* max-w-md */
          width: 100%;
          text-align: center;
        }

        .error-message {
          font-size: 1.25rem; /* text-xl */
          color: var(--color-red);
          margin-bottom: 1rem;
        }


        /* Card Styles */
        .card {
          background-color: var(--bg-white);
          padding: 2rem; /* p-8 */
          border-radius: 0.75rem; /* rounded-xl */
          box-shadow: var(--shadow-2xl);
          max-width: 48rem; /* max-w-2xl */
          width: 100%;
          text-align: center;
        }

        .onboarding-card {
          max-width: 48rem; /* max-w-2xl */
        }

        .mode-selection-card {
          max-width: 28rem; /* max-w-md */
        }

        .quiz-card {
          max-width: 48rem; /* max-w-2xl */
        }

        .result-card {
          max-width: 48rem; /* max-w-2xl */
        }

        .history-card {
          max-width: 64rem; /* max-w-4xl */
          margin-top: 2rem; /* mt-8 */
        }

        /* Headings */
        .main-heading {
          font-size: 2.25rem; /* text-4xl */
          font-weight: 800; /* font-extrabold */
          color: var(--color-text-dark);
          margin-bottom: 1.5rem; /* mb-6 */
        }

        .sub-heading {
          font-size: 1.125rem; /* text-lg */
          color: var(--color-text-light);
          margin-bottom: 2rem; /* mb-8 */
          line-height: 1.625; /* leading-relaxed */
        }

        /* Onboarding Specific Styles */
        .mode-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem; /* gap-6 */
          margin-bottom: 2.5rem; /* mb-10 */
        }

        @media (min-width: 768px) { /* md:grid-cols-2 */
          .mode-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        .mode-card {
          padding: 1.5rem; /* p-6 */
          border-radius: 0.5rem; /* rounded-lg */
          box-shadow: var(--shadow-md);
          border-width: 1px; /* border */
        }

        .mode-card--blue {
          background-color: var(--bg-blue-light);
          border-color: var(--color-border-blue-light);
        }

        .mode-card--purple {
          background-color: var(--bg-purple-light);
          border-color: var(--color-border-purple-light);
        }

        .mode-heading {
          font-size: 1.5rem; /* text-2xl */
          font-weight: 700; /* font-bold */
          margin-bottom: 0.75rem; /* mb-3 */
        }

        .mode-card--blue .mode-heading {
          color: #1d4ed8; /* Blue-700 */
        }

        .mode-card--purple .mode-heading {
          color: #6b21a8; /* Purple-700 */
        }

        .mode-description {
          color: var(--color-text-medium);
        }

        .info-text {
          font-size: 1rem; /* text-md */
          color: var(--color-text-lighter);
          margin-bottom: 2rem; /* mb-8 */
        }

        .onboarding-buttons {
          display: flex;
          flex-direction: column;
          gap: 1rem; /* space-y-4 */
          margin-top: 2rem;
        }
        @media (min-width: 640px) { /* sm:flex-row */
          .onboarding-buttons {
            flex-direction: row;
            justify-content: center;
          }
        }


        /* Mode Selection Specific Styles */
        .mode-buttons-container {
          display: flex;
          flex-direction: column;
          gap: 1rem; /* space-y-4 */
        }

        /* Button Styles */
        .btn {
          font-weight: 700; /* font-bold */
          padding: 0.75rem 1.5rem; /* py-3 px-6 */
          border-radius: 9999px; /* rounded-full */
          box-shadow: var(--shadow-lg);
          transition: transform 0.3s ease, background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease;
          cursor: pointer;
          border: none; /* Reset border */
          outline: none; /* focus:outline-none */
        }

        .btn:hover {
          transform: scale(1.05);
        }

        .btn:focus {
          box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.4); /* focus:ring-4 focus:ring-indigo-300 */
        }

        .btn-primary {
          background-color: var(--color-primary);
          color: var(--color-text-white);
          padding: 0.75rem 2rem; /* py-3 px-8 */
        }

        .btn-primary:hover {
          background-color: var(--color-primary-hover);
        }

        .btn-secondary {
            background-color: var(--color-btn-secondary-bg);
            color: var(--color-text-white);
            padding: 0.75rem 2rem; /* py-3 px-8 */
        }

        .btn-secondary:hover {
            background-color: var(--color-btn-secondary-hover);
        }

        .btn-mode-blue {
          background-color: #2563eb; /* Blue-600 */
          color: var(--color-text-white);
          padding: 0.75rem 1.5rem; /* py-3 px-6 */
        }

        .btn-mode-blue:hover {
          background-color: #1d4ed8; /* Blue-700 */
        }

        .btn-mode-blue:focus {
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.4); /* focus:ring-4 focus:ring-blue-300 */
        }

        .btn-mode-purple {
          background-color: var(--color-secondary);
          color: var(--color-text-white);
          padding: 0.75rem 1.5rem; /* py-3 px-6 */
        }

        .btn-mode-purple:hover {
          background-color: var(--color-secondary-hover);
        }

        .btn-mode-purple:focus {
          box-shadow: 0 0 0 4px rgba(124, 58, 237, 0.4); /* focus:ring-4 focus:ring-purple-300 */
        }

        .btn--disabled {
          background-color: var(--color-border-medium); /* gray-300 */
          color: var(--color-text-light); /* gray-500 */
          cursor: not-allowed;
          transform: none; /* Disable hover scale */
          box-shadow: none;
        }
        .btn--disabled:hover {
            background-color: var(--color-border-medium); /* ensure no hover change */
            transform: none;
        }
        .btn--disabled:focus {
            box-shadow: none; /* disable ring */
        }


        /* Quiz Specific Styles */
        .progress-section {
          margin-bottom: 1.5rem; /* mb-6 */
        }

        .question-count {
          font-size: 0.875rem; /* text-sm */
          font-weight: 600; /* font-semibold */
          color: var(--color-text-light);
          margin-bottom: 0.5rem; /* mb-2 */
        }

        .progress-bar-background {
          width: 100%;
          background-color: var(--color-border-light); /* gray-200 */
          border-radius: 9999px; /* rounded-full */
          height: 0.625rem; /* h-2.5 */
        }

        .progress-bar-fill {
          background-color: var(--color-primary); /* indigo-600 */
          height: 0.625rem; /* h-2.5 */
          border-radius: 9999px; /* rounded-full */
          transition: width 0.5s ease-out; /* transition-all duration-500 ease-out */
        }

        .question-text {
          font-size: 1.5rem; /* text-2xl */
          font-weight: 600; /* font-semibold */
          color: var(--color-text-dark);
          margin-bottom: 1.5rem; /* mb-6 */
        }

        .options-container {
          display: flex;
          flex-direction: column;
          gap: 1rem; /* space-y-4 */
        }

        .option-button {
          display: block; /* block */
          width: 100%;
          text-align: left;
          padding: 1rem; /* p-4 */
          border-radius: 0.5rem; /* rounded-lg */
          border-width: 2px; /* border-2 */
          transition: background-color 0.3s ease-in-out, border-color 0.3s ease-in-out, color 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
          cursor: pointer;
          outline: none; /* focus:outline-none */

          background-color: var(--bg-gray-light); /* gray-50 */
          color: var(--color-text-medium); /* gray-700 */
          border-color: var(--color-border-light); /* gray-200 */
        }

        .option-button:hover {
          background-color: var(--bg-white); /* gray-100 */
          border-color: #a5b4fc; /* indigo-300 */
        }

        .option-button:focus {
          box-shadow: 0 0 0 4px rgba(165, 180, 252, 0.4); /* focus:ring-4 focus:ring-indigo-200 */
        }

        .option-button--selected {
          background-color: var(--color-primary); /* indigo-600 */
          color: var(--color-text-white);
          border-color: var(--color-primary);
          box-shadow: var(--shadow-md);
        }

        .quiz-navigation {
          margin-top: 2rem; /* mt-8 */
          text-align: center;
        }

        /* Result Specific Styles */
        .result-score-text {
          font-size: 1.25rem; /* text-xl */
          color: var(--color-text-medium); /* gray-700 */
          margin-bottom: 1rem; /* mb-4 */
        }

        .score-value {
          font-weight: 700; /* font-bold */
          color: var(--color-primary); /* indigo-600 */
        }

        .result-interpretation-box {
          padding: 1.5rem; /* p-6 */
          border-radius: 0.5rem; /* rounded-lg */
          box-shadow: var(--shadow-md);
          margin-bottom: 2rem; /* mb-8 */
        }

        .result-status-heading {
          font-size: 1.5rem; /* text-2xl */
          font-weight: 700; /* font-bold */
          margin-bottom: 0.75rem; /* mb-3 */
        }

        .result-status-text {
          font-size: 1.125rem; /* text-lg */
        }

        .suggestion-box {
          background-color: var(--bg-gray-light);
          padding: 1.5rem;
          border-radius: 0.5rem;
          box-shadow: var(--shadow-sm);
          margin-top: 1.5rem;
          margin-bottom: 2rem;
          text-align: left;
        }

        .suggestion-heading {
          font-size: 1.125rem; /* text-lg */
          font-weight: 600;
          color: var(--color-text-dark);
          margin-bottom: 0.75rem;
        }

        .suggestion-text {
          font-size: 1rem; /* text-base */
          color: var(--color-text-medium);
          line-height: 1.5;
        }

        .saving-message, .error-message {
          color: var(--color-primary); /* indigo-500 */
          margin-bottom: 1rem; /* mb-4 */
        }
        .error-message {
          color: var(--color-red);
        }


        /* History Specific Styles */
        .user-id-text {
          font-size: 1rem; /* text-md */
          color: var(--color-text-light);
          margin-bottom: 1.5rem; /* mb-6 */
          text-align: center;
        }

        .user-id-value {
          font-family: 'monospace', monospace; /* font-mono */
          color: #2563eb; /* blue-600 */
          word-break: break-all;
        }

        .no-results-message {
          text-align: center;
          font-size: 1.125rem; /* text-lg */
          color: var(--color-text-lighter);
        }

        .results-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem; /* gap-6 */
        }

        @media (min-width: 768px) { /* md:grid-cols-2 */
          .results-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1024px) { /* lg:grid-cols-3 */
          .results-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .result-item {
          padding: 1.5rem; /* p-6 */
          border-radius: 0.5rem; /* rounded-lg */
          box-shadow: var(--shadow-md);
          border: 1px solid var(--color-border-light); /* border border-gray-200 */
        }

        .result-mode-heading {
          font-size: 1.25rem; /* text-xl */
          font-weight: 700; /* font-bold */
          color: var(--color-text-dark);
          margin-bottom: 0.5rem; /* mb-2 */
          text-transform: capitalize;
        }

        .result-score-detail, .result-date-detail {
          color: var(--color-text-light); /* gray-600 */
          margin-bottom: 0.25rem; /* mb-1 (approx) */
        }
        .result-date-detail {
          margin-bottom: 0.75rem; /* mb-3 */
        }

        .result-score-value, .result-date-value {
          font-weight: 600; /* font-semibold */
        }

        .result-interpretation-box-small {
          padding: 0.75rem; /* p-3 */
          border-radius: 0.375rem; /* rounded-md */
        }

        .result-status-text-small {
          font-weight: 600; /* font-semibold */
        }

        /* Color Classes (replicated from Tailwind for interpretation) */
        .text-green { color: var(--color-green); }
        .bg-green-light { background-color: var(--bg-green-light); }

        .text-yellow { color: var(--color-yellow); }
        .bg-yellow-light { background-color: var(--bg-yellow-light); }

        .text-orange { color: var(--color-orange); }
        .bg-orange-light { background-color: var(--bg-orange-light); }

        .text-red { color: var(--color-red); }
        .bg-red-light { background-color: var(--bg-red-light); }

        .text-gray { color: var(--color-text-light); }
        .bg-gray-light { background-color: var(--bg-gray-light); }

      `}</style>
      {currentPage === 'onboarding' && <OnboardingScreen onStartQuiz={handleStartQuiz} onViewHistory={handleViewHistory} />}
      {currentPage === 'modeSelection' && <ModeSelectionScreen onSelectMode={handleSelectMode} onViewHistory={handleViewHistory} />}
      {currentPage === 'quiz' && <Quiz mode={quizMode} onQuizComplete={handleQuizComplete} />}
      {currentPage === 'history' && <History onBackToHome={handleBackToHome} />}
    </AppProvider>
  );
};

export default App;
