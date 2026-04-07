// Food data
const foodData = [
    {
        id: 1,
        name: "Margherita Pizza",
        price: 12.99,
        category: "pizza",
        image: "img/food/p1.jpg",
        description: "Classic pizza with tomato sauce, mozzarella, and basil"
    },
    {
        id: 2,
        name: "Pepperoni Pizza",
        price: 14.99,
        category: "pizza",
        image: "img/category/pizza.jpg",
        description: "Pizza topped with pepperoni and mozzarella cheese"
    },
    {
        id: 3,
        name: "Cheeseburger",
        price: 9.99,
        category: "burger",
        image: "img/food/b1.jpg",
        description: "Juicy beef burger with cheese, lettuce, and tomato"
    },
    {
        id: 4,
        name: "Chicken Burger",
        price: 10.99,
        category: "burger",
        image: "img/category/burger.jpg",
        description: "Grilled chicken breast with special sauce"
    },
    {
        id: 5,
        name: "Club Sandwich",
        price: 8.99,
        category: "sandwich",
        image: "img/food/s1.jpg",
        description: "Triple-decker sandwich with turkey, bacon, and vegetables"
    },
    {
        id: 6,
        name: "Veggie Sandwich",
        price: 7.99,
        category: "sandwich",
        image: "img/category/sandwich.jpg",
        description: "Fresh vegetables with hummus and sprouts"
    }
];

// Cart array
let cart = [];

// DOM Elements
const cartLink = document.getElementById('cartLink');
const cartModal = document.getElementById('cartModal');
const closeCart = document.getElementById('closeCart');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartCount = document.querySelector('.cart-count');
const featuredFoods = document.getElementById('featuredFoods');
const checkoutBtn = document.getElementById('checkoutBtn');

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    loadCartFromLocalStorage();
    displayFeaturedFoods();
    updateCartUI();
    addScrollReveal();
    
    // Event Listeners
    if (cartLink) {
        cartLink.addEventListener('click', function(e) {
            e.preventDefault();
            openCart();
        });
    }
    if (closeCart) {
        closeCart.addEventListener('click', closeCartModal);
    }
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', checkout);
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === cartModal) {
            closeCartModal();
        }
    });
});

// Add scroll reveal animations
function addScrollReveal() {
    const elements = document.querySelectorAll('.category-card, .food-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'all 0.6s ease-out';
        observer.observe(element);
    });
}

// Display featured foods
function displayFeaturedFoods() {
    if (!featuredFoods) return;
    
    featuredFoods.innerHTML = '';
    
    // Get first 3 items as featured
    const featuredItems = foodData.slice(0, 3);
    
    featuredItems.forEach((food, index) => {
        const foodCard = document.createElement('div');
        foodCard.className = 'food-card';
        foodCard.style.animationDelay = `${index * 0.1}s`;
        foodCard.innerHTML = `
            <img src="${food.image}" alt="${food.name}" onerror="this.src='https://via.placeholder.com/300x200?text=Food+Image'">
            <div class="food-info">
                <h3>${food.name}</h3>
                <p>${food.description}</p>
                <span class="price">$${food.price.toFixed(2)}</span>
                <button class="add-to-cart" data-id="${food.id}">
                    <i class="fas fa-shopping-cart"></i> Add to Cart
                </button>
            </div>
        `;
        featuredFoods.appendChild(foodCard);
    });
    
    // Add event listeners to add to cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const foodId = parseInt(this.getAttribute('data-id'));
            addToCart(foodId);
        });
    });
}

// Add item to cart
function addToCart(foodId) {
    const food = foodData.find(item => item.id === foodId);
    
    if (food) {
        // Check if item already in cart
        const existingItem = cart.find(item => item.id === foodId);
        
        if (existingItem) {
            existingItem.quantity += 1;
            showNotification(`${food.name} quantity increased!`, 'success');
        } else {
            cart.push({
                id: food.id,
                name: food.name,
                price: food.price,
                image: food.image,
                quantity: 1
            });
            showNotification(`${food.name} added to cart!`, 'success');
        }
        
        saveCartToLocalStorage();
        updateCartUI();
        animateCartIcon();
    }
}

// Animate cart icon when item added
function animateCartIcon() {
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        cartCountElement.style.animation = 'pulse 0.5s ease';
        setTimeout(() => {
            cartCountElement.style.animation = '';
        }, 500);
    }
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <div class="notification-content ${type}">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        animation: slideInRight 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 2000);
}

// Remove item from cart
function removeFromCart(foodId) {
    const item = cart.find(item => item.id === foodId);
    if (item) {
        showNotification(`${item.name} removed from cart!`, 'info');
    }
    cart = cart.filter(item => item.id !== foodId);
    saveCartToLocalStorage();
    updateCartUI();
}

// Update item quantity
function updateQuantity(foodId, change) {
    const item = cart.find(item => item.id === foodId);
    
    if (item) {
        item.quantity += change;
        
        if (item.quantity <= 0) {
            removeFromCart(foodId);
        } else {
            saveCartToLocalStorage();
            updateCartUI();
        }
    }
}

// Update cart UI - FIXED: Properly updates cart count display
function updateCartUI() {
    // Calculate total items in cart
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    // Update cart count badge
    if (cartCount) {
        cartCount.textContent = totalItems;
        
        // Add pulse animation when count changes
        if (totalItems > 0) {
            cartCount.style.display = 'inline-flex';
            cartCount.style.animation = 'pulse 0.5s ease';
            setTimeout(() => {
                cartCount.style.animation = '';
            }, 500);
        } else {
            cartCount.textContent = '0';
        }
    }
    
    // Update cart modal
    if (!cartItems) return;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart-message">🛒 Your cart is empty</p>';
        if (cartTotal) cartTotal.textContent = '0.00';
        return;
    }
    
    cartItems.innerHTML = '';
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="item-info">
                <h4>${item.name}</h4>
                <p class="item-price">$${item.price.toFixed(2)} each</p>
            </div>
            <div class="item-quantity">
                <button class="quantity-btn minus" data-id="${item.id}">-</button>
                <span class="quantity">${item.quantity}</span>
                <button class="quantity-btn plus" data-id="${item.id}">+</button>
            </div>
            <p class="item-total">$${itemTotal.toFixed(2)}</p>
            <button class="remove-item" data-id="${item.id}">×</button>
        `;
        
        cartItems.appendChild(cartItem);
    });
    
    if (cartTotal) cartTotal.textContent = total.toFixed(2);
    
    // Add event listeners to cart buttons
    document.querySelectorAll('.quantity-btn.minus').forEach(button => {
        button.addEventListener('click', function() {
            const foodId = parseInt(this.getAttribute('data-id'));
            updateQuantity(foodId, -1);
        });
    });
    
    document.querySelectorAll('.quantity-btn.plus').forEach(button => {
        button.addEventListener('click', function() {
            const foodId = parseInt(this.getAttribute('data-id'));
            updateQuantity(foodId, 1);
        });
    });
    
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', function() {
            const foodId = parseInt(this.getAttribute('data-id'));
            removeFromCart(foodId);
        });
    });
}

// Open cart modal
function openCart() {
    if (cartModal) {
        cartModal.style.display = 'flex';
        cartModal.style.animation = 'fadeInUp 0.3s ease-out';
    }
}

// Close cart modal
function closeCartModal() {
    if (cartModal) {
        cartModal.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => {
            cartModal.style.display = 'none';
        }, 300);
    }
}

// Checkout function
function checkout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!', 'error');
        return;
    }
    
    const order = {
        items: [...cart],
        total: parseFloat(cartTotal ? cartTotal.textContent : '0'),
        timestamp: new Date().toISOString(),
        orderNumber: 'ORD-' + Date.now()
    };
    
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    generateBillPreview(order);
    
    cart = [];
    saveCartToLocalStorage();
    updateCartUI();
    closeCartModal();
    
    showNotification('Order placed successfully!', 'success');
}

// Generate bill preview
function generateBillPreview(order) {
    let billContent = `
╔══════════════════════════════════════════════════════╗
║                   FOODIE DELIGHT                      ║
║                  ORDER RECEIPT & BILL                 ║
╚══════════════════════════════════════════════════════╝

Order Number: ${order.orderNumber}
Date: ${new Date(order.timestamp).toLocaleString()}

────────────────────────────────────────────────────────
ITEMS:
────────────────────────────────────────────────────────
`;
    
    order.items.forEach((item, index) => {
        const itemTotal = (item.price * item.quantity).toFixed(2);
        billContent += `${index + 1}. ${item.name}
   Price: $${item.price.toFixed(2)} x ${item.quantity} = $${itemTotal}
────────────────────────────────────────────────────────
`;
    });
    
    billContent += `
SUB TOTAL: $${order.total.toFixed(2)}
TAX (10%): $${(order.total * 0.1).toFixed(2)}
────────────────────────────────────────────────────────
TOTAL AMOUNT: $${(order.total * 1.1).toFixed(2)}
────────────────────────────────────────────────────────

╔══════════════════════════════════════════════════════╗
║         Thank you for your order!                    ║
║         Visit us again at Foodie Delight             ║
╚══════════════════════════════════════════════════════╝
`;
    
    showBillPreview(billContent, order);
}

// Show bill preview modal
function showBillPreview(billContent, order) {
    let billModal = document.getElementById('billModal');
    if (!billModal) {
        billModal = document.createElement('div');
        billModal.id = 'billModal';
        billModal.className = 'cart-modal';
        billModal.innerHTML = `
            <div class="cart-content" style="width: 90%; max-width: 700px;">
                <div class="cart-header">
                    <h2>🧾 Order Bill Preview</h2>
                    <span class="close-btn" id="closeBill">&times;</span>
                </div>
                <div class="cart-body" style="padding: 20px;">
                    <div id="billPreview" style="white-space: pre-wrap; font-family: 'Courier New', monospace; background: linear-gradient(135deg, #f0fdf4, #dcfce7); padding: 20px; border-radius: 10px; margin-bottom: 20px; max-height: 400px; overflow-y: auto; font-size: 13px; line-height: 1.6;">
                    </div>
                    <div class="cart-footer" style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
                        <button class="btn-primary" id="downloadTxt" style="background: linear-gradient(135deg, #22c55e, #16a34a);">
                            📄 Download as TXT
                        </button>
                        <button class="btn-primary" id="downloadPdf" style="background: linear-gradient(135deg, #ef4444, #dc2626);">
                            📑 Download as PDF
                        </button>
                        <button class="btn-primary" id="closeBillBtn" style="background: linear-gradient(135deg, #6c757d, #5a6268);">
                            ✖ Close
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(billModal);
        
        document.getElementById('closeBill').addEventListener('click', () => {
            billModal.style.display = 'none';
        });
        
        document.getElementById('closeBillBtn').addEventListener('click', () => {
            billModal.style.display = 'none';
        });
        
        document.getElementById('downloadTxt').addEventListener('click', () => {
            downloadBillAsTxt(billContent, order);
        });
        
        document.getElementById('downloadPdf').addEventListener('click', () => {
            downloadBillAsPdf(billContent, order);
        });
        
        window.addEventListener('click', function(event) {
            if (event.target === billModal) {
                billModal.style.display = 'none';
            }
        });
    }
    
    const billPreview = document.getElementById('billPreview');
    if (billPreview) {
        billPreview.textContent = billContent;
    }
    
    billModal.style.display = 'flex';
    billModal.style.animation = 'fadeInUp 0.3s ease-out';
}

// Download bill as TXT
function downloadBillAsTxt(billContent, order) {
    const blob = new Blob([billContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `foodie-delight-bill-${order.orderNumber}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showNotification('Bill downloaded as TXT!', 'success');
}

// Download bill as PDF
function downloadBillAsPdf(billContent, order) {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
        <head>
            <title>Foodie Delight Bill - ${order.orderNumber}</title>
            <style>
                body { 
                    font-family: 'Courier New', monospace; 
                    margin: 40px;
                    background: white;
                }
                pre { 
                    white-space: pre-wrap;
                    font-size: 14px;
                    line-height: 1.6;
                }
                @media print {
                    body { margin: 0; }
                    pre { font-size: 12px; }
                }
            </style>
        </head>
        <body>
            <pre>${billContent}</pre>
            <script>
                window.onload = function() {
                    window.print();
                    setTimeout(function() {
                        window.close();
                    }, 1000);
                }
            <\/script>
        </body>
        </html>
    `);
    printWindow.document.close();
    showNotification('Opening print dialog for PDF...', 'success');
}

// Save cart to localStorage
function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Load cart from localStorage
function loadCartFromLocalStorage() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

// Menu page functions
function displayMenuFoods(category = 'all') {
    const menuFoods = document.getElementById('menuFoods');
    if (!menuFoods) return;
    
    menuFoods.innerHTML = '';
    
    const filteredFoods = category === 'all' 
        ? foodData 
        : foodData.filter(food => food.category === category);
    
    if (filteredFoods.length === 0) {
        menuFoods.innerHTML = '<p style="text-align: center; grid-column: 1/-1;">No items found in this category.</p>';
        return;
    }
    
    filteredFoods.forEach((food, index) => {
        const foodCard = document.createElement('div');
        foodCard.className = 'food-card';
        foodCard.style.animationDelay = `${index * 0.1}s`;
        foodCard.innerHTML = `
            <img src="${food.image}" alt="${food.name}" onerror="this.src='https://via.placeholder.com/300x200?text=Food+Image'">
            <div class="food-info">
                <h3>${food.name}</h3>
                <p>${food.description}</p>
                <span class="price">$${food.price.toFixed(2)}</span>
                <button class="add-to-cart" data-id="${food.id}">
                    <i class="fas fa-shopping-cart"></i> Add to Cart
                </button>
            </div>
        `;
        menuFoods.appendChild(foodCard);
    });
    
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const foodId = parseInt(this.getAttribute('data-id'));
            addToCart(foodId);
        });
    });
}

// Filter functionality for menu page
function setupFilterButtons() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            const category = this.getAttribute('data-category');
            displayMenuFoods(category);
        });
    });
}

// Initialize menu page
if (document.querySelector('.menu-page')) {
    document.addEventListener('DOMContentLoaded', function() {
        loadCartFromLocalStorage();
        updateCartUI();
        displayMenuFoods();
        setupFilterButtons();
        
        const cartLink = document.getElementById('cartLink');
        if (cartLink) {
            cartLink.addEventListener('click', function(e) {
                e.preventDefault();
                openCart();
            });
        }
        if (closeCart) {
            closeCart.addEventListener('click', closeCartModal);
        }
        
        window.addEventListener('click', function(event) {
            if (event.target === cartModal) {
                closeCartModal();
            }
        });
    });
}

// Initialize about page
if (document.querySelector('.about-page')) {
    document.addEventListener('DOMContentLoaded', function() {
        loadCartFromLocalStorage();
        updateCartUI();
        
        const cartLink = document.getElementById('cartLink');
        if (cartLink) {
            cartLink.addEventListener('click', function(e) {
                e.preventDefault();
                openCart();
            });
        }
        if (closeCart) {
            closeCart.addEventListener('click', closeCartModal);
        }
        
        window.addEventListener('click', function(event) {
            if (event.target === cartModal) {
                closeCartModal();
            }
        });
    });
}

// Initialize contact page
if (document.querySelector('.contact-page')) {
    document.addEventListener('DOMContentLoaded', function() {
        loadCartFromLocalStorage();
        updateCartUI();
        
        const cartLink = document.getElementById('cartLink');
        if (cartLink) {
            cartLink.addEventListener('click', function(e) {
                e.preventDefault();
                openCart();
            });
        }
        if (closeCart) {
            closeCart.addEventListener('click', closeCartModal);
        }
        
        window.addEventListener('click', function(event) {
            if (event.target === cartModal) {
                closeCartModal();
            }
        });
        
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const name = document.getElementById('name').value;
                const email = document.getElementById('email').value;
                const message = document.getElementById('message').value;
                
                if (!name || !email || !message) {
                    showNotification('Please fill in all fields!', 'error');
                    return;
                }
                
                const contactMessage = {
                    name: name,
                    email: email,
                    message: message,
                    timestamp: new Date().toISOString()
                };
                
                const messages = JSON.parse(localStorage.getItem('contactMessages')) || [];
                messages.push(contactMessage);
                localStorage.setItem('contactMessages', JSON.stringify(messages));
                
                contactForm.reset();
                showNotification('Thank you for your message! We will get back to you soon.', 'success');
            });
        }
    });
}

// Add CSS animations
const styleSheet = document.createElement("style");
styleSheet.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes fadeOut {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
        }
    }
    
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.2); }
        100% { transform: scale(1); }
    }
    
    .notification-content {
        background: white;
        padding: 15px 25px;
        border-radius: 50px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        display: flex;
        align-items: center;
        gap: 12px;
        font-weight: 600;
    }
    
    .notification-content.success {
        background: linear-gradient(135deg, #22c55e, #16a34a);
        color: white;
    }
    
    .notification-content.error {
        background: linear-gradient(135deg, #ef4444, #dc2626);
        color: white;
    }
    
    .notification-content.info {
        background: linear-gradient(135deg, #3b82f6, #2563eb);
        color: white;
    }
`;
document.head.appendChild(styleSheet);