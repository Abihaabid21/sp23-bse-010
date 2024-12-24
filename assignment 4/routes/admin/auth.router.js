const express = require('express');
const router = express.Router();
const Admin = require('../../model/admin');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../../middleware/auth.middleware');

// Register page
router.get('/admin/register', (req, res) => {
    res.render('pages/admin/auth/register', { layout:  "login-layout.ejs"});
});

// Register process
router.post('/admin/register', async (req, res) => {
    try {
        const { username, password, confirmPassword } = req.body;

        if (password !== confirmPassword) {
            return res.render('pages/admin/auth/register', {
                layout:"login-layout.ejs",
                error: 'Passwords do not match'
            });
        }

        const existingAdmin = await Admin.findOne({ username });
        if (existingAdmin) {
            return res.render('pages/admin/auth/register', {
                layout: "login-layout.ejs",
                error: 'Username already exists'
            });
        }

        await Admin.create({ username, password });
        res.redirect('/admin/login');
    } catch (error) {
        res.render('pages/admin/auth/register', {
            layout:  "login-layout.ejs",
            error: 'Registration failed'
        });
    }
});

// Login page
router.get('/admin/login', (req, res) => {
    const token = req.cookies.adminToken;
    if (token) {
        try {
            jwt.verify(token, 'your-secret-key');
            return res.redirect('/admin/dashboard');
        } catch (error) {
            res.clearCookie('adminToken');
        }
    }
    res.render('pages/admin/auth/login', { layout: "login-layout.ejs" });
});

// Login process
router.post('/admin/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const admin = await Admin.findOne({ username });

        if (!admin || !(await admin.comparePassword(password))) {
            return res.render('pages/admin/auth/login', {
                layout:"login-layout.ejs",
                error: 'Invalid username or password'
            });
        }

        // Create JWT token
        const token = jwt.sign(
            { id: admin._id, username: admin.username },
            'your-secret-key', // Use environment variable in production
            { expiresIn: '1d' }
        );

        // Set token in cookie
        res.cookie('adminToken', token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });

        res.redirect('/admin/dashboard');
    } catch (error) {
        res.render('pages/admin/auth/login', {
            layout:  "login-layout.ejs",
            error: 'Login failed'
        });
    }
});

// Logout
router.get('/admin/logout', (req, res) => {
    res.clearCookie('adminToken');
    res.redirect('/admin/login');
});

// Add this route after other routes
router.get('/admin/dashboard', authMiddleware, (req, res) => {
    res.render('pages/admin/dashboard', { 
        layout: 'admin-layout.ejs',
        admin: req.admin 
    });
});

module.exports = router; 