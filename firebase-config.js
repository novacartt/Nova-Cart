/* ========================================
   NOVA CART - FIREBASE CONFIGURATION
   ======================================== */

// ===== FIREBASE CONFIG =====
// Replace these values with your Firebase project configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID",
    measurementId: "YOUR_MEASUREMENT_ID"
};

// ===== INITIALIZE FIREBASE =====
firebase.initializeApp(firebaseConfig);

// ===== FIREBASE SERVICES =====
const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

// ===== ENABLE OFFLINE PERSISTENCE =====
db.enablePersistence()
    .then(() => {
        console.log('🔥 Firestore offline persistence enabled');
    })
    .catch((err) => {
        console.warn('⚠️ Firestore persistence error:', err.code);
    });

// ===== AUTH STATE OBSERVER =====
auth.onAuthStateChanged((user) => {
    if (user) {
        console.log('✅ User logged in:', user.email);
        document.dispatchEvent(new CustomEvent('authChange', { detail: { user, loggedIn: true } }));
    } else {
        console.log('❌ User logged out');
        document.dispatchEvent(new CustomEvent('authChange', { detail: { user: null, loggedIn: false } }));
    }
});

// ===== EXPORT SERVICES =====
window.firebaseApp = firebase;
window.db = db;
window.auth = auth;
window.storage = storage;

console.log('🔥 Firebase initialized successfully!');