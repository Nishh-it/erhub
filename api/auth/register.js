const bcrypt = require("bcrypt");
const User = require("../../models/User");

module.exports = async (req, res) => {
  if (req.method === "POST") {
    try {
      const { username, email, password } = req.body;

      // Validate request body
      if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required." });
      }

      // Check for existing user
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists." });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create and save new user
      const newUser = new User({ username, email, password: hashedPassword });
      const savedUser = await newUser.save();

      res.setHeader('Content-Type', 'application/json'); // Set Content-Type header for JSON
      res.status(201).json({ message: "User registered successfully!" });
    } catch (err) {
      console.error("Registration error:", err);
      res.status(500).json({ error: "Registration failed." });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
};
