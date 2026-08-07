/* ========================================
   NOVA CART - AUTHENTICATION
   ======================================== */

// ===== REGISTER =====
window.registerUser = async function(email, password, userData) {
    try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        // Save user data to Firestore
        await db.collection('users').doc(user.uid).set({
            ...userData,
            email: email,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        showToast('Registration successful! Welcome to Nova Cart 🎉', 'success');
        return { success: true, user };
    } catch (error) {
        console.error('Registration error:', error);
        showToast(error.message, 'error');
        return { success: false, error: error.message };
    }
};

// ===== LOGIN =====
window.loginUser = async function(email, password) {
    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        showToast('Welcome back! 👋', 'success');
        return { success: true, user: userCredential.user };
    } catch (error) {
        console.error('Login error:', error);
        showToast(error.message, 'error');
        return { success: false, error: error.message };
    }
};

// ===== LOGOUT =====
window.logoutUser = async function() {
    try {
        await auth.signOut();
        showToast('Logged out successfully', 'info');
        return { success: true };
    } catch (error) {
        console.error('Logout error:', error);
        showToast(error.message, 'error');
        return { success: false, error: error.message };
    }
};

// ===== RESET PASSWORD =====
window.resetPassword = async function(email) {
    try {
        await auth.sendPasswordResetEmail(email);
        showToast('Password reset email sent! Check your inbox 📧', 'success');
        return { success: true };
    } catch (error) {
        console.error('Reset password error:', error);
        showToast(error.message, 'error');
        return { success: false, error: error.message };
    }
};

// ===== UPDATE PROFILE =====
window.updateUserProfile = async function(data) {
    try {
        const user = auth.currentUser;
        if (!user) {
            throw new Error('User not logged in');
        }
        await db.collection('users').doc(user.uid).update({
            ...data,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        showToast('Profile updated successfully ✅', 'success');
        return { success: true };
    } catch (error) {
        console.error('Update profile error:', error);
        showToast(error.message, 'error');
        return { success: false, error: error.message };
    }
};

// ===== GET USER DATA =====
window.getUserData = async function() {
    try {
        const user = auth.currentUser;
        if (!user) {
            return { success: false, error: 'User not logged in' };
        }
        const doc = await db.collection('users').doc(user.uid).get();
        if (doc.exists) {
            return { success: true, data: doc.data() };
        } else {
            return { success: false, error: 'User data not found' };
        }
    } catch (error) {
        console.error('Get user data error:', error);
        return { success: false, error: error.message };
    }
};

// ===== CHECK AUTH STATUS =====
window.isLoggedIn = function() {
    return !!auth.currentUser;
};

// ===== GET CURRENT USER =====
window.getCurrentUser = function() {
    return auth.currentUser;
};

// ===== PROTECTED ROUTE CHECK =====
window.requireAuth = function(redirectUrl = '/login.html') {
    if (!auth.currentUser) {
        window.location.href = redirectUrl;
        return false;
    }
    return true;
};

console.log('🔐 Auth module loaded');