// const express = require("express");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// const User = require("../models/User");

// const router = express.Router();

// // Registration Route
// router.post("/register", async (req, res) => {
//   try {
//     console.log("Incoming request body:", req.body);

//     const { username, email, password } = req.body;

//     // Validate request body
//     if (!username || !email || !password) {
//       return res.status(400).json({ message: "All fields are required." });
//     }

//     // Check for existing user
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: "User already exists." });
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create and save new user
//     const newUser = new User({ username, email, password: hashedPassword });
//     const savedUser = await newUser.save();

//     console.log("User registered:", savedUser); // Log saved user data

//     res.status(201).json({ message: "User registered successfully!" });
//   } catch (err) {
//     console.error("Registration error:", err);
//     res.status(500).json({ error: "Registration failed." });
//   }
// });

// // Login Route
// router.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Check for user
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(404).json({ message: "User not found." });
//     }

//     // Compare passwords
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: "Invalid credentials." });
//     }

//     // Generate JWT token
//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

//     console.log("User logged in:", user); // Log user details on successful login

//     res.status(200).json({
//       message: "Login successful!",
//       token,
//       redirect: "/home.html", // Redirect to the homepage
//     });
//   } catch (err) {
//     console.error("Error logging in:", err);
//     res.status(500).json({ error: "Login failed." });
//   }
// });

// module.exports = router;
