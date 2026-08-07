/* ========================================
   NOVA CART - SEARCH SYSTEM
   ======================================== */

// ===== SEARCH PRODUCTS =====
window.searchProducts = function(query, filters = {}) {
    if (!query || query.length < 1) return [];
    
    const products = getProducts();
    const lowerQuery = query.toLowerCase();
    
    return products.filter(product => {
        // Text search
        const matchesText = 
            product.name.toLowerCase().includes(lowerQuery) ||
            product.brand.toLowerCase().includes(lowerQuery) ||
            (product.model && product.model.toLowerCase().includes(lowerQuery)) ||
            (product.sku && product.sku.toLowerCase().includes(lowerQuery));
        
        if (!matchesText) return false;
        
        // Apply filters
        if (filters.brand && product.brand !== filters.brand) return false;
        if (filters.minPrice && product.price < filters.minPrice) return false;
        if (filters.maxPrice && product.price > filters.maxPrice) return false;
        if (filters.ram && product.ram !== filters.ram) return false;
        if (filters.storage && product.storage !== filters.storage) return false;
        if (filters.color && product.color !== filters.color) return false;
        if (filters.inStock && !product.stock) return false;
        if (filters.emiAvailable && !product.emi) return false;
        
        return true;
    });
};

// ===== GET PRODUCTS (Mock Data) =====
window.getProducts = function() {
    // In production, this would fetch from Firebase
    return [
        { id: 1, name: 'OnePlus Nord CE 5', brand: 'OnePlus', model: 'Nord CE 5', price: 24999, emi: 1499, stock: true, ram: '8GB', storage: '128GB', color: 'Blue', sku: 'OP-NCE5-128' },
        { id: 2, name: 'OnePlus 13R', brand: 'OnePlus', model: '13R', price: 39999, emi: 2399, stock: true, ram: '12GB', storage: '256GB', color: 'Black', sku: 'OP-13R-256' },
        { id: 3, name: 'OnePlus Nord 5', brand: 'OnePlus', model: 'Nord 5', price: 29999, emi: 1799, stock: true, ram: '8GB', storage: '128GB', color: 'Green', sku: 'OP-N5-128' },
        { id: 4, name: 'vivo T5x', brand: 'vivo', model: 'T5x', price: 18999, emi: 1099, stock: true, ram: '6GB', storage: '128GB', color: 'Blue', sku: 'VV-T5X-128' },
        { id: 5, name: 'vivo V40', brand: 'vivo', model: 'V40', price: 34999, emi: 2099, stock: true, ram: '8GB', storage: '256GB', color: 'Gold', sku: 'VV-V40-256' },
        { id: 6, name: 'OPPO K13', brand: 'OPPO', model: 'K13', price: 21999, emi: 1299, stock: true, ram: '8GB', storage: '128GB', color: 'Black', sku: 'OP-K13-128' },
        { id: 7, name: 'OPPO Reno 12', brand: 'OPPO', model: 'Reno 12', price: 32999, emi: 1999, stock: true, ram: '12GB', storage: '256GB', color: 'Silver', sku: 'OP-R12-256' },
        { id: 8, name: 'realme P3', brand: 'realme', model: 'P3', price: 15999, emi: 899, stock: true, ram: '6GB', storage: '128GB', color: 'Yellow', sku: 'RM-P3-128' },
        { id: 9, name: 'realme GT 6', brand: 'realme', model: 'GT 6', price: 28999, emi: 1699, stock: true, ram: '12GB', storage: '256GB', color: 'Green', sku: 'RM-GT6-256' },
        { id: 10, name: 'Motorola Edge 60', brand: 'Motorola', model: 'Edge 60', price: 27999, emi: 1699, stock: false, ram: '8GB', storage: '256GB', color: 'Blue', sku: 'MT-EDGE60-256' },
        { id: 11, name: 'Motorola G85', brand: 'Motorola', model: 'G85', price: 19999, emi: 1199, stock: true, ram: '8GB', storage: '128GB', color: 'Gray', sku: 'MT-G85-128' },
    ];
};

// ===== GET TRENDING SEARCHES =====
window.getTrendingSearches = function() {
    return [
        { name: 'OnePlus Nord CE 5', icon: 'fa-mobile-screen-button' },
        { name: 'vivo T5x', icon: 'fa-mobile-screen-button' },
        { name: 'OPPO K13', icon: 'fa-mobile-screen-button' },
        { name: 'realme P3', icon: 'fa-mobile-screen-button' },
        { name: 'Motorola Edge 60', icon: 'fa-mobile-screen-button' },
    ];
};

// ===== SAVE RECENT SEARCH =====
window.saveRecentSearch = function(query) {
    if (!query || query.length < 1) return;
    let recent = JSON.parse(localStorage.getItem('novacart_recent_searches') || '[]');
    recent = recent.filter(item => item !== query);
    recent.unshift(query);
    if (recent.length > 10) recent = recent.slice(0, 10);
    localStorage.setItem('novacart_recent_searches', JSON.stringify(recent));
};

// ===== GET RECENT SEARCHES =====
window.getRecentSearches = function() {
    try {
        return JSON.parse(localStorage.getItem('novacart_recent_searches') || '[]');
    } catch (e) {
        return [];
    }
};

// ===== CLEAR RECENT SEARCHES =====
window.clearRecentSearches = function() {
    localStorage.removeItem('novacart_recent_searches');
};

// ===== SEARCH PRODUCTS FROM FIRESTORE =====
window.searchProductsFirestore = async function(query, filters = {}) {
    try {
        let collection = db.collection('products');
        
        // Text search (using Firestore queries)
        if (query && query.length > 0) {
            // Firestore doesn't support full-text search natively
            // Use array-contains or startAt for basic search
            collection = collection.where('searchTerms', 'array-contains', query.toLowerCase());
        }
        
        // Apply filters
        if (filters.brand) {
            collection = collection.where('brand', '==', filters.brand);
        }
        if (filters.minPrice) {
            collection = collection.where('price', '>=', filters.minPrice);
        }
        if (filters.maxPrice) {
            collection = collection.where('price', '<=', filters.maxPrice);
        }
        if (filters.inStock !== undefined) {
            collection = collection.where('stock', '==', filters.inStock);
        }
        if (filters.emiAvailable) {
            collection = collection.where('emi', '>', 0);
        }
        
        const snapshot = await collection.get();
        const products = [];
        snapshot.forEach(doc => {
            products.push({ id: doc.id, ...doc.data() });
        });
        
        return products;
    } catch (error) {
        console.error('Firestore search error:', error);
        return [];
    }
};

console.log('🔍 Search module loaded');