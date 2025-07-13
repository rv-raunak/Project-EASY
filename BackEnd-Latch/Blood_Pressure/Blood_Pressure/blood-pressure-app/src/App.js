import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, addDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import './App.css'; // Import the new CSS file

// Define the main App component
const App = () => {
  // State variables for input fields
  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');
  const [pulse, setPulse] = useState('');
  // State for storing the personalized suggestion
  const [suggestion, setSuggestion] = useState('');
  // State for storing the history of readings
  const [history, setHistory] = useState([]);
  // State for Firebase instances and user ID
  const [db, setDb] = useState(null);
  const [auth, setAuth] = useState(null);
  const [userId, setUserId] = useState(null);
  // State to track if authentication is ready
  const [isAuthReady, setIsAuthReady] = useState(false);
  // State for loading indicator
  const [isLoading, setIsLoading] = useState(true);
  // State for error messages
  const [error, setError] = useState('');
  // State to trigger history fetching
  const [fetchHistoryTrigger, setFetchHistoryTrigger] = useState(false);
  // State to indicate if history is currently being fetched
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);


  // Firebase initialization and authentication effect
  useEffect(() => {
    try {
      // Use the provided Firebase config
      const firebaseConfig = {
        apiKey: "AIzaSyCfHFimU-GzoNvlj2u7Jbk9HmNlA7cYILo",
        authDomain: "bloodpressure-cb6e4.firebaseapp.com",
        projectId: "bloodpressure-cb6e4",
        storageBucket: "bloodpressure-cb6e4.firebasestorage.app",
        messagingSenderId: "815620950819",
        appId: "1:815620950819:web:674aee6a4cefc3eb805a96",
        measurementId: "G-0TL90T9H63"
      };
      // Use the appId from the provided config
      const appId = firebaseConfig.appId;

      // Initialize Firebase app
      const app = initializeApp(firebaseConfig);
      const firestoreDb = getFirestore(app);
      const firebaseAuth = getAuth(app);

      setDb(firestoreDb);
      setAuth(firebaseAuth);

      // Listen for authentication state changes
      const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
        if (user) {
          setUserId(user.uid);
          setIsAuthReady(true);
          console.log("User authenticated:", user.uid);
        } else {
          // Sign in anonymously for local setup
          try {
            await signInAnonymously(firebaseAuth);
            console.log("Signed in anonymously.");
          } catch (authError) {
            console.error("Firebase authentication error:", authError);
            setError("Failed to authenticate with Firebase. Please try again.");
          } finally {
            setIsAuthReady(true);
            setIsLoading(false); // Initial loading for auth completion
          }
        }
      });

      // Cleanup subscription on unmount
      return () => unsubscribe();
    } catch (initError) {
      console.error("Firebase initialization failed:", initError);
      setError("Failed to initialize Firebase. Check console for details.");
      setIsLoading(false);
    }
  }, []);

  // Effect for fetching and listening to real-time data from Firestore
  useEffect(() => {
    // Only fetch history if the trigger is set, db, userId, and auth are ready
    if (fetchHistoryTrigger && db && userId && isAuthReady) {
      setIsHistoryLoading(true); // Set loading state for history
      setError(''); // Clear any previous errors

      let unsubscribe = () => {}; // Initialize unsubscribe to a no-op function

      try {
        // Define the collection path for user-specific data
        const appId = "1:815620950819:web:674aee6a4cefc3eb805a96"; // Directly use the appId from your config
        const readingsCollectionRef = collection(db, `artifacts/${appId}/users/${userId}/readings`);

        // Create a query to order by timestamp (descending)
        // NOTE: orderBy() is avoided as per instructions to prevent index issues.
        // Data will be sorted in memory.
        const q = readingsCollectionRef; // No orderBy in query

        // Set up real-time listener for the readings collection
        unsubscribe = onSnapshot(q, (snapshot) => {
          const readingsData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          // Sort data in memory by timestamp in descending order
          readingsData.sort((a, b) => (b.timestamp?.toDate() || 0) - (a.timestamp?.toDate() || 0));
          setHistory(readingsData);
          setIsHistoryLoading(false); // History loading complete
          setFetchHistoryTrigger(false); // Reset trigger after fetch
        }, (firestoreError) => {
          console.error("Error fetching Firestore data:", firestoreError);
          setError("Failed to load history. Please refresh the page.");
          setIsHistoryLoading(false); // History loading complete
          setFetchHistoryTrigger(false); // Reset trigger on error
        });

      } catch (firestoreSetupError) {
        console.error("Error setting up Firestore listener:", firestoreSetupError);
        setError("Failed to set up history listener.");
        setIsHistoryLoading(false); // History loading complete
        setFetchHistoryTrigger(false); // Reset trigger on error
      }

      // Cleanup listener on unmount or when dependencies change
      return () => unsubscribe();
    } else if (fetchHistoryTrigger && (!db || !userId || !isAuthReady)) {
      // If trigger is true but Firebase isn't ready, show a temporary loading message
      setIsHistoryLoading(true);
      setError('Waiting for database connection to load history...');
    } else if (!isAuthReady) {
      // Still waiting for auth to be ready, but not specifically for history fetch
      setIsLoading(true); // Keep general app loading true until auth is done
    } else {
      // db or userId is not available yet, or auth is not ready, and no fetch trigger
      setIsLoading(false); // General app loading can be false if auth is done and no history fetch
    }
  }, [db, userId, isAuthReady, fetchHistoryTrigger]); // Re-run when db, userId, isAuthReady, or fetchHistoryTrigger changes

  // Function to provide personalized suggestions
  const getSuggestion = (systolicVal, diastolicVal, pulseVal) => {
    let bpCategory = '';
    let pulseCategory = '';
    let suggestions = [];

    // Blood Pressure Categorization (AHA/ACC 2017 Guidelines)
    if (systolicVal < 120 && diastolicVal < 80) {
      bpCategory = 'Normal';
      suggestions.push('Maintain a healthy lifestyle with regular exercise and a balanced diet.');
    } else if (systolicVal >= 120 && systolicVal <= 129 && diastolicVal < 80) {
      bpCategory = 'Elevated';
      suggestions.push('Focus on heart-healthy habits. Consider reducing sodium intake and increasing physical activity.');
    } else if ((systolicVal >= 130 && systolicVal <= 139) || (diastolicVal >= 80 && diastolicVal <= 89)) {
      bpCategory = 'Hypertension Stage 1';
      suggestions.push('Consult a doctor for lifestyle changes and potential medication. Monitor your blood pressure regularly.');
    } else if (systolicVal >= 140 || diastolicVal >= 90) {
      bpCategory = 'Hypertension Stage 2';
      suggestions.push('Seek immediate medical attention. Adhere strictly to your doctor\'s treatment plan.');
    } else if (systolicVal > 180 || diastolicVal > 120) {
      bpCategory = 'Hypertensive Crisis';
      suggestions.push('This is an emergency. Seek immediate medical care. Do not wait.');
    } else {
      bpCategory = 'Uncategorized BP';
      suggestions.push('Please ensure your readings are accurate. Consult a healthcare professional.');
    }

    // Pulse Categorization (Adults)
    if (pulseVal >= 60 && pulseVal <= 100) {
      pulseCategory = 'Normal Pulse';
      suggestions.push('Your pulse rate is within the normal range. Continue healthy habits.');
    } else if (pulseVal < 60) {
      pulseCategory = 'Bradycardia';
      suggestions.push('A slow pulse can be normal for athletes, but if you experience dizziness or fatigue, consult a doctor.');
    } else if (pulseVal > 100) {
      pulseCategory = 'Tachycardia';
      suggestions.push('A fast pulse can be due to stress, exercise, or underlying conditions. If persistent, consult a doctor.');
    } else {
      pulseCategory = 'Uncategorized Pulse';
      suggestions.push('Please ensure your pulse reading is accurate. Consult a healthcare professional.');
    }

    return (
      <div className="suggestion-box">
        <h3 className="suggestion-title">Your Health Snapshot:</h3>
        <p className="suggestion-text">Blood Pressure Category: <span className="suggestion-highlight">{bpCategory}</span></p>
        <p className="suggestion-text">Pulse Category: <span className="suggestion-highlight">{pulseCategory}</span></p>
        <h4 className="suggestion-subtitle">Personalized Suggestions:</h4>
        <ul className="suggestion-list">
          {suggestions.map((s, index) => (
            <li key={index}>{s}</li>
          ))}
        </ul>
        <p className="suggestion-disclaimer">
          <span className="suggestion-bold">Disclaimer:</span> These suggestions are for informational purposes only and do not constitute medical advice. Always consult with a qualified healthcare professional for any health concerns or before making any decisions related to your health or treatment.
        </p>
      </div>
    );
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    // Validate inputs
    const sys = parseInt(systolic);
    const dia = parseInt(diastolic);
    const pul = parseInt(pulse);

    if (isNaN(sys) || isNaN(dia) || isNaN(pul) || sys <= 0 || dia <= 0 || pul <= 0) {
      setError('Please enter valid positive numbers for all fields.');
      return;
    }

    if (!db || !userId) {
      setError('Database not ready. Please wait a moment or refresh.');
      return;
    }

    // Generate suggestion
    const currentSuggestion = getSuggestion(sys, dia, pul);
    setSuggestion(currentSuggestion);

    try {
      setIsLoading(true); // Keep general loading for saving
      // Add a new document to the 'readings' collection
      const appId = "1:815620950819:web:674aee6a4cefc3eb805a96"; // Directly use the appId from your config
      const readingsCollectionRef = collection(db, `artifacts/${appId}/users/${userId}/readings`);
      await addDoc(readingsCollectionRef, {
        systolic: sys,
        diastolic: dia,
        pulse: pul,
        timestamp: serverTimestamp(), // Use server timestamp for consistency
      });
      console.log("Reading saved to Firestore.");
      // Clear form fields after successful submission
      setSystolic('');
      setDiastolic('');
      setPulse('');
    } catch (firestoreError) {
      console.error("Error saving reading to Firestore:", firestoreError);
      setError("Failed to save reading. Please try again.");
    } finally {
      setIsLoading(false); // End general loading
    }
  };

  // Main render function
  return (
    <div className="app-container">
      {/* Inter font is now linked in public/index.html */}
      <div className="main-card">
        <h1 className="main-title">
          <span className="heart-icon">❤️</span> Health Tracker
        </h1>

        {/* Error message display */}
        {error && (
          <div className="error-message" role="alert">
            <strong className="error-bold">Error!</strong>
            <span className="error-text"> {error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="input-form">
          <div className="form-group">
            <label htmlFor="systolic" className="form-label">Systolic (mmHg)</label>
            <input
              type="number"
              id="systolic"
              className="form-input"
              value={systolic}
              onChange={(e) => setSystolic(e.target.value)}
              placeholder="e.g., 120"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="diastolic" className="form-label">Diastolic (mmHg)</label>
            <input
              type="number"
              id="diastolic"
              className="form-input"
              value={diastolic}
              onChange={(e) => setDiastolic(e.target.value)}
              placeholder="e.g., 80"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="pulse" className="form-label">Pulse (bpm)</label>
            <input
              type="number"
              id="pulse"
              className="form-input"
              value={pulse}
              onChange={(e) => setPulse(e.target.value)}
              placeholder="e.g., 72"
              required
            />
          </div>
          <button
            type="submit"
            className="submit-button"
            disabled={isLoading || !isAuthReady}
          >
            {isLoading ? 'Processing...' : 'Get Suggestion & Save'}
          </button>
        </form>

        {/* Display personalized suggestion */}
        {suggestion && <div className="suggestion-display">{suggestion}</div>}
      </div>

      {/* History Section */}
      <div className="history-card">
        <h2 className="history-title">
          <span className="clipboard-icon">📋</span> Your History
        </h2>

        <button
          onClick={() => setFetchHistoryTrigger(true)}
          className="fetch-history-button"
          disabled={isHistoryLoading || !isAuthReady}
        >
          {isHistoryLoading ? 'Loading History...' : 'Fetch History'}
        </button>

        {isHistoryLoading && <p className="history-loading">Loading history...</p>}
        {!isHistoryLoading && history.length === 0 && (fetchHistoryTrigger ? <p className="history-empty">No readings yet. Enter your first reading above!</p> : <p className="history-empty">Press "Fetch History" to view your past readings.</p>)}
        {!isHistoryLoading && history.length > 0 && (
          <div className="history-table-container">
            <table className="history-table">
              <thead className="history-table-header">
                <tr>
                  <th scope="col" className="table-header-cell rounded-tl">
                    Date
                  </th>
                  <th scope="col" className="table-header-cell">
                    Systolic
                  </th>
                  <th scope="col" className="table-header-cell">
                    Diastolic
                  </th>
                  <th scope="col" className="table-header-cell rounded-tr">
                    Pulse
                  </th>
                </tr>
              </thead>
              <tbody className="history-table-body">
                {history.map((reading) => (
                  <tr key={reading.id}>
                    <td className="table-data-cell">
                      {reading.timestamp ? new Date(reading.timestamp.toDate()).toLocaleString() : 'N/A'}
                    </td>
                    <td className="table-data-cell">
                      {reading.systolic}
                    </td>
                    <td className="table-data-cell">
                      {reading.diastolic}
                    </td>
                    <td className="table-data-cell">
                      {reading.pulse}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
