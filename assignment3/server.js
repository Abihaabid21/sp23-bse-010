const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const app = express();

// Middleware to parse body data for form submission
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));



app.use(expressLayouts);
// Set view engine to EJS
app.set("view engine", "ejs");
// Optional if using layouts

// Routes
app.get("/", (req, res) => {
    res.render("pages/main-site-pages/home", { title: "Home Page" });
});

app.get("/cv", (req, res) => {
    res.render("pages/main-site-pages/cv", { title: "CV Page",layout:false });
});



// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
