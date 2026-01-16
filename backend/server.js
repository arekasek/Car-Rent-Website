require("dotenv").config();
const express = require("express");
const cors = require("cors");

const carsRoutes = require("./routes/cars");
const bookingsRoutes = require("./routes/bookings");
const paymentsRoutes = require("./routes/payments");
const authRoutes = require("./routes/auth");
const rateLimiter = require("./middleware/rateLimiter");

const app = express();
const PORT = process.env.PORT || 5000;

// Parse multiple CORS origins from env
const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:3000")
  .split(",")
  .map((url) => url.trim());

// CORS configuration
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    maxAge: 86400,
  })
);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Rate limiting (100 requests per minute per IP/user)
app.use(rateLimiter(100, 60000));

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Car Rental API is running" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/cars", carsRoutes);
app.use("/api/bookings", bookingsRoutes);
app.use("/api/payments", paymentsRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handler middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);

  // Handle specific error types
  if (err.name === "SyntaxError" && err instanceof SyntaxError) {
    return res.status(400).json({
      error: "Invalid JSON",
      message: err.message,
    });
  }

  res.status(err.status || 500).json({
    error: err.error || "Internal server error",
    message: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

app.listen(PORT, () => {
  console.log(`🚗 Car Rental Backend running on http://localhost:${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(
    `🌐 CORS enabled for: ${
      process.env.FRONTEND_URL || "http://localhost:3000"
    }`
  );
  console.log(`🛡️  Rate limiting: 100 req/min per IP`);
});

module.exports = app;
