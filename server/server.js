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

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
