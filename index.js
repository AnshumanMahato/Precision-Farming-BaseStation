const express = require("express");
const path = require("path");
const { ReadlineParser } = require("@serialport/parser-readline");
const cron = require("node-cron");
const checkPorts = require("./check_ports");
const sqlite3 = require("sqlite3").verbose();
const axios = require("axios");
const { serverUrl, farmId } = require("./config");
const { io } = require("socket.io-client");

const app = express();
const port = 3001;
let esp32Port = null;
let clients = [];
const db = new sqlite3.Database(
  path.join(__dirname, "./database/sensor_data.db")
);
let pumpState = "OFF";
let lastCheckpoint = null;
const socket = io(serverUrl);

// Function to send command to the ESP32 (ON or OFF)
function sendCommand(command, response) {
  if (esp32Port && esp32Port.isOpen) {
    esp32Port.write(`${command}\n`, (err) => {
      if (err) {
        console.error("Error writing to serial port:", err.message);
        if (response) {
          response.status(500).json({ error: "Failed to send data to ESP32" });
        }
      }
      console.log(`Sent command to ESP32: ${command}`);
      pumpState = command;
      socket.emit(`${command === "ON" ? "startPump" : "stopPump"}`, { farmId });
      if (response) {
        response.json({ message: `Command sent: ${command}` });
      }
    });
  }
}

socket.on("connect", () => {
  socket.emit("joinFarm", farmId);
});

socket.on("startPump", () => {
  sendCommand("ON");
});

socket.on("stopPump", () => {
  sendCommand("OFF");
});

socket.on("disconnect", () => {
  console.log("Disconnected from remote server");
});

// Middleware to parse incoming JSON requests
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Function to set up the SerialPort
async function setupSerialPort() {
  try {
    esp32Port = await checkPorts();

    const parser = esp32Port.pipe(new ReadlineParser({ delimiter: "\n" }));

    // Listen for data from ESP32 and log it
    parser.on("data", (data) => {
      if (data.startsWith("DATA: ")) {
        const jsonString = data.trim().replace("DATA: ", "");
        const sensorData = JSON.parse(jsonString);
        sensorData.soilMoisture = (
          (sensorData.soilMoisture / 4095) *
          100
        ).toFixed(2);
        console.log("Data from ESP32:", sensorData);
        // Save the latest data
        db.run(
          `INSERT INTO sensor_data (temperature, humidity, moisture, created_at) VALUES (?, ?, ?, ?)`,
          [
            sensorData.temperature,
            sensorData.humidity,
            sensorData.soilMoisture,
            Date.now(),
          ],
          function (err) {
            if (err) {
              console.error("Error inserting data into database:", err.message);
            } else {
              latestData = this.lastID;
              console.log("Data inserted successfully");
            }
          }
        );
      }
    });

    esp32Port.on("error", (err) => {
      console.error("Serial Port Error:", err.message);
    });
  } catch (error) {
    console.error("No compatible device found or all connections failed.");
    console.error(error.message);
  }
}

// GET handler to fetch ESP32 data
app.get("/api/data", (req, res, next) => {
  if (esp32Port) {
    const headers = {
      "Content-Type": "text/event-stream",
      Connection: "keep-alive",
      "Cache-Control": "no-cache",
    };
    res.writeHead(200, headers);

    const newClient = {
      id: Date.now(),
      response: res,
    };

    clients.push(newClient);

    req.on("close", () => {
      console.log(`${newClient.id} Connection closed`);
      clients = clients.filter((client) => client.id !== newClient.id);
    });
  } else {
    res.status(404).json({ error: "ESP32 device not connected" });
  }
});

cron.schedule("*/10 * * * * *", async () => {
  if (esp32Port && esp32Port.isOpen) {
    db.all(
      `SELECT created_at AS timestamp, temperature, humidity, moisture
       FROM sensor_data
       WHERE created_at > ?
       ORDER BY timestamp ASC;`,
      [lastCheckpoint || Date.now() - 60 * 60 * 1000],
      (err, rows) => {
        if (err) {
          console.error("Error fetching data from database:", err.message);
        } else {
          const farmData = rows.map((row) => {
            const newRow = { ...row };
            newRow.temperature = Number(newRow.temperature).toFixed(2);
            newRow.humidity = Number(newRow.humidity).toFixed(2);
            newRow.moisture = Number(newRow.moisture).toFixed(2);
            newRow.created_at = newRow.timestamp;
            return newRow;
          });

          if (serverUrl && farmId) {
            axios
              .post(`${serverUrl}/api/farm/${farmId}/data`, {
                farmData,
              })
              .then((response) => {
                console.log(
                  "Data successfully sent to remote server:",
                  response.data
                );
              })
              .catch((error) => {
                console.error(
                  "Error sending data to remote server:",
                  error.message
                );
              });
          }

          if (clients.length > 0) {
            clients.forEach((client) => {
              client.response.write(
                `data: ${JSON.stringify({
                  readings: rows.map((row) => {
                    const newRow = { ...row };
                    newRow.temperature = Number(newRow.temperature).toFixed(2);
                    newRow.humidity = Number(newRow.humidity).toFixed(2);
                    newRow.moisture = Number(newRow.moisture).toFixed(2);
                    newRow.created_at = newRow.timestamp;
                    delete newRow.timestamp;
                    return newRow;
                  }),
                  pumpState,
                })}\n\n`
              );
            });
          }
          lastCheckpoint = Date.now();
        }
      }
    );
  }
});

// POST handler to send data to the serial monitor
app.get("/api/pump/:pump", (req, res) => {
  const { pump } = req.params;

  if (!pump) {
    return res.status(400).json({ error: "Input data is required" });
  }

  if (!esp32Port || !esp32Port.isOpen) {
    return res.status(500).json({ error: "Serial port not open" });
  }

  // Send data to the serial monitor
  sendCommand(pump, res);
});

// Start the server and set up the serial port
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  setupSerialPort(); // Initialize the serial port connection
});

// Close the database connection when the Node.js process exits
process.on("exit", () => {
  db.close((err) => {
    if (err) {
      console.error("Error closing database connection:", err.message);
    } else {
      console.log("Database connection closed.");
    }
  });
});

process.on("SIGINT", () => {
  process.exit();
});

process.on("SIGTERM", () => {
  process.exit();
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err.message);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});
