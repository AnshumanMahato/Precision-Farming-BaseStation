const express = require("express");
const mongoose = require("mongoose");
const { database } = require("./config");
const globalErrorHandler = require("./controllers/errorController");
const cors = require("cors");
const morgan = require("morgan");
const authRoutes = require("./routes/auth");
const farmRoutes = require("./routes/farmRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/farm", farmRoutes);

app.use(globalErrorHandler);

// MongoDB connection
mongoose
  .connect(database)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
