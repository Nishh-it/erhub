const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public")); // Ensure public folder is accessible

// Database Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log("Connected to MongoDB");
    console.log(`Connected to database: ${mongoose.connection.name}`); // Logs database name
  })
  .catch(err => console.error("Database connection error:", err));

// Debugging mongoose queries
mongoose.set("debug", true);

// Routes
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

// Export the express app for serverless functions
module.exports = app;

// Login form submission
const loginForm = document.querySelector('#loginForm');
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = loginForm.email.value.trim();
    const password = loginForm.password.value.trim();

    if (!email || !password) {
        showError('.error-message', 'Please fill in all fields.');
        return;
    }

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const text = await response.text(); // Get the raw response text
        console.log('Raw response:', text); // Log the raw response for debugging

        let data;
        try {
            data = JSON.parse(text); // Attempt to parse JSON
        } catch (err) {
            console.error('Failed to parse JSON:', err);
            showError('.error-message', 'Server responded with invalid data.');
            return;
        }

        if (response.ok) {
            alert('Login successful!');
            // Handle UI update for logged-in state
            loginForm.reset();
            logoutButton.style.display = 'inline-block';
            btnPopup.style.display = 'none';
            wrapper.classList.remove('active-popup');
        } else {
            showError('.error-message', data.message || 'Login failed.');
        }
    } catch (error) {
        console.error(error);
        showError('.error-message', 'An error occurred. Please try again.');
    }
});