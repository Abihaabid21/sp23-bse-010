const express = require('express');
const router = express.Router();
const Product = require('../model/product');
const Order = require('../model/order');

// Add to cart
router.get('/add/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findById(productId);
        
        if (!product) {
            return res.status(404).redirect('/suits');
        }

        // Get existing cart from cookies or initialize new cart
        let cart = req.cookies.cart || [];
        
        // Add product to cart
        cart.push({
            id: product._id,
            name: product.name,
            price: product.price,
            picture: product.picture,
            quantity: 1
        });

        // Set cart cookie with 7 days expiration
        res.cookie('cart', cart, { maxAge: 7 * 24 * 60 * 60 * 1000 });
        
        res.redirect('/cart');
    } catch (error) {
        console.error(error);
        res.status(500).redirect('/suits');
    }
});

// View cart
router.get('/', (req, res) => {
    const cart = req.cookies.cart || [];
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    
    res.render('pages/cart', {
        layout: 'suit-layout.ejs',
        cart,
        total
    });
});

// Proceed to checkout
router.get('/checkout', (req, res) => {
    const cart = req.cookies.cart || [];
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    
    res.render('pages/checkout', {
        layout: 'suit-layout.ejs',
        cart,
        total
    });
});

// Process order
router.post('/place-order', async (req, res) => {
    try {
        const { name, email, address, paymentMethod } = req.body;
        const cart = req.cookies.cart || [];
        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

        // Create order in database
        const order = await Order.create({
            name,
            email,
            address,
            items: cart,
            total,
            paymentMethod
        });

        // Clear cart cookie
        res.clearCookie('cart');
        
        // Redirect to confirmation page
        res.render('pages/order-confirmation', {
            layout: 'suit-layout.ejs',
            order
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error processing order');
    }
});

// Update quantity
router.post('/update/:id', (req, res) => {
    const { id } = req.params;
    const { change } = req.body;
    let cart = req.cookies.cart || [];
    
    const itemIndex = cart.findIndex(item => item.id === id);
    if (itemIndex > -1) {
        cart[itemIndex].quantity = Math.max(1, cart[itemIndex].quantity + change);
        res.cookie('cart', cart, { maxAge: 7 * 24 * 60 * 60 * 1000 });
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
});

// Remove item
router.post('/remove/:id', (req, res) => {
    const { id } = req.params;
    let cart = req.cookies.cart || [];
    
    cart = cart.filter(item => item.id !== id);
    res.cookie('cart', cart, { maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.json({ success: true });
});

module.exports = router; 