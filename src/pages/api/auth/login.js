const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");

module.exports = async (req, res) => {
  if (req.method === "POST") {
    try {
      const { email, password } = req.body;

      // Check for user
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      // Compare passwords
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials." });
      }

      // Generate JWT token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

      res.setHeader('Content-Type', 'application/json'); // Set Content-Type header for JSON
      res.status(200).json({
        message: "Login successful!",
        token,
        redirect: "/home.html", // Redirect to the homepage
      });
    } catch (err) {
      console.error("Error logging in:", err);
      res.status(500).json({ error: "A server error occurred." });  // Ensure the response is always in JSON format
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
};
