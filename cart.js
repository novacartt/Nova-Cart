/* ========================================
   NOVA CART - CART MANAGEMENT
   ======================================== */

// ===== ADD TO CART =====
window.addToCart = function(productId, productName, price, image, quantity = 1) {
    let cart = getCart();
    
    const existing = cart.find(item => item.id === productId);
    if (existing) {
        existing.quantity = (existing.quantity || 1) + quantity;
    } else {
        cart.push({
            id: productId,
            name: productName,
            price: price,
            image: image || '',
            quantity: quantity,
            addedAt: new Date().toISOString()
        });
    }
    
    saveCart(cart);
    updateCartBadge();
    showToast(`${productName} added to cart! 🛒`, 'success');
    return cart;
};

// ===== REMOVE FROM CART =====
window.removeFromCart = function(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
    updateCartBadge();
    showToast('Product removed from cart', 'info');
    return cart;
};

// ===== UPDATE QUANTITY =====
window.updateCartQuantity = function(productId, quantity) {
    let cart = getCart();
    const item = cart.find(item => item.id === productId);
    if (item) {
        if (quantity <= 0) {
            return removeFromCart(productId);
        }
        item.quantity = quantity;
        saveCart(cart);
        updateCartBadge();
    }
    return cart;
};

// ===== GET CART =====
window.getCart = function() {
    try {
        return JSON.parse(localStorage.getItem('novacart_cart') || '[]');
    } catch (e) {
        return [];
    }
};

// ===== SAVE CART =====
window.saveCart = function(cart) {
    localStorage.setItem('novacart_cart', JSON.stringify(cart));
    // Sync to Firebase if logged in
    syncCartToFirebase(cart);
};

// ===== CLEAR CART =====
window.clearCart = function() {
    localStorage.removeItem('novacart_cart');
    updateCartBadge();
    showToast('Cart cleared', 'info');
    syncCartToFirebase([]);
};

// ===== GET CART TOTAL =====
window.getCartTotal = function() {
    const cart = getCart();
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
};

// ===== GET CART ITEMS COUNT =====
window.getCartCount = function() {
    const cart = getCart();
    return cart.reduce((count, item) => count + (item.quantity || 1), 0);
};

// ===== UPDATE CART BADGE =====
window.updateCartBadge = function() {
    const count = getCartCount();
    const badges = document.querySelectorAll('.badge-count, .cart-badge');
    badges.forEach(badge => {
        if (badge) {
            badge.textContent = count;
            badge.style.display = count > 0 ? 'flex' : 'none';
        }
    });
    return count;
};

// ===== SYNC CART TO FIREBASE =====
window.syncCartToFirebase = async function(cart) {
    try {
        const user = auth.currentUser;
        if (!user) return;
        await db.collection('carts').doc(user.uid).set({
            items: cart || [],
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
    } catch (error) {
        console.warn('Cart sync to Firebase failed:', error);
    }
};

// ===== LOAD CART FROM FIREBASE =====
window.loadCartFromFirebase = async function() {
    try {
        const user = auth.currentUser;
        if (!user) return;
        const doc = await db.collection('carts').doc(user.uid).get();
        if (doc.exists && doc.data().items) {
            saveCart(doc.data().items);
            updateCartBadge();
        }
    } catch (error) {
        console.warn('Cart load from Firebase failed:', error);
    }
};

// ===== INIT CART =====
document.addEventListener('DOMContentLoaded', function() {
    updateCartBadge();
    
    // Load cart from Firebase when logged in
    auth.onAuthStateChanged((user) => {
        if (user) {
            loadCartFromFirebase();
        }
    });
});

// ===== CART SYNC ON LOGIN =====
document.addEventListener('authChange', function(e) {
    if (e.detail.loggedIn) {
        loadCartFromFirebase();
    }
});

console.log('🛒 Cart module loaded');