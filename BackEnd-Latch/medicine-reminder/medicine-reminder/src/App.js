import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth'; // Removed signInWithCustomToken as it's not used locally
import { getFirestore, collection, addDoc, onSnapshot, doc, updateDoc, deleteDoc, query, serverTimestamp } from 'firebase/firestore';

// Define global variables for Firebase config and app ID
const firebaseConfig = {
  apiKey: "AIzaSyDTTzXJ0O2u8oj6TCcMNbVWdp2bG6mEkq4",
  authDomain: "medicinereminderapp-fa059.firebaseapp.com",
  projectId: "medicinereminderapp-fa059",
  storageBucket: "medicinereminderapp-fa059.firebasestorage.app",
  messagingSenderId: "930106532785",
  appId: "1:930106532785:web:f7af941e35969cb5db5390",
  measurementId: "G-6YEW1W0972"
};
const appId = "medicinereminderapp-fa059"; // Using projectId as appId for Firestore paths
// __initial_auth_token is specific to the Canvas environment and is not needed or defined locally.

// Initialize Firebase (will be done once in useEffect)
let app, db, auth;

// Main App Component
const App = () => {
    const [reminders, setReminders] = useState([]);
    const [medicineHistory, setMedicineHistory] = useState([]);
    const [newMedicineName, setNewMedicineName] = useState('');
    const [newDosage, setNewDosage] = useState('');
    const [newTime, setNewTime] = useState('');
    const [newDays, setNewDays] = useState([]);
    const [activeAlarm, setActiveAlarm] = useState(null);
    const [userId, setUserId] = useState(null);
    const [isAuthReady, setIsAuthReady] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const alarmSoundRef = useRef(null);
    const reAlarmTimeoutRef = useRef(null);

    // Days of the week for selection
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    // Firebase Initialization and Authentication
    useEffect(() => {
        try {
            app = initializeApp(firebaseConfig);
            db = getFirestore(app);
            auth = getAuth(app);

            const unsubscribe = onAuthStateChanged(auth, async (user) => {
                if (user) {
                    setUserId(user.uid);
                    setIsAuthReady(true);
                    console.log("Firebase authenticated. User ID:", user.uid);
                } else {
                    console.log("No user signed in. Attempting anonymous sign-in...");
                    try {
                        // For local development, always attempt anonymous sign-in.
                        // The initialAuthToken (from Canvas) is not used here.
                        await signInAnonymously(auth);
                        console.log("Signed in anonymously.");
                    } catch (error) {
                        console.error("Firebase anonymous sign-in error:", error);
                        // Fallback: If anonymous sign-in also fails, use a random ID.
                        // Note: Data will not persist with a random ID if anonymous sign-in truly failed.
                        setUserId(crypto.randomUUID());
                        setIsAuthReady(true);
                    }
                }
                setIsLoading(false);
            });

            return () => unsubscribe();
        } catch (error) {
            console.error("Error initializing Firebase:", error);
            setIsLoading(false);
            // Fallback: If Firebase init fails, use a random ID.
            setUserId(crypto.randomUUID());
            setIsAuthReady(true);
        }
    }, []);

    // Fetch reminders from Firestore and set up real-time listener
    useEffect(() => {
        if (!isAuthReady || !userId) return;

        console.log("Setting up Firestore listener for user:", userId);
        const remindersCollectionRef = collection(db, `artifacts/${appId}/users/${userId}/reminders`);
        const q = query(remindersCollectionRef);

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedReminders = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                // Ensure lastTriggered is a Date object if it exists
                lastTriggered: doc.data().lastTriggered ? doc.data().lastTriggered.toDate() : null
            }));
            setReminders(fetchedReminders);
            console.log("Reminders fetched:", fetchedReminders);
        }, (error) => {
            console.error("Error fetching reminders:", error);
        });

        return () => unsubscribe();
    }, [isAuthReady, userId]);

    // Fetch medicine history from Firestore and set up real-time listener
    useEffect(() => {
        if (!isAuthReady || !userId) return;

        console.log("Setting up Firestore history listener for user:", userId);
        const historyCollectionRef = collection(db, `artifacts/${appId}/users/${userId}/medicineHistory`);
        const q = query(historyCollectionRef);

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedHistory = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                takenAt: doc.data().takenAt ? doc.data().takenAt.toDate() : null
            }));
            // Sort history by takenAt in descending order (most recent first)
            fetchedHistory.sort((a, b) => (b.takenAt?.getTime() || 0) - (a.takenAt?.getTime() || 0));
            setMedicineHistory(fetchedHistory);
            console.log("Medicine history fetched:", fetchedHistory);
        }, (error) => {
            console.error("Error fetching medicine history:", error);
        });

        return () => unsubscribe();
    }, [isAuthReady, userId]);

    // Alarm checking logic
    useEffect(() => {
        if (!isAuthReady || !userId || reminders.length === 0) return;

        const checkAlarms = () => {
            const now = new Date();
            const currentDay = daysOfWeek[now.getDay()]; // Get current day name
            const currentTime = now.toTimeString().slice(0, 5); // "HH:MM"

            reminders.forEach(reminder => {
                if (reminder.isActive && reminder.days.includes(currentDay) && reminder.time === currentTime) {
                    // Check if alarm has already been triggered recently for this cycle
                    // Give a 1-minute buffer to avoid multiple triggers within the same minute
                    const oneMinuteAgo = new Date(now.getTime() - 60 * 1000);
                    if (!reminder.lastTriggered || reminder.lastTriggered < oneMinuteAgo || reminder.isTaken === false) {
                        // Trigger alarm if it's due and not recently triggered or not taken yet
                        setActiveAlarm(reminder);
                        if (alarmSoundRef.current) {
                            alarmSoundRef.current.play().catch(e => console.error("Error playing sound:", e));
                        }
                        // Update lastTriggered in Firestore to prevent immediate re-trigger
                        updateDoc(doc(db, `artifacts/${appId}/users/${userId}/reminders`, reminder.id), {
                            lastTriggered: serverTimestamp(),
                            isTaken: false // Reset isTaken for the new alarm cycle
                        });
                        console.log("Alarm triggered for:", reminder.name);
                    }
                }
            });
        };

        const interval = setInterval(checkAlarms, 1000 * 30); // Check every 30 seconds
        return () => clearInterval(interval);
    }, [reminders, isAuthReady, userId]);

    // Handle re-alarm logic after initial alarm is turned off
    useEffect(() => {
        if (activeAlarm && activeAlarm.isTaken === false) {
            // If there's an active alarm that hasn't been marked as taken, set a re-alarm
            if (reAlarmTimeoutRef.current) {
                clearTimeout(reAlarmTimeoutRef.current);
            }
            reAlarmTimeoutRef.current = setTimeout(() => {
                if (activeAlarm && activeAlarm.isTaken === false) {
                    console.log("Re-alarm triggered for:", activeAlarm.name);
                    if (alarmSoundRef.current) {
                        alarmSoundRef.current.play().catch(e => console.error("Error playing sound:", e));
                    }
                    setActiveAlarm(prev => ({ ...prev, reTriggered: true })); // Indicate re-trigger
                }
            }, 5 * 60 * 1000); // 5 minutes
        } else {
            // If alarm is taken or no active alarm, clear any re-alarm timeout
            if (reAlarmTimeoutRef.current) {
                clearTimeout(reAlarmTimeoutRef.current);
                reAlarmTimeoutRef.current = null;
            }
        }
    }, [activeAlarm]);

    const handleDayChange = (day) => {
        setNewDays(prev =>
            prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
        );
    };

    const addReminder = async () => {
        if (!newMedicineName || !newDosage || !newTime || newDays.length === 0) {
            console.error('Please fill all fields and select at least one day.');
            return;
        }
        if (!userId) {
            console.error("User not authenticated, cannot add reminder.");
            return;
        }

        try {
            await addDoc(collection(db, `artifacts/${appId}/users/${userId}/reminders`), {
                name: newMedicineName,
                dosage: newDosage,
                time: newTime,
                days: newDays,
                isActive: true,
                lastTriggered: null,
                isTaken: true,
                createdAt: serverTimestamp()
            });
            setNewMedicineName('');
            setNewDosage('');
            setNewTime('');
            setNewDays([]);
            console.log("Reminder added successfully!");
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    };

    const deleteReminder = async (id) => {
        if (!userId) {
            console.error("User not authenticated, cannot delete reminder.");
            return;
        }
        try {
            await deleteDoc(doc(db, `artifacts/${appId}/users/${userId}/reminders`, id));
            console.log("Reminder deleted successfully!");
        } catch (e) {
            console.error("Error deleting document: ", e);
        }
    };

    const turnOffAlarm = () => {
        if (alarmSoundRef.current) {
            alarmSoundRef.current.pause();
            alarmSoundRef.current.currentTime = 0;
        }
        console.log("Alarm turned off for:", activeAlarm.name);
    };

    const markAsTaken = async () => {
        if (!activeAlarm || !userId) return;

        try {
            await updateDoc(doc(db, `artifacts/${appId}/users/${userId}/reminders`, activeAlarm.id), {
                isTaken: true,
                lastTakenAt: serverTimestamp()
            });

            await addDoc(collection(db, `artifacts/${appId}/users/${userId}/medicineHistory`), {
                medicineName: activeAlarm.name,
                dosage: activeAlarm.dosage,
                reminderTime: activeAlarm.time,
                takenAt: serverTimestamp(),
                reminderId: activeAlarm.id
            });

            setActiveAlarm(null);
            if (alarmSoundRef.current) {
                alarmSoundRef.current.pause();
                alarmSoundRef.current.currentTime = 0;
            }
            if (reAlarmTimeoutRef.current) {
                clearTimeout(reAlarmTimeoutRef.current);
                reAlarmTimeoutRef.current = null;
            }
            console.log("Medicine marked as taken and history recorded for:", activeAlarm.name);
        } catch (e) {
            console.error("Error marking as taken or recording history: ", e);
        }
    };

    if (isLoading) {
        return (
            <div className="loading-screen">
                <div className="loading-text">Loading Medicine Reminder...</div>
            </div>
        );
    }

    return (
        <div className="app-container">
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <style>
                {`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

                :root {
                    --purple-500: #8B5CF6;
                    --indigo-600: #4F46E5;
                    --purple-700: #6D28D9;
                    --purple-800: #5B21B6;
                    --purple-300: #C4B5FD;
                    --purple-400: #A78BFA;
                    --red-600: #DC2626;
                    --red-700: #B91C1C;
                    --yellow-500: #EAB308;
                    --yellow-600: #CA8A04;
                    --green-600: #16A34A;
                    --green-700: #15803D;
                    --gray-200: #E5E7EB;
                    --gray-300: #D1D5DB;
                    --black: #000;
                    --white: #FFF;
                }

                body {
                    font-family: 'Inter', sans-serif;
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }

                .loading-screen {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-height: 100vh;
                    background: linear-gradient(to bottom right, var(--purple-500), var(--indigo-600));
                    color: var(--white);
                }

                .loading-text {
                    font-size: 1.5rem; /* text-2xl */
                    font-weight: 600; /* font-semibold */
                }

                .app-container {
                    min-height: 100vh;
                    background: linear-gradient(to bottom right, var(--purple-500), var(--indigo-600));
                    color: var(--white);
                    font-family: 'Inter', sans-serif;
                    padding: 1rem; /* p-4 */
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }

                @media (min-width: 640px) { /* sm:p-8 */
                    .app-container {
                        padding: 2rem;
                    }
                }

                .main-title {
                    font-size: 2.25rem; /* text-4xl */
                    font-weight: 700; /* font-bold */
                    margin-bottom: 2rem; /* mb-8 */
                    text-align: center;
                    text-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* drop-shadow-lg */
                }

                @media (min-width: 640px) { /* sm:text-5xl */
                    .main-title {
                        font-size: 3rem;
                    }
                }

                .user-id-text {
                    font-size: 0.875rem; /* text-sm */
                    color: var(--gray-200);
                    margin-bottom: 1rem; /* mb-4 */
                    text-align: center;
                }

                .user-id-span {
                    font-family: monospace; /* font-mono */
                    background-color: rgba(109, 40, 217, 0.5); /* bg-purple-700 bg-opacity-50 */
                    padding: 0.25rem 0.5rem; /* px-2 py-1 */
                    border-radius: 0.25rem; /* rounded */
                }

                .section-card {
                    background-color: rgba(255, 255, 255, 0.1); /* bg-white bg-opacity-10 */
                    backdrop-filter: blur(8px); /* backdrop-blur-sm */
                    padding: 1.5rem; /* p-6 */
                    border-radius: 1rem; /* rounded-2xl */
                    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05); /* shadow-xl */
                    width: 100%;
                    max-width: 32rem; /* max-w-md */
                    margin-bottom: 2rem; /* mb-8 */
                    border: 1px solid var(--purple-400);
                }

                @media (min-width: 640px) { /* sm:p-8 */
                    .section-card {
                        padding: 2rem;
                    }
                }

                .section-title {
                    font-size: 1.5rem; /* text-2xl */
                    font-weight: 600; /* font-semibold */
                    margin-bottom: 1.5rem; /* mb-6 */
                    text-align: center;
                }

                .input-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 1rem; /* gap-4 */
                    margin-bottom: 1rem; /* mb-4 */
                }

                @media (min-width: 640px) { /* sm:grid-cols-2 */
                    .input-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }

                .input-field {
                    padding: 0.75rem; /* p-3 */
                    border-radius: 0.75rem; /* rounded-xl */
                    background-color: rgba(109, 40, 217, 0.4); /* bg-purple-700 bg-opacity-40 */
                    border: 1px solid var(--purple-300);
                    color: var(--white);
                    transition: all 0.3s ease;
                }

                .input-field::placeholder {
                    color: var(--gray-200);
                }

                .input-field:focus {
                    outline: none;
                    box-shadow: 0 0 0 2px var(--purple-300); /* focus:ring-2 focus:ring-purple-300 */
                }

                .label-block {
                    display: block;
                    color: var(--gray-200);
                    font-size: 0.875rem; /* text-sm */
                    font-weight: 500; /* font-medium */
                    margin-bottom: 0.5rem; /* mb-2 */
                }

                .time-input {
                    padding: 0.75rem; /* p-3 */
                    border-radius: 0.75rem; /* rounded-xl */
                    background-color: rgba(109, 40, 217, 0.4); /* bg-purple-700 bg-opacity-40 */
                    border: 1px solid var(--purple-300);
                    color: var(--white);
                    width: 100%;
                    transition: all 0.3s ease;
                }

                .time-input:focus {
                    outline: none;
                    box-shadow: 0 0 0 2px var(--purple-300); /* focus:ring-2 focus:ring-purple-300 */
                }

                .days-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 0.5rem; /* gap-2 */
                }

                @media (min-width: 640px) { /* sm:grid-cols-4 */
                    .days-grid {
                        grid-template-columns: repeat(4, 1fr);
                    }
                }

                .checkbox-label {
                    display: flex;
                    align-items: center;
                    color: var(--white);
                    cursor: pointer;
                }

                .checkbox-input {
                    height: 1.25rem; /* h-5 */
                    width: 1.25rem; /* w-5 */
                    color: var(--purple-400);
                    border-radius: 0.25rem; /* rounded */
                    outline: none;
                    accent-color: var(--purple-400); /* This changes the checkbox color directly */
                }

                .checkbox-input:focus {
                    box-shadow: 0 0 0 3px rgba(167, 139, 250, 0.5); /* focus:ring-purple-300 */
                }

                .checkbox-label span {
                    margin-left: 0.5rem; /* ml-2 */
                    font-size: 0.875rem; /* text-sm */
                }

                .add-button {
                    width: 100%;
                    background-color: var(--purple-700);
                    color: var(--white);
                    font-weight: 700; /* font-bold */
                    padding: 0.75rem 1.5rem; /* py-3 px-6 */
                    border-radius: 0.75rem; /* rounded-xl */
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* shadow-lg */
                    transform: scale(1);
                    transition: all 0.3s ease;
                    border: none;
                    cursor: pointer;
                }

                .add-button:hover {
                    background-color: var(--purple-800);
                    transform: scale(1.05);
                }

                .add-button:focus {
                    outline: none;
                    box-shadow: 0 0 0 2px var(--purple-300), 0 0 0 4px rgba(109, 40, 217, 0.5); /* focus:ring-2 focus:ring-purple-300 focus:ring-offset-2 focus:ring-offset-purple-600 */
                }

                .reminders-section, .history-section {
                    max-width: 48rem; /* max-w-2xl */
                }

                .no-reminders-text, .no-history-text {
                    text-align: center;
                    color: var(--gray-300);
                }

                .scroll-container {
                    max-height: 24rem; /* max-h-96 */
                    overflow-y: auto;
                    padding-right: 0.5rem; /* pr-2 */
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 1rem; /* gap-4 */
                }

                .scroll-container::-webkit-scrollbar {
                    width: 8px;
                }
                .scroll-container::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                }
                .scroll-container::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 10px;
                }
                .scroll-container::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.5);
                }

                .reminder-item, .history-item {
                    background-color: rgba(109, 40, 217, 0.4); /* bg-purple-700 bg-opacity-40 */
                    padding: 1rem; /* p-4 */
                    border-radius: 0.75rem; /* rounded-xl */
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06); /* shadow-md */
                    border: 1px solid var(--purple-300);
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    justify-content: space-between;
                }

                @media (min-width: 640px) { /* sm:flex-row sm:items-center */
                    .reminder-item {
                        flex-direction: row;
                        align-items: center;
                    }
                }

                .reminder-item h3, .history-item h3 {
                    font-size: 1.25rem; /* text-xl */
                    font-weight: 700; /* font-bold */
                }

                .reminder-item p, .history-item p {
                    color: var(--gray-200);
                    font-size: 0.875rem; /* text-sm */
                }

                .delete-button {
                    margin-top: 0.75rem; /* mt-3 */
                    background-color: var(--red-600);
                    color: var(--white);
                    font-weight: 700; /* font-bold */
                    padding: 0.5rem 1rem; /* py-2 px-4 */
                    border-radius: 0.5rem; /* rounded-lg */
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06); /* shadow-md */
                    transform: scale(1);
                    transition: all 0.3s ease;
                    border: none;
                    cursor: pointer;
                }

                @media (min-width: 640px) { /* sm:mt-0 */
                    .delete-button {
                        margin-top: 0;
                    }
                }

                .delete-button:hover {
                    background-color: var(--red-700);
                    transform: scale(1.05);
                }

                .delete-button:focus {
                    outline: none;
                    box-shadow: 0 0 0 2px var(--red-500), 0 0 0 4px rgba(220, 38, 38, 0.5); /* focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-purple-600 */
                }

                /* Alarm Modal */
                .alarm-modal-overlay {
                    position: fixed;
                    inset: 0; /* inset-0 */
                    background-color: rgba(0, 0, 0, 0.7); /* bg-black bg-opacity-70 */
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 50; /* z-50 */
                    padding: 1rem; /* p-4 */
                }

                .alarm-modal-content {
                    background-color: rgba(255, 255, 255, 0.95); /* bg-white bg-opacity-95 */
                    backdrop-filter: blur(6px); /* backdrop-blur-md */
                    padding: 1.5rem; /* p-6 */
                    border-radius: 1.5rem; /* rounded-3xl */
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); /* shadow-2xl */
                    border: 1px solid var(--purple-400);
                    text-align: center;
                    color: #6D28D9; /* text-purple-800 */
                    position: relative;
                    max-width: 24rem; /* max-w-sm */
                    width: 100%;
                    animation: pulse-alarm 1.5s infinite cubic-bezier(0.4, 0, 0.6, 1); /* animate-pulse-alarm */
                }

                @media (min-width: 640px) { /* sm:p-8 */
                    .alarm-modal-content {
                        padding: 2rem;
                    }
                }

                .alarm-title {
                    font-size: 1.875rem; /* text-3xl */
                    font-weight: 800; /* font-extrabold */
                    margin-bottom: 1rem; /* mb-4 */
                    color: var(--red-600);
                }

                .alarm-text-lg {
                    font-size: 1.25rem; /* text-xl */
                    font-weight: 600; /* font-semibold */
                    margin-bottom: 0.5rem; /* mb-2 */
                }

                .alarm-text-xl {
                    font-size: 1.5rem; /* text-2xl */
                    font-weight: 700; /* font-bold */
                    margin-bottom: 0.5rem; /* mb-2 */
                }

                .alarm-text-base {
                    font-size: 1.125rem; /* text-lg */
                    margin-bottom: 1.5rem; /* mb-6 */
                }

                .alarm-buttons-container {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem; /* gap-4 */
                    justify-content: center;
                }

                @media (min-width: 640px) { /* sm:flex-row */
                    .alarm-buttons-container {
                        flex-direction: row;
                    }
                }

                .alarm-button {
                    color: var(--white);
                    font-weight: 700; /* font-bold */
                    padding: 0.75rem 1.5rem; /* py-3 px-6 */
                    border-radius: 0.75rem; /* rounded-xl */
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* shadow-lg */
                    transform: scale(1);
                    transition: all 0.3s ease;
                    border: none;
                    cursor: pointer;
                }

                .alarm-button.turn-off {
                    background-color: var(--yellow-500);
                }

                .alarm-button.turn-off:hover {
                    background-color: var(--yellow-600);
                    transform: scale(1.05);
                }

                .alarm-button.turn-off:focus {
                    outline: none;
                    box-shadow: 0 0 0 2px var(--yellow-400), 0 0 0 4px rgba(109, 40, 217, 0.5); /* focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-purple-600 */
                }

                .alarm-button.taken {
                    background-color: var(--green-600);
                }

                .alarm-button.taken:hover {
                    background-color: var(--green-700);
                    transform: scale(1.05);
                }

                .alarm-button.taken:focus {
                    outline: none;
                    box-shadow: 0 0 0 2px var(--green-500), 0 0 0 4px rgba(109, 40, 217, 0.5); /* focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-purple-600 */
                }

                @keyframes pulse-alarm {
                    0%, 100% {
                        transform: scale(1);
                        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
                    }
                    50% {
                        transform: scale(1.02);
                        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
                    }
                }
                `}
            </style>

            <h1 className="main-title">
                Medicine Reminder
            </h1>

            {userId && (
                <p className="user-id-text">
                    Your User ID: <span className="user-id-span">{userId}</span>
                </p>
            )}

            {/* Add New Reminder Section */}
            <div className="section-card">
                <h2 className="section-title">Add New Reminder</h2>
                <div className="input-grid">
                    <input
                        type="text"
                        placeholder="Medicine Name"
                        className="input-field"
                        value={newMedicineName}
                        onChange={(e) => setNewMedicineName(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Dosage (e.g., 2 pills, 5ml)"
                        className="input-field"
                        value={newDosage}
                        onChange={(e) => setNewDosage(e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <label className="label-block">Time:</label>
                    <input
                        type="time"
                        className="time-input"
                        value={newTime}
                        onChange={(e) => setNewTime(e.target.value)}
                    />
                </div>
                <div className="mb-6">
                    <label className="label-block">Days:</label>
                    <div className="days-grid">
                        {daysOfWeek.map(day => (
                            <label key={day} className="checkbox-label">
                                <input
                                    type="checkbox"
                                    className="checkbox-input"
                                    checked={newDays.includes(day)}
                                    onChange={() => handleDayChange(day)}
                                />
                                <span className="ml-2 text-sm">{day.substring(0, 3)}</span>
                            </label>
                        ))}
                    </div>
                </div>
                <button
                    onClick={addReminder}
                    className="add-button"
                >
                    Add Reminder
                </button>
            </div>

            {/* Current Reminders Section */}
            <div className="section-card reminders-section">
                <h2 className="section-title">Your Reminders</h2>
                {reminders.length === 0 ? (
                    <p className="no-reminders-text">No reminders set yet. Add one above!</p>
                ) : (
                    <div className="scroll-container">
                        {reminders.map(reminder => (
                            <div key={reminder.id} className="reminder-item">
                                <div>
                                    <h3>{reminder.name}</h3>
                                    <p>Dosage: {reminder.dosage}</p>
                                    <p>Time: {reminder.time}</p>
                                    <p>Days: {reminder.days.join(', ')}</p>
                                </div>
                                <button
                                    onClick={() => deleteReminder(reminder.id)}
                                    className="delete-button"
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Medicine History Section */}
            <div className="section-card history-section">
                <h2 className="section-title">Medicine History</h2>
                {medicineHistory.length === 0 ? (
                    <p className="no-history-text">No medicine taken yet.</p>
                ) : (
                    <div className="scroll-container">
                        {medicineHistory.map(entry => (
                            <div key={entry.id} className="history-item">
                                <h3>{entry.medicineName}</h3>
                                <p>Dosage: {entry.dosage}</p>
                                <p>Scheduled Time: {entry.reminderTime}</p>
                                <p>Taken At: {entry.takenAt ? entry.takenAt.toLocaleString() : 'N/A'}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Alarm Modal */}
            {activeAlarm && (
                <div className="alarm-modal-overlay">
                    <div className="alarm-modal-content">
                        <h2 className="alarm-title">ALARM!</h2>
                        <p className="alarm-text-lg">Time to take:</p>
                        <p className="alarm-text-xl">{activeAlarm.name}</p>
                        <p className="alarm-text-base">Dosage: {activeAlarm.dosage}</p>

                        <div className="alarm-buttons-container">
                            <button
                                onClick={turnOffAlarm}
                                className="alarm-button turn-off"
                            >
                                Turn Off Alarm
                            </button>
                            <button
                                onClick={markAsTaken}
                                className="alarm-button taken"
                            >
                                Taken
                            </button>
                        </div>
                        <audio ref={alarmSoundRef} loop>
                            <source src="https://www.soundjay.com/buttons/beep-07.mp3" type="audio/mpeg" />
                            Your browser does not support the audio element.
                        </audio>
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;
