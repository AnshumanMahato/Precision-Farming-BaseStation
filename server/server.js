const express = require("express");
const mongoose = require("mongoose");
const { database } = require("./config");
const globalErrorHandler = require("./controllers/errorController");
const cors = require("cors");
const morgan = require("morgan");
const authRoutes = require("./routes/auth");
const farmRoutes = require("./routes/farmRoutes");
const { Server } = require("socket.io");
const http = require("http");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Middleware
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/farm", farmRoutes);

app.use(globalErrorHandler);

// Socket.io
io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("joinFarm", (farmId) => {
    socket.join(farmId);
    console.log("User joined ", farmId);
  });

  socket.on("startPump", ({ farmId }) => {
    if (socket.rooms.has(farmId)) console.log("User is in room");
    socket.to(farmId).emit("startPump");
    console.log("Pump started for ", farmId);
  });

  socket.on("stopPump", ({ farmId }) => {
    socket.to(farmId).emit("stopPump");
    console.log("Pump stopped for ", farmId);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// MongoDB connection
mongoose
  .connect(database)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
