const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');

// Routes - require each router only once
const authRouter = require('./routes/admin/auth.router');
const productsRouter = require("./routes/admin/products.router");
const cartRouter = require('./routes/cart.router');
const authMiddleware = require('./middleware/auth.middleware');

// Move middleware up before routes
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"));
app.use(expressLayouts);
app.use(express.static("uploads"));

// Set view engine to EJS
app.set("view engine", "ejs");

// MongoDB connection
const connectionString = "mongodb://127.0.0.1:27017/orient";

mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log(`Connected to MongoDB at: ${connectionString}`);
})
.catch((err) => {
    console.error("MongoDB connection error:", err);
});

// Use routers
app.use(authRouter); // Auth router should come first
app.use(productsRouter);
app.use('/cart', cartRouter);

// Protect admin routes
app.use('/admin/dashboard', authMiddleware);
app.use('/admin/products', authMiddleware);
app.use('/admin/create', authMiddleware);
app.use('/categories', authMiddleware);

app.get("/", (req, res) => {
    res.render("pages/main-site-pages/home", { title: "Home Page" });
});

app.get("/cv", (req, res) => {
    res.render("pages/main-site-pages/cv", { layout:false, title: "cv Page" });
});

// Start server with error handling
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT)
    .on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.log(`Port ${PORT} is busy. Trying ${PORT + 1}...`);
            server.listen(PORT + 1);
        } else {
            console.error('Server error:', err);
        }
    })
    .on('listening', () => {
        const addr = server.address();
        console.log(`Server is running on http://localhost:${addr.port}`);
    });
