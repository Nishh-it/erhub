const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Registration Route
router.post("/register", async (req, res) => {
    try {
        console.log("Incoming request body:", req.body);

        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully!" });
    } catch (err) {
        console.error("Registration error:", err);
        res.status(500).json({ error: "Registration failed." });
    }
});

// Login Route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    // JWT Token generation
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // Send the response with redirect path
    res.status(200).json({
      message: "Login successful!",
      token,
      redirect: "/home.html",  // Use the relative path from the public directory
    });

  } catch (err) {
    console.error("Error logging in:", err);  // Log the error for debugging
    res.status(500).json({ error: "Login failed." });
  }
});

module.exports = router;
