const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.cookies.adminToken;
    
    if (!token) {
        return res.redirect('/admin/login');
    }

    try {
        const decoded = jwt.verify(token, 'your-secret-key'); // Use environment variable in production
        req.admin = decoded;
        next();
    } catch (error) {
        res.clearCookie('adminToken');
        res.redirect('/admin/login');
    }
};

module.exports = authMiddleware; 