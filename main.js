/* ========================================
   NOVA CART - MAIN JAVASCRIPT (FIXED)
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {

    // ===== NAVBAR SCROLL =====
    const navbar = document.getElementById('navbar');
    if (navbar) {
        let lastScroll = 0;
        window.addEventListener('scroll', function() {
            const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
            if (currentScroll > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            lastScroll = currentScroll;
        });
    }

    // ===== MOBILE BOTTOM NAV HIDE/SHOW =====
    const bottomNav = document.getElementById('mobileBottomNav');
    if (bottomNav) {
        let lastScrollY = 0;
        let hideTimeout = null;
        window.addEventListener('scroll', function() {
            const currentScrollY = window.pageYOffset || document.documentElement.scrollTop;
            
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                // Scrolling down - hide
                bottomNav.classList.add('hidden');
            } else {
                // Scrolling up - show
                bottomNav.classList.remove('hidden');
            }
            lastScrollY = currentScrollY;
        });
    }

    // ===== MOBILE BOTTOM NAV ACTIVE =====
    const navItems = document.querySelectorAll('.mobile-bottom-nav .nav-item');
    const currentPath = window.location.pathname;
    navItems.forEach(item => {
        const href = item.getAttribute('href');
        if (href) {
            const hrefPath = href.replace('./', '').replace('/', '');
            const currentFile = currentPath.split('/').pop() || 'index.html';
            if (hrefPath === currentFile || (hrefPath === 'index.html' && currentFile === '')) {
                item.classList.add('active');
            } else if (hrefPath === 'portal/' && currentPath.includes('portal')) {
                item.classList.add('active');
            }
        }
    });

    // ===== CART BADGE =====
    function updateCartBadge() {
        const badges = document.querySelectorAll('.badge-count, .cart-badge');
        let count = 0;
        try {
            const cart = JSON.parse(localStorage.getItem('novacart_cart') || '[]');
            count = cart.length;
        } catch (e) {
            count = 0;
        }
        badges.forEach(badge => {
            if (badge) {
                badge.textContent = count;
                badge.style.display = count > 0 ? 'flex' : 'none';
            }
        });
        return count;
    }
    updateCartBadge();

    // ===== TOAST NOTIFICATION =====
    window.showToast = function(message, type = 'info') {
        const toastContainer = document.getElementById('toastContainer') || createToastContainer();
        const colors = {
            success: '#2ED573',
            error: '#FF4757',
            warning: '#FFA502',
            info: '#6C3CE1'
        };
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };

        const toast = document.createElement('div');
        toast.className = 'toast-glass';
        toast.style.cssText = `
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 16px;
            background: rgba(10,10,26,0.95);
            backdrop-filter: blur(20px);
            border: 1px solid ${colors[type] || colors.info};
            border-radius: 12px;
            color: #fff;
            box-shadow: 0 8px 32px rgba(0,0,0,0.4);
            min-width: 200px;
            max-width: 380px;
            font-family: 'Inter', sans-serif;
            font-size: 14px;
            margin-bottom: 8px;
            animation: slideIn 0.3s ease;
        `;
        toast.innerHTML = `
            <span style="color:${colors[type] || colors.info};font-size:18px;">
                <i class="fas ${icons[type] || icons.info}"></i>
            </span>
            <span style="flex:1;font-weight:500;">${message}</span>
            <button onclick="this.parentElement.remove()" style="background:none;border:none;color:#A0A0B8;cursor:pointer;font-size:16px;">&times;</button>
        `;
        toastContainer.appendChild(toast);
        setTimeout(() => {
            if (toast.parentElement) {
                toast.style.opacity = '0';
                toast.style.transform = 'translateX(50px)';
                toast.style.transition = 'all 0.3s ease';
                setTimeout(() => toast.remove(), 300);
            }
        }, 3500);
    };

    function createToastContainer() {
        const container = document.createElement('div');
        container.id = 'toastContainer';
        container.style.cssText = `
            position: fixed;
            bottom: 80px;
            right: 16px;
            z-index: 9999;
            max-width: 90%;
        `;
        document.body.appendChild(container);
        // Add animation style
        if (!document.getElementById('toastStyles')) {
            const style = document.createElement('style');
            style.id = 'toastStyles';
            style.textContent = `
                @keyframes slideIn {
                    from { opacity: 0; transform: translateX(50px); }
                    to { opacity: 1; transform: translateX(0); }
                }
            `;
            document.head.appendChild(style);
        }
        return container;
    }

    // ===== ADD TO CART =====
    window.addToCart = function(productId, productName, price, image) {
        let cart = [];
        try {
            cart = JSON.parse(localStorage.getItem('novacart_cart') || '[]');
        } catch (e) {
            cart = [];
        }
        const existing = cart.find(item => item.id === productId);
        if (existing) {
            existing.quantity = (existing.quantity || 1) + 1;
        } else {
            cart.push({
                id: productId,
                name: productName,
                price: price,
                image: image || '',
                quantity: 1
            });
        }
        localStorage.setItem('novacart_cart', JSON.stringify(cart));
        updateCartBadge();
        showToast(productName + ' added to cart! 🛒', 'success');
        return cart;
    };

    // ===== REMOVE FROM CART =====
    window.removeFromCart = function(productId) {
        let cart = [];
        try {
            cart = JSON.parse(localStorage.getItem('novacart_cart') || '[]');
        } catch (e) {
            cart = [];
        }
        cart = cart.filter(item => item.id !== productId);
        localStorage.setItem('novacart_cart', JSON.stringify(cart));
        updateCartBadge();
        showToast('Product removed from cart', 'info');
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

    // ===== CLEAR CART =====
    window.clearCart = function() {
        localStorage.removeItem('novacart_cart');
        updateCartBadge();
        showToast('Cart cleared', 'info');
    };

    // ===== FORMAT CURRENCY =====
    window.formatCurrency = function(amount) {
        return '₹' + amount.toLocaleString('en-IN');
    };

    // ===== VALIDATIONS =====
    window.validateEmail = function(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };
    window.validateMobile = function(mobile) {
        return /^[0-9]{10}$/.test(mobile);
    };
    window.validatePAN = function(pan) {
        return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan);
    };
    window.validateAadhaar = function(aadhaar) {
        return /^[0-9]{12}$/.test(aadhaar);
    };
    window.validatePincode = function(pincode) {
        return /^[0-9]{6}$/.test(pincode);
    };

    // ===== THEME TOGGLE =====
    window.toggleTheme = function() {
        const current = document.documentElement.getAttribute('data-theme') || 'dark';
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('novacart_theme', next);
        showToast('Theme: ' + next + ' mode', 'info');
    };

    // Load saved theme
    const savedTheme = localStorage.getItem('novacart_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);

    console.log('🚀 Nova Cart loaded successfully!');
    console.log('📦 Cart items:', getCart().length);
});