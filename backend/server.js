require("dotenv").config();
const express = require("express");
const cors = require("cors");

const carsRoutes = require("./routes/cars");
const bookingsRoutes = require("./routes/bookings");
const paymentsRoutes = require("./routes/payments");
const authRoutes = require("./routes/auth");

const app = express();
const PORT = process.env.PORT || 5000;

// Parse multiple CORS origins from env
const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:3000")
  .split(",")
  .map((url) => url.trim());

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Car Rental API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/cars", carsRoutes);
app.use("/api/bookings", bookingsRoutes);
app.use("/api/payments", paymentsRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error("Error:", err);
  res
    .status(500)
    .json({ error: "Internal server error", message: err.message });
});

app.listen(PORT, () => {
  console.log(`🚗 Car Rental Backend running on http://localhost:${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV}`);
  console.log(`🌐 CORS enabled for: ${process.env.FRONTEND_URL}`);
});
