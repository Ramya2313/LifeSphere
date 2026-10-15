
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use("/api/auth", require("./routes/authRoutes"));
// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

// Health-check route
app.get("/", (req, res) => {
  res.json({
    message: "LifeSphere API is running!",
  });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found.",
  });
});

// Start server after connecting to MongoDB
async function startServer() {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(
        `LifeSphere server running at http://localhost:${PORT}`
      );
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
}

startServer();
