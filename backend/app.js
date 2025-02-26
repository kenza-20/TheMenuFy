const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// Apply middleware (Must come before routes)
app.use(cors());
app.use(express.json()); // Important for parsing JSON data
app.use(cookieParser()); // If you're using cookies

// Routes
const authRoute = require("./routes/authRoute");
app.use("/auth", authRoute);

const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  })
  .catch((err) => console.error("❌ Database connection error:", err));
